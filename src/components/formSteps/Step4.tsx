import React from "react";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

function Step4({ postForm, setPostForm }: { postForm: any; setPostForm: any }) {
  const handleLocationSelect = (lat: number, lng: number) => {
    setPostForm((prev: any) => ({
      ...prev,
      location: { lat, lng },
    }));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Where the pet was last seen?</Label>
        <Map onSelectAction={handleLocationSelect} />
      </div>
    </div>
  );
}

export default Step4;