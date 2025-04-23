import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href="/create-post">
        <Button className=" bg-muted hover:bg-muted/80 size-14 fixed bottom-6 right-6 rounded-full shadow-lg w-2xl text-3xl">
          +
        </Button>
      </Link>
    </div>
  );
}
