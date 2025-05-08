import React, { useCallback, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/DatePicker";
import { step2Schema } from "@/lib/validations/postSchemas";
import { debounce } from "@/lib/utils";
import { z } from "zod";
import { validateField } from "@/lib/validations/post";

type Step2Fields = keyof z.infer<typeof step2Schema>;

function Step2({ postForm, setPostForm }: { postForm: any; setPostForm: any }) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const debouncedValidateField = useCallback(
    debounce((name: Step2Fields, value: any) => {
      const error = validateField(step2Schema, name, value);
      setErrors((prev) => ({ ...prev, [name]: error || "" }));
    }, 300),
    []
  );

  const handleInputChange = (name: Step2Fields, value: any) => {
    setPostForm((prev: any) => ({ ...prev, [name]: value }));
    debouncedValidateField(name, value);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1 space-y-2">
        {postForm.postType === "FOUND" ? (
          <Label>When did you find the pet?</Label>
        ) : (
          <Label>When did you lose the pet?</Label>
        )}
        <DatePicker
          value={postForm.date}
          onChangeAction={(date) => handleInputChange("date", date)} // Ensure this matches DatePicker's API
        />
        {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          name="description"
          value={postForm.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="min-h-[100px]"
          placeholder="Any information about the pet"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}
      </div>
    </div>
  );
}

export default Step2;