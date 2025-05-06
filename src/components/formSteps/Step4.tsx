import React, { useCallback, useState } from "react";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";
import { debounce } from "@/lib/utils";
import { validateField } from "@/lib/validations/post";
import { z } from "zod";
import { step4Schema } from "@/lib/validations/postSchemas";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });
type Step4Fields = keyof z.infer<typeof step4Schema>;

function Step4({ postForm, setPostForm }: { postForm: any; setPostForm: any }) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const debouncedValidateField = useCallback(
    debounce((name: Step4Fields, value: any) => {
      const error = validateField(step4Schema, name, value);
      setErrors((prev) => ({ ...prev, [name]: error || "" }));
    }, 300),
    []
  );

  const handleLocationSelect = (lat: number, lng: number) => {
    const location = { lat, lng };
    setPostForm((prev: any) => ({
      ...prev,
      location,
    }));

    debouncedValidateField("location", location);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Where the pet was last seen?</Label>
        <Map onSelectAction={handleLocationSelect} />
        {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
      </div>
    </div>
  );
}

export default Step4;