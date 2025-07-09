'use server'

import { PrismaClient } from '@prisma/client'
import webpush, { PushSubscription as WebPushSubscription } from 'web-push'
import { getDbUserId } from './user'

const prisma = new PrismaClient()

webpush.setVapidDetails(
  'mailto:jpfq.dev@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)


export async function subscribeUser(sub: any) {
  const userId = await getDbUserId()
  if (!userId) throw new Error('User not authenticated')

  if (
    !sub ||
    !sub.endpoint ||
    !sub.keys?.p256dh ||
    !sub.keys?.auth
  ) {
    throw new Error('Invalid subscription object')
  }

  await prisma.pushSubscription.upsert({
    where: { endpoint: sub.endpoint },
    update: {
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
      expiration: sub.expirationTime ? new Date(sub.expirationTime) : null,
      userId,
    },
    create: {
      endpoint: sub.endpoint,
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
      expiration: sub.expirationTime ? new Date(sub.expirationTime) : null,
      user: { connect: { id: userId } },
    },
  })
  return { success: true }
}

export async function unsubscribeUser() {
  const userId = await getDbUserId()
  if (!userId) throw new Error('User not authenticated')

  await prisma.pushSubscription.deleteMany({
    where: { userId }
  })
  return { success: true }
}


export async function sendNotification(message: string) {
  const userId = await getDbUserId()
  if (!userId) throw new Error('User not authenticated')

  const subscriptions = await prisma.pushSubscription.findMany({ where: { userId } })
  if (!subscriptions.length) {
    throw new Error('No push subscription found for user')
  }

  let successCount = 0
  let errorCount = 0

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        JSON.stringify({
          title: 'Track Pet Notification',
          body: message,
          icon: '/icons/paw-192.png',
        })
      )
      successCount++
    } catch (err) {
      const statusCode =
        typeof err === 'object' &&
        err !== null &&
        'statusCode' in err
          ? (err as any).statusCode
          : undefined
      if (statusCode === 410 || statusCode === 404) {
        await prisma.pushSubscription.delete({ where: { endpoint: sub.endpoint } })
      }
      errorCount++
      console.error('Push error:', err)
    }
  }

  await prisma.notification.create({
    data: {
      userId,
      content: message,
      read: false,
    },
  })

  return { success: true, sent: successCount, failed: errorCount }
}