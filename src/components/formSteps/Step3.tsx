import React, { useCallback, useState } from "react";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/ImageUpload";
import { z } from "zod";
import { step3Schema } from "@/lib/validations/postSchemas";
import { debounce } from "@/lib/utils";
import { validateField } from "@/lib/validations/post";

type Step3Fields = keyof z.infer<typeof step3Schema>;

function Step3({ postForm, setPostForm }: { postForm: any; setPostForm: any }) {

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const debouncedValidateField = useCallback(
    debounce((name: Step3Fields, value: any) => {
      const error = validateField(step3Schema, name, value);
      setErrors((prev) => ({ ...prev, [name]: error || "" }));
    }, 300),
    []
  );

  const handleInputChange = (name: Step3Fields, value: any) => {
    setPostForm((prev: any) => ({ ...prev, [name]: value }));
    debouncedValidateField(name, value);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Pet Photo</Label>
        <ImageUpload
          endpoint="postImage"
          value={postForm.imageUrl}
          onChange={(url) => {
            handleInputChange( "imageUrl", url );
          }}
        />
        {errors.imageUrl && <p className="text-red-500 text-sm">{errors.imageUrl}</p>}
      </div>
    </div>
  );
}

export default Step3;