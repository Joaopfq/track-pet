"use server"

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server"
import { th } from "date-fns/locale";

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) return;

    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      }
    })

    if(existingUser) return;

    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
        phone: user.phoneNumbers[0]?.phoneNumber,
      }
    })

    return dbUser;

  } catch (error) {
    throw new Error("Failed to sync user");
  }
}

export async function getUserByClerkId(clerkId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
      include: {
        _count: {
          select: {
            posts: {
              where: {
                status: "ACTIVE"
              }
            }
          }
        }
      }
    })

    return user;
  } catch (error) {
    throw new Error("Failed to fetch user by Clerk ID");
  }
}

export async function getDbUserId(){
  const {userId:clerkId} = await auth();
  
  if(!clerkId) return null;

  const user =  await getUserByClerkId(clerkId);

  if(!user) throw new Error("User not found");

  return user.id
}