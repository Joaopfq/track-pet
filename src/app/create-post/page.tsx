"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import React, { useEffect, useState } from 'react'
import { Gender, PostType, Species } from '@prisma/client'
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { mapEnumToString, mapStringToEnum } from '@/lib/utils'
import ImageUpload from '@/components/ImageUpload'

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

function CreatePost() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const postType = searchParams.get("postType");

  const [step, setStep] = useState(1);

  const next = () => setStep((prev) => prev + 1);
  const back = () => setStep((prev) => prev - 1);

  const [postForm, setPostForm] = useState({
    postType: PostType.MISSING,
    petName: "",
    species: "OTHER",
    breed: "",
    color: "",
    gender: "UNKNOWN",
    ageApprox: "",
    description: "",
    date: "",
    imageUrl: "",
    photos: [],
    location: {
      lat: 0,
      lng: 0
    },
  });

  const handleLocationSelect = (lat: number, lng: number) => {
    setPostForm((prev) => ({
      ...prev,
      location: {
        lat,
        lng
      }
    }))

  }

  return (
    <Card >
      <CardHeader>
        <CardTitle className='text-lg flex justify-between'>
          Report Pet
          <div className='font-light text-sm flex justify-end'>
            Step {step} of 4
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {step === 1 && (

          <>
            {postType === "MISSING" && (
              <div className="space-y-2">
                <Label>Pet name</Label>
                <Input
                  name="pet-name"
                  value={postForm.petName}
                  onChange={(e) => setPostForm({ ...postForm, petName: e.target.value })}
                  placeholder="Lost pet name"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>Species</Label>
              <Select
                onValueChange={(value: string) =>
                  setPostForm({
                    ...postForm,
                    species: mapStringToEnum(Species, value) || Species.OTHER,
                  })
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
            </div>
            <div className="space-y-2">
              <Label>Breed</Label>
              <Input
                name="breed"
                value={postForm.breed}
                onChange={(e) => setPostForm({ ...postForm, breed: e.target.value })}
                placeholder="Pet breed"
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <Input
                name="color"
                value={postForm.color}
                onChange={(e) => setPostForm({ ...postForm, color: e.target.value })}
                placeholder="Pet color"
              />
            </div>
            <div className="space-y-2">
              <Label>Age</Label>
              <Input
                name="age"
                value={postForm.ageApprox}
                onChange={(e) => setPostForm({ ...postForm, ageApprox: e.target.value })}
                placeholder="Approximate age of the pet"
                type='number'
              />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                onValueChange={(value: string) =>
                  setPostForm({
                    ...postForm,
                    gender: mapStringToEnum(Gender, value) || Gender.UNKNOWN,
                  })
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
            </div>
          </>
          )}

          {step === 2 && (
            <>  
              <div className="space-y-2">
                {postType === "FOUND" ? (
                  <Label>When did you find the pet?</Label>
                ) : (
                  <Label>When did you lose the pet?</Label>
                )}
                <Input
                  name="date"
                  value={postForm.date}
                  onChange={(e) => setPostForm({ ...postForm, date: e.target.value })}
                  placeholder="Date of the incident"
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
            </>
            
          )}

          {step === 3 && (
            <>
              <div className="space-y-2">
                <Label>Pet Photo </Label>
                <ImageUpload 
                  endpoint="postImage"
                  value={postForm.imageUrl}
                  onChange={(url) => {
                    setPostForm({ ...postForm, imageUrl: url })
                  }}                
                />
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="space-y-2">
                <Label>Where the pet was last seen?</Label>
                <Map onSelectAction={handleLocationSelect} />
              </div>
            </>
          )}

        </div>
      </CardContent>
      <CardFooter className='flex justify-between' >
        {step > 1 && (
          <Button className='w-32' variant="outline" onClick={back} >
            Back
          </Button>
        )}
        {step < 4 && (
          <div className='flex justify-end w-full'>
            <Button className='w-32' variant="outline" onClick={next} >
              Next
            </Button>
          </div>
        )}
        {step === 4 && (
          <Button className='w-32' variant="outline" type="submit">
            Post
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default CreatePost