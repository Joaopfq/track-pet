import { currentUser } from '@clerk/nextjs/server'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { Button } from './ui/button';
import { getUserByClerkId } from '@/actions/user';
import Link from 'next/link';
import { Avatar, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { LinkIcon, MapPinIcon } from 'lucide-react';

async function Sidebar() {
  
  const authUser = await currentUser();

  if(!authUser) return <UnAuthenticatedSidebar />

  const user = await getUserByClerkId(authUser.id);
  if(!user) return null

  return (
    <div className="sticky top-20">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Link
              href={`/profile/${user.username}`}
              className="flex flex-col items-center justify-center"
            >
              <Avatar className="w-20 h-20 border-2 ">
                <AvatarImage src={user.image || "/avatar.png"} />
              </Avatar>

              <div className="mt-4 space-y-1">
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm">{user.username}</p>
              </div>
            </Link>

            {user.phone && <p className="mt-3 text-sm">{user.phone}</p>}

            <div className="w-full">
              <Separator className="my-4" />
              <div className="flex justify-center">
                <div>
                  <p className="font-medium">{user._count.posts}</p>
                  <p className="text-xs">Posted Pets</p>
                </div>
                <Separator orientation="vertical" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Sidebar;


const UnAuthenticatedSidebar = () => (
  <div className="sticky top-20">
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-xl font-semibold">Welcome Back!</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center mb-4">
          Login to find your lost pet or help others find theirs.
        </p>
        <SignInButton mode="modal">
          <Button className="w-full" variant="outline">
            Login
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button className="w-full mt-2 border text-primary bg-primary-foreground" variant="outline">
            Sign Up
          </Button>
        </SignUpButton>
      </CardContent>
    </Card>
  </div>
)