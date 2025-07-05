"use client";

import {
  HomeIcon,
  LogOutIcon,
  MapIcon,
  MapPin,
  MapPinX,
  MenuIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useAuth, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import ModeToggle from "./ModeToggle";

function MobileNavbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  return (
    <div className="flex md:hidden items-center space-x-2">
      <ModeToggle />
      
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <MenuIcon aria-label="Menu Button" className="text-primary-foreground h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px]">
          <SheetHeader>
            <SheetTitle className="">Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col space-y-4 mt-6">
            <Button variant="ghost" className="flex items-center gap-3 justify-start" asChild 
            onClick={() => {
              setShowMobileMenu(false)
            }}
            >
              <Link href="/">
                <HomeIcon className="w-4 h-4" />
                Home
              </Link>
            </Button>
            <Button variant="ghost" className="flex items-center gap-3 justify-start" asChild
              onClick={() => {
                setShowMobileMenu(false)
              }}
            >
              <Link href="/map">
                <MapIcon className="w-4 h-4" />
                Pet Map
              </Link>
            </Button>

            {isSignedIn ? (
              <>
                <Button variant="ghost" className="flex items-center gap-3 justify-start" asChild
                  onClick={() => {
                    setShowMobileMenu(false)
                  }}
                >
                  <Link href={'/create-post?postType=MISSING'}>
                    <MapPinX className="w-4 h-4" />
                    Lost Pet
                  </Link>
                </Button>
                <Button variant="ghost" className="flex items-center gap-3 justify-start" asChild
                  onClick={() => {
                    setShowMobileMenu(false)
                  }}
                >                  
                  <Link href={'/create-post?postType=FOUND'}>
                    <MapPin className="w-4 h-4" />
                    Found Pet
                  </Link>
                </Button>
                <Button variant="ghost" className="flex items-center gap-3 justify-start" asChild
                  onClick={() => {
                    setShowMobileMenu(false)
                  }}
                >
                  <Link href={`/profile/${
                    user?.username ?? user?.emailAddresses[0].emailAddress.split("@")[0]
                  }`}>
                    <UserIcon className="w-4 h-4" />
                    Profile
                  </Link>
                </Button>
                <SignOutButton>
                  <Button variant="outline" className="w-full"
                    onClick={() => {
                      setShowMobileMenu(false)
                    }}
                  >
                    <LogOutIcon className="w-4 h-4" />
                    Logout
                  </Button>
                </SignOutButton>
              </>
            ) : (
              <SignInButton mode="modal">
                <Button variant='outline' className="w-full"
                  onClick={() => {
                    setShowMobileMenu(false)
                  }}
                >
                  Sign In
                </Button>
              </SignInButton>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNavbar;