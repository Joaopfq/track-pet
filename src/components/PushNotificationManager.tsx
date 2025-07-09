'use client'
 
import { useState, useEffect } from 'react'
import { subscribeUser, unsubscribeUser, sendNotification } from '../actions/notification'
import { BellOff, BellRing } from 'lucide-react'
import { Button } from './ui/button'
import { urlBase64ToUint8Array } from '@/lib/utils'

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  )
  const [message, setMessage] = useState('TESTE NOTIFICATION')
 
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      registerServiceWorker()
    }
  }, [])
 
  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    })
    const sub = await registration.pushManager.getSubscription()
    setSubscription(sub)
  }
 
  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    })
    setSubscription(sub)
    const serializedSub = JSON.parse(JSON.stringify(sub))
    await subscribeUser(serializedSub)
  }
 
  async function unsubscribeFromPush() {
    await subscription?.unsubscribe()
    setSubscription(null)
    await unsubscribeUser()
  }
 
  async function sendTestNotification() {
    if (subscription) {
      await sendNotification(message)
      setMessage('')
    }
  }
 
  if (!isSupported) {
    return <></>
  }
 
  return (
    <div>
      {subscription ? (
        <>
          <Button variant="ghost" className="flex items-center gap-3 justify-start cursor-pointer" asChild onClick={unsubscribeFromPush} >
            <span>
              <BellRing className="w-4 h-4" />
              Turn Off Notifications
            </span>
          </Button>
          <Button onClick={sendTestNotification}>Send Test</Button>
        </>
      ) : (
        <>
          <Button variant="ghost" className="flex items-center gap-3 justify-start cursor-pointer" asChild onClick={subscribeToPush} >
            <span>
              <BellOff className="w-4 h-4" />
              Turn On Notifications
            </span>
          </Button>
        </>
      )}
    </div>
  )
}