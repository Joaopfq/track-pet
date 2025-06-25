"use client";

import { MapPin, MapPinX, Plus, Dog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { PostType } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import { CircleUserRound } from 'lucide-react';

export default function FloatingPostButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  function handleSelect(type: PostType) {
    router.push(`/create-post?type=${type}`);
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black z-40"
            style={{ pointerEvents: "auto" }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            className="sm:hidden fixed bottom-6 right-6 rounded-full p-0 bg-foreground size-16 text-background shadow-lg hover:bg-foreground/90 z-50 flex items-center justify-center"
            aria-label="Create post"
            style={{ transition: "box-shadow 0.2s" }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {!open ? (
                <motion.span
                  key="plus"
                  initial={{ rotate: 0, scale: 1, opacity: 1 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex"
                >
                  <Plus className="text-background" size={56} strokeWidth={3} />
                </motion.span>
              ) : (
                <motion.span
                  key="dog"
                  initial={{ rotate: -90, scale: 0.7, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 0, scale: 1, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex"
                >
                  <Dog className="text-background" size={56} strokeWidth={3} />
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-36 shadow-none bg-transparent border-transparent flex flex-col gap-2 p-2 z-50"
          sideOffset={8}
          >
          { isSignedIn ? (
            <>
              <div className="flex items-center justify-end">
                <p className="font-bold mr-2 text-white ">Lost</p>
                <Button
                  variant="ghost"
                  className="w-full justify-center rounded-full p-0 bg-foreground size-10 text-background shadow-lg hover:bg-primary/90 z-50"
                  onClick={() => handleSelect(PostType.MISSING)}
                >
                  <MapPinX />
                </Button>
              </div>
              <div className="flex items-center justify-end">
                <p className="font-bold mr-2 text-white ">Found</p>
                <Button
                  variant="ghost"
                  className="w-full justify-center rounded-full p-0 bg-foreground size-10 text-background shadow-lg hover:bg-primary/90 z-50"
                  onClick={() => handleSelect(PostType.FOUND)}
                >
                  <MapPin />
                </Button>
              </div>            
            </>
          ) : (
            <SignInButton mode="modal">
              <div className="flex items-center justify-end">
                <p className="font-bold mr-2 text-white ">Sign in</p>
                <Button
                  variant="ghost"
                  className="w-full justify-center rounded-full p-0 bg-foreground size-10 text-background shadow-lg hover:bg-primary/90 z-50"
                >
                  <CircleUserRound />
                </Button>
              </div>  
            </SignInButton>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
}