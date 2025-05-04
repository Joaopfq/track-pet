"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useState } from 'react'
import { Gender, PostType, Species } from '@prisma/client'
import { useSearchParams } from "next/navigation";
import { mapStringToEnum } from '@/lib/utils'
import { createPost } from '@/actions/post'
import Step4 from '@/components/formSteps/Step4'
import Step3 from '@/components/formSteps/Step3'
import Step2 from '@/components/formSteps/Step2'
import Step1 from '@/components/formSteps/Step1'

function CreatePost() {
  const searchParams = useSearchParams();

  const postType = searchParams.get("postType");
  
  console.log("postType", postType);

  const [step, setStep] = useState(1);

  const next = () => setStep((prev) => prev + 1);
  const back = () => setStep((prev) => prev - 1);

  const [postForm, setPostForm] = useState<{
    postType: PostType;
    petName: string;
    species: string;
    breed: string;
    color: string;
    gender: string;
    ageApprox: string;
    description: string;
    date: Date | undefined;
    imageUrl: string;
    location: {
      lat: number;
      lng: number;
    };
  }>({
    postType: "MISSING",
    petName: "",
    species: "OTHER",
    breed: "",
    color: "",
    gender: "UNKNOWN",
    ageApprox: "",
    description: "",
    date: undefined,
    imageUrl: "",
    location: {
      lat: 0,
      lng: 0,
    },
  });
  postForm.postType = postType as PostType;

  const handleSubmit = async () => {
    try {
      const result = await createPost(
        postForm.postType,
        "ACTIVE",
        postForm.petName,
        mapStringToEnum(Species, postForm.species) || Species.OTHER,
        postForm.breed,
        postForm.color,
        mapStringToEnum(Gender, postForm.gender) || Gender.UNKNOWN,
        postForm.ageApprox,
        postForm.description,
        postForm.imageUrl,
        postForm.location.lat,
        postForm.location.lng,
        postForm.date ? postForm.date : null,
      );

      if(result?.sucess){
        setPostForm({
          postType: "MISSING",
          petName: "",
          species: "OTHER",
          breed: "",
          color: "",
          gender: "UNKNOWN",
          ageApprox: "",
          description: "",
          date: undefined,
          imageUrl: "",
          location: {
            lat: 0,
            lng: 0,
          },
        })

        //toast.success("Post created sucessfully");
        console.log("Post created sucessfully", result.post);
      }

    } catch (error) {
      //toast.error("Fail to create post")
      console.log("Failed to create post:", error);
    } finally{
      //setIsPosting(false)
    }
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
          {step === 1 && <Step1 postForm={postForm} setPostForm={setPostForm} />}
          {step === 2 && <Step2 postForm={postForm} setPostForm={setPostForm} />}
          {step === 3 && <Step3 postForm={postForm} setPostForm={setPostForm} />}
          {step === 4 && <Step4 postForm={postForm} setPostForm={setPostForm} />}
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
          <Button
            className='w-32 bg-white text-black hover:bg-white/80 border border-black' 
            variant="outline" 
            type="submit"
            onClick={handleSubmit}
          >
            Post
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default CreatePost