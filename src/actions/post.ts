"use server"

import { getDbUserId } from "./user";
import { prisma } from "@/lib/prisma";
import { Gender, PostStatus, PostType, Species } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createPost(
    type: PostType,
    status: PostStatus,
    petName: string,
    species: Species,
    breed: string,
    color: string,
    gender: Gender,
    ageApprox: string,
    description: string,
    photo: string,
    locationLat: number,
    locationLng: number,
    missingDate: Date | null,
  ){
  try {

    const userId = await getDbUserId();

    if(!userId) return;

    const post = await prisma.post.create({
      data: {
        type,
        status,
        petName,
        species,
        breed,
        color,
        gender,
        ageApprox,
        description,
        missingDate,
        locationLat,
        locationLng,
        photo,
        userId: userId,
      },
    });
    
    revalidatePath("/");

    return {sucess:true, post}
    
  } catch (error) {

    console.log("Failed to create post:", error);
    return { sucess: false, error: "Failed to create post" };
  }
}

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        postedAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },

        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              }
            }
          },
          orderBy: {
            createdAt: "asc",
          }
        },
      },
    });

    return posts;
  } catch (error) {
    console.log("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
}