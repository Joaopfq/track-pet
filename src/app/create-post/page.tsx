"use client"

import Map from '@/components/Map'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import React, { useState } from 'react'
import { Gender, PostType, Species } from '@prisma/client'

function CreatePost() {

  const [step, setStep] = useState(1);

  const next = () => setStep((prev) => prev + 1);
  const back = () => setStep((prev) => prev - 1);

  const [postForm, setPostForm] = useState({
    postType: PostType.MISSING,
    petName: "",
    species: Species.DOG,
    breed: "",
    color: "",
    gender: Gender.UNKNOWN,
    ageApprox: "",
    description: "",
    missingDate: "",
    photos: [],
  });

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
            <div className="space-y-2">
              <Label>Pet name</Label>
              <Input
                name="pet-name"
                value={postForm.petName}
                onChange={(e) => setPostForm({ ...postForm, petName: e.target.value })}
                placeholder="Lost pet name"
              />
            </div>
            <div className="space-y-2">
              <Label>Species</Label>
              <Input
                name="species"
                value={postForm.species}
                onChange={(e) => setPostForm({ ...postForm, species: e.target.value })}
                placeholder="Pet Species"
              />
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
                onValueChange={(value) => setPostForm({ ...postForm, gender: value as Gender })}
                value={postForm.gender}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pet Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Gender.MALE}>Male </SelectItem>
                  <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                  <SelectItem value={Gender.UNKNOWN}>Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
          )}

          {step === 2 && (
            <>  
              <div className="space-y-2">
                <Label>Missing Date</Label>
                <Input
                  name="date"
                  value={postForm.missingDate}
                  onChange={(e) => setPostForm({ ...postForm, missingDate: e.target.value })}
                  placeholder="When did you lose the pet?"
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
                <Label>Photos</Label>
                <Input
                  name="photos"
                  type="file"
                  accept="image/*"
                  multiple
                  // onChange={ TODO }
                />
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="space-y-2">
                <Label>Location</Label>
                <Map />
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