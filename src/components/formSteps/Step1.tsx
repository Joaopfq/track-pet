import React, { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gender, Species } from "@prisma/client";
import { debounce, mapEnumToString, mapStringToEnum } from "@/lib/utils";
import { step1Schema } from "@/lib/validations/postSchemas";
import { z } from "zod";
import { validateField } from "@/lib/validations/post";

type Step1Fields = keyof z.infer<typeof step1Schema>;

function Step1({ postForm, setPostForm }: { postForm: any; setPostForm: any }) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const debouncedValidateField = useCallback(
    debounce((name: Step1Fields, value: any) => {
      const error = validateField(step1Schema, name, value);
      setErrors((prev) => ({ ...prev, [name]: error || "" }));
    }, 300),
    []
  );

  const handleInputChange = (name: Step1Fields, value: any) => {
    setPostForm((prev: any) => ({ ...prev, [name]: value }));
    debouncedValidateField(name, value);
  };

  return (
    <div className="space-y-4">
      {postForm.postType === "MISSING" && (
        <div className="space-y-2">
          <Label>Pet name</Label>
          <Input
            name="pet-name"
            value={postForm.petName}
            onChange={(e) => handleInputChange("petName", e.target.value)}
            placeholder="Lost pet name"
          />
          {errors.petName && <p className="text-red-500 text-sm">{errors.petName}</p>}
        </div>
      )}
      <div className="space-y-2">
        <Label>Species</Label>
        <Select
          onValueChange={(value: string) =>
            handleInputChange("species", mapStringToEnum(Species, value) || Species.OTHER)
          }
          value={mapEnumToString(postForm.species)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pet Species" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DOG">Dog</SelectItem>
            <SelectItem value="CAT">Cat</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.species && <p className="text-red-500 text-sm">{errors.species}</p>}
      </div>
      <div className="space-y-2">
        <Label>Breed</Label>
        <Input
          name="breed"
          value={postForm.breed}
          onChange={(e) => handleInputChange("breed", e.target.value)}
          placeholder="Pet breed"
        />
        {errors.breed && <p className="text-red-500 text-sm">{errors.breed}</p>}
      </div>
      <div className="space-y-2">
        <Label>Color</Label>
        <Input
          name="color"
          value={postForm.color}
          onChange={(e) => handleInputChange("color", e.target.value)}
          placeholder="Pet color"
        />
        {errors.color && <p className="text-red-500 text-sm">{errors.color}</p>}
      </div>
      <div className="space-y-2">
        <Label>Age</Label>
        <Input
          name="age"
          value={postForm.ageApprox}
          onChange={(e) => handleInputChange("ageApprox", e.target.value)}
          placeholder="Approximate age of the pet"
          type="number"
        />
        {errors.ageApprox && <p className="text-red-500 text-sm">{errors.ageApprox}</p>}
      </div>
      <div className="space-y-2">
        <Label>Gender</Label>
        <Select
          onValueChange={(value: string) =>
            handleInputChange("gender", mapStringToEnum(Gender, value) || Gender.UNKNOWN)
          }
          value={mapEnumToString(postForm.gender)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pet Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MALE">Male</SelectItem>
            <SelectItem value="FEMALE">Female</SelectItem>
            <SelectItem value="UNKNOWN">Unknown</SelectItem>
          </SelectContent>
        </Select>
        {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
      </div>
    </div>
  );
}

export default Step1;