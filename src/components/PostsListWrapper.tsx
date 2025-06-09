"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { getPostsByProximity } from "@/actions/post";
import PostsList from "@/components/PostsList";

type Posts = Awaited<ReturnType<typeof getPostsByProximity>>;
type Post = Posts[number];

export default function PostsListWrapper({
  initialPosts,
  dbUserId,
}: {
  initialPosts: Post[];
  dbUserId: string | null;
}) {
  const location = useAppSelector((state) => state.location);
  const searchQuery = useAppSelector((state) => state.search?.query ?? "");
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  useEffect(() => {
    async function fetchProximityPosts() {
      if (location.latitude !== null && location.longitude !== null) {
        const proximityPosts = await getPostsByProximity(location.latitude, location.longitude);
        setPosts(proximityPosts);
      } else {
        setPosts(initialPosts);
      }
    }
    fetchProximityPosts();
  }, [location.latitude, location.longitude, initialPosts]);

  const filteredPosts = posts.filter((post) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.petName?.toLowerCase().includes(query) ||
      post.type?.toLowerCase().includes(query) ||
      post.species?.toLowerCase().includes(query) ||
      post.breed?.toLowerCase().includes(query) ||
      post.neighborhood?.toLowerCase().includes(query) ||
      post.description?.toLowerCase().includes(query)
    );
  });

  return <PostsList posts={filteredPosts} dbUserId={dbUserId} />;
}