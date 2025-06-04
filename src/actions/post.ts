"use server"

import { getDbUserId } from "./user";
import { prisma } from "@/lib/prisma";
import { Gender, PostStatus, PostType, Species } from "@prisma/client";
import { revalidatePath } from "next/cache";
import redis from "@/lib/redis";

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
) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;

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
        userId,
        neighborhood,
      },
    });

    revalidatePath("/");
    return { sucess: true, post };
  } catch (error) {
    console.log("Failed to create post:", error);
    return { sucess: false, error: "Failed to create post" };
  }
}

export async function getPostsByProximity(
  lat?: number,
  lng?: number,
  page: number = 1,
  perPage: number = 20
) {
  const cacheKey = lat !== undefined && lng !== undefined
    ? `posts:proximity:${lat}:${lng}:page:${page}:perPage:${perPage}`
    : `posts:recent:page:${page}:perPage:${perPage}`;

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  let posts;
  if (typeof lat === "number" && typeof lng === "number") {
    const offset = (page - 1) * perPage;
    posts = await prisma.$queryRaw<any[]>`
      SELECT 
        p.*,
        u.id as "userId",
        u.name as "userName",
        u.username as "userUsername",
        u.image as "userImage",
        u.email as "userEmail",
        (
          6371 * acos(
            cos(radians(${lat}))
            * cos(radians(p."locationLat"))
            * cos(radians(p."locationLng") - radians(${lng}))
            + sin(radians(${lat})) * sin(radians(p."locationLat"))
          )
        ) AS distance
      FROM "Post" p
      JOIN "User" u ON u.id = p."userId"
      ORDER BY distance ASC, p."postedAt" DESC
      LIMIT ${perPage}
      OFFSET ${offset}
    `;

    posts = posts.map(post => ({
      ...post,
      user: {
        id: post.userId,
        name: post.userName,
        username: post.userUsername,
        image: post.userImage,
        email: post.userEmail,
      }
    }));
  } else {
    posts = await prisma.post.findMany({
      orderBy: {
        postedAt: "desc",
      },
      take: perPage,
      skip: (page - 1) * perPage,
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
      },
    });
  }

  await redis.set(cacheKey, JSON.stringify(posts), "EX", 120);

  return posts;
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

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete post:", error);
    return { success: false, error: "Failed to delete post" };
  }
}