"use server";

import { getDbUserId } from "./user";
import { prisma } from "@/lib/prisma";
import { Gender, PostStatus, PostType, Prisma, Species } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redis } from "@/lib/redis";
import geolib from 'geolib';
import { sendNotification } from '../actions/notification'

export async function notifyNearbyUsers(
  postLat: number,
  postLng: number,
  message: string,
  radiusMeters = 5000
) {
  // Find users who have location and at least one push subscription
  const usersWithSubs = await prisma.user.findMany({
    where: {
      locationLat: { not: null },
      locationLng: { not: null },
      pushSubscriptions: {
        some: {}, // at least one push subscription
      },
    },
    include: { pushSubscriptions: true },
  });
 
  // Filter by proximity
  const nearbyUsers = usersWithSubs
  .filter(user => user.locationLat !== null && user.locationLng !== null)
  .filter(user =>
    geolib.getDistance(
      { latitude: postLat, longitude: postLng },
      { latitude: user.locationLat as number, longitude: user.locationLng as number }
    ) < radiusMeters
  );

  // Send notifications to nearby users who allowed it
  let sent = 0;
  let failed = 0;

  for (const user of nearbyUsers) {
    const result = await sendNotification(user.id, message);
    sent += result.sent;
    failed += result.failed;
  }

  return { success: true, sent, failed };
}

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

    //await notifyNearbyUsers(locationLat, locationLng, `Nearby Pet ${PostType}, help it find its way home!`);
    await invalidatePostsCache();
    revalidatePath("/");
    return { success: true, post };
  } catch (error) {
    return { success: false, error: "Failed to create post" };
  }
}

export async function getPostsByProximity(
  lat?: number,
  lng?: number,
  page: number = 1,
  perPage: number = 20,
  searchQuery?: string
) {
  // Caching only for no search
  const cacheKey = lat !== undefined && lng !== undefined && !searchQuery
    ? `posts:proximity:${lat}:${lng}:page:${page}:perPage:${perPage}`
    : `posts:recent:page:${page}:perPage:${perPage}${searchQuery ? `:search:${searchQuery}` : ""}`;

  if (!searchQuery) {
    const cached = await redis.get(cacheKey);
    if (typeof cached === "string") {
      return JSON.parse(cached);
    }
  }

  // Build search filter: only use "contains" for string fields,
  // and exact match (equality) for enums if query matches an enum value
  const filters: Prisma.PostWhereInput[] = [];
  if (searchQuery) {
    filters.push(
      { petName: { contains: searchQuery, mode: "insensitive" } },
      { breed: { contains: searchQuery, mode: "insensitive" } },
      { neighborhood: { contains: searchQuery, mode: "insensitive" } },
      { description: { contains: searchQuery, mode: "insensitive" } }
    );
    // enums: only add filter if searchQuery matches an enum value
    if (Object.values(PostType).includes(searchQuery.toUpperCase() as PostType)) {
      filters.push({ type: searchQuery.toUpperCase() as PostType });
    }
    if (Object.values(Species).includes(searchQuery.toUpperCase() as Species)) {
      filters.push({ species: searchQuery.toUpperCase() as Species });
    }
  }

  let posts;
  // If searching, ignore proximity. Just do Prisma search, order by postedAt DESC.
  if (searchQuery && searchQuery.trim() !== "") {
    posts = await prisma.post.findMany({
      where: filters.length > 0 ? { OR: filters } : undefined,
      orderBy: { postedAt: "desc" },
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
    // Don't cache search results
    return posts;
  }

  // If not searching, and location is available, use raw SQL to order by proximity
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

    await redis.set(cacheKey, JSON.stringify(posts), { ex: 120 });
    return posts;
  }

  // Fallback: just order by postedAt DESC (recent posts)
  posts = await prisma.post.findMany({
    orderBy: { postedAt: "desc" },
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

  await redis.set(cacheKey, JSON.stringify(posts), { ex: 120 });
  return posts;
}

async function invalidatePostsCache() {
  const keys = await redis.keys("posts:proximity*");
  const keysRecent = await redis.keys("posts:recent*");
  const allKeys = [...keys, ...keysRecent];
  if (allKeys.length > 0) {
    await redis.del(...allKeys);
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

    await invalidatePostsCache();

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete post" };
  }
}
