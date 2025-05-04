import React from "react";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/ImageUpload";

function Step3({ postForm, setPostForm }: { postForm: any; setPostForm: any }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Pet Photo</Label>
        <ImageUpload
          endpoint="postImage"
          value={postForm.imageUrl}
          onChange={(url) => {
            setPostForm({ ...postForm, imageUrl: url });
          }}
        />
      </div>
    </div>
  );
}

export default Step3;