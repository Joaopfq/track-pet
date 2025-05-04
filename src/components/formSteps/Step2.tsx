import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/DatePicker";

function Step2({ postForm, setPostForm }: { postForm: any; setPostForm: any }) {
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
          onChangeAction={(date) => setPostForm({ ...postForm, date })}
        />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          name="description"
          value={postForm.description}
          onChange={(e) => setPostForm({ ...postForm, description: e.target.value })}
          className="min-h-[100px]"
          placeholder="Any information about the pet"
        />
      </div>
    </div>
  );
}

export default Step2;