"use client";

import { MapPin, MapPinX, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { PostType } from "@prisma/client";

export default function FloatingPostButton() {
  const router = useRouter();

  function handleSelect(type: PostType) {
    router.push(`/create-post?type=${type}`);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="sm:hidden fixed bottom-6 right-6 rounded-full p-0 bg-foreground size-16 text-primary shadow-lg hover:bg-primary/90 z-50"
          aria-label="Create post"
        >
          <Plus size={40} strokeWidth={3} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-36 flex flex-col gap-2 p-2"
        sideOffset={8}
      >
        <Button          
          variant="ghost"
          className="w-full justify-start"
          onClick={() => handleSelect(PostType.MISSING)}
        >
          <MapPinX />
          Lost
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => handleSelect(PostType.FOUND)}
        >
          <MapPin />
          Found
        </Button>
      </PopoverContent>
    </Popover>
  );
}