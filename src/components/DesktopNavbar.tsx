import { currentUser } from '@clerk/nextjs/server';
import React from 'react'
import { Button } from './ui/button';
import Link from 'next/link';
import { HomeIcon, MapIcon, UserIcon } from 'lucide-react';
import { SignInButton, UserButton } from '@clerk/nextjs';
import ModeToggle from './ModeToggle';

async function DesktopNavbar() {
  const user = await currentUser();
  

  return (
    <div className="hidden md:flex items-center space-x-4">
      <ModeToggle />

      <Button variant="ghost" className="flex items-center gap-2" asChild>
        <Link href="/">
          <HomeIcon className="text-primary-foreground w-4 h-4" />
          <span className="text-primary-foreground hidden lg:inline">Home</span>
        </Link>
      </Button>

      <Button variant="ghost" className="flex items-center gap-2" asChild>
        <Link href="/map">
          <MapIcon className="text-primary-foreground w-4 h-4" />
          <span className="text-primary-foreground hidden lg:inline">Pet Map</span>
        </Link>
      </Button>

      {user ? (
        <>
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link
              href={`/profile/${
                user.username ?? user.emailAddresses[0].emailAddress.split("@")[0]
              }`}
            >
              <UserIcon className="text-primary-foreground w-4 h-4" />
              <span className="text-primary-foreground hidden lg:inline">Profile</span>
            </Link>
          </Button>
          <UserButton />
        </>
      ) : (
        <SignInButton mode="modal">
          <Button className='border-background' variant="outline">Sign In</Button>
        </SignInButton>
      )}
    </div>
  );
}

export default DesktopNavbar