"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import React, { Suspense, useEffect, useState } from 'react';
import { Gender, PostType, Species } from '@prisma/client';
import { useRouter, useSearchParams } from "next/navigation";
import { mapStringToEnum } from '@/lib/utils';
import { createPost } from '@/actions/post';
import toast from "react-hot-toast";
import Step4 from '@/components/formSteps/Step4';
import Step3 from '@/components/formSteps/Step3';
import Step2 from '@/components/formSteps/Step2';
import Step1 from '@/components/formSteps/Step1';
import { z } from 'zod';
import { combinedSchema } from '@/lib/validations/postSchemas';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';

async function fetchNeighborhood(lat: number, lng: number): Promise<string | null> {
  const url = `/api/leaflet?lat=${lat}&lon=${lng}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.neighborhood;
  } catch (error) {
    toast.error("Failed to fetch neighborhood data");
    throw new Error("Failed to fetch neighborhood data");
  }
}

function CreatePost() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/');
    }
  }, [isSignedIn, router]);
  
  const searchParams = useSearchParams();

  const postType = searchParams.get("postType");

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
    neighborhood: string;
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
    neighborhood: "",
    location: {
      lat: 0,
      lng: 0,
    },
  });
  postForm.postType = postType as PostType;

  const handleSubmit = async () => {
    try {
      combinedSchema.parse(postForm);

      if (postForm.location.lat === 0 && postForm.location.lng === 0) {
        toast.error("Please select a location on the map.");
        return;
      }
      const neighborhood = await fetchNeighborhood(postForm.location.lat, postForm.location.lng);

      if (!neighborhood) {
        toast.error("Failed to fetch neighborhood. Please try again.");
        return;
      }

      const updatedPostForm = { ...postForm, neighborhood };

      const result = await createPost(
        updatedPostForm.postType,
        "ACTIVE",
        updatedPostForm.petName,
        mapStringToEnum(Species, updatedPostForm.species) || Species.OTHER,
        updatedPostForm.breed,
        updatedPostForm.color,
        mapStringToEnum(Gender, updatedPostForm.gender) || Gender.UNKNOWN,
        updatedPostForm.ageApprox,
        updatedPostForm.description,
        updatedPostForm.imageUrl,
        updatedPostForm.location.lat,
        updatedPostForm.location.lng,
        updatedPostForm.date ? updatedPostForm.date : null,
        updatedPostForm.neighborhood
      );

      if (result?.success) {
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
          neighborhood: "",
        });

        toast.success("Post created successfully");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Please fill out all required fields correctly.");
      } else {
        toast.error("Failed to create post");
      }
    }
  };

  return (
    <Card>
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
      <CardFooter className='flex justify-between'>
        {step > 1 && (
          <Button className='w-32' variant="outline" onClick={back}>
            Back
          </Button>
        )}
        {step < 4 && (
          <div className='flex justify-end w-full'>
            <Button className='w-32' variant="outline" onClick={next}>
              Next
            </Button>
          </div>
        )}
        {step === 4 && (
        <Link href="/">
          <Button
            className='w-32 bg-white text-black hover:bg-white/80 border border-black'
            variant="outline"
            type="submit"
            onClick={handleSubmit}
          >
            Post
          </Button>
        </Link>
        )}
      </CardFooter>
    </Card>
  );
}

export default function CreatePostPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreatePost />
    </Suspense>
  );
}