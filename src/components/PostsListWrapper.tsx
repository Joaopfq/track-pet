"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { getPostsByProximity } from "@/actions/post";
import PostsList from "@/components/PostsList";

type Posts = Awaited<ReturnType<typeof getPostsByProximity>>;
type Post = Posts[number];

export default function PostsListWrapper({ initialPosts, dbUserId }: { initialPosts: Post[]; dbUserId: string | null }) {
  const location = useAppSelector((state) => state.location);
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  useEffect(() => {
    async function fetchProximityPosts() {
      if (location.latitude !== null && location.longitude !== null) {
        const proximityPosts = await getPostsByProximity(location.latitude, location.longitude);
        setPosts(proximityPosts);
      }
    }
    fetchProximityPosts();
  }, [location.latitude, location.longitude]);

  return <PostsList posts={posts} dbUserId={dbUserId} />;
}