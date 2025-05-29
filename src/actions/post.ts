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
    neighborhood: string,
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
        neighborhood,
      },
    });
    
    revalidatePath("/");

    return {sucess:true, post}
    
  } catch (error) {

    console.log("Failed to create post:", error);
    return { sucess: false, error: "Failed to create post" };
  }
}

export async function getPostsByProximity(lat?: number, lng?: number) {
  try {
    if (typeof lat === "number" && typeof lng === "number") {
      // Use raw SQL for distance calculation and sorting
      // Adjust "Post" to match your actual table name if necessary
      const posts = await prisma.$queryRaw<
        any[]
      >`
        SELECT 
          p.*,
          (
            6371 * acos(
              cos(radians(${lat}))
              * cos(radians(p."locationLat"))
              * cos(radians(p."locationLng") - radians(${lng}))
              + sin(radians(${lat})) * sin(radians(p."locationLat"))
            )
          ) AS distance
        FROM "Post" p
        ORDER BY distance ASC, "postedAt" DESC
        LIMIT 100
      `;

      // For each post, fetch user and comments as per your previous structure
      // Here is a simple way to hydrate related data using findMany and ids
      const postIds = posts.map(post => post.id);
      const postsWithRelations = await prisma.post.findMany({
        where: { id: { in: postIds } },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              email: true,
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
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

      // Ensure the posts are in the same order as by proximity
      const postsById: Record<string, typeof postsWithRelations[number]> = {};
      postsWithRelations.forEach(p => { postsById[p.id] = p; });
      const sorted = postIds.map(id => postsById[id]).filter(Boolean);

      return sorted;
    } else {
      // Fallback to original getPosts logic (order by postedAt)
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
              email: true,
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
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
      return posts;
    }
  } catch (error) {
    console.log("Error fetching posts by proximity:", error);
    throw new Error("Failed to fetch posts by proximity");
  }
}

export async function deletePost(postId: string) {
  try {
    const userId = await getDbUserId();

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!post) throw new Error("Post not found");
    if (post.userId !== userId) throw new Error("Unauthorized - no delete permission");

    await prisma.post.delete({
      where: { id: postId },
    });

    revalidatePath("/"); // purge the cache
    return { success: true };
    
  } catch (error) {
    console.error("Failed to delete post:", error);
    return { success: false, error: "Failed to delete post" };
  }
}