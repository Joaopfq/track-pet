"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAppSelector } from "@/lib/hooks";
import { getPostsByProximity } from "@/actions/post";
import PostsList from "@/components/PostsList";

type Posts = Awaited<ReturnType<typeof getPostsByProximity>>;
type Post = Posts[number];

const PER_PAGE = 20;

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
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loader = useRef<HTMLDivElement | null>(null);
  const lastLocation = useRef<{ lat: number | null; lng: number | null }>({
    lat: null,
    lng: null,
  });

  // Reset when location or search changes
  useEffect(() => {
    setPosts(initialPosts);
    setPage(1);
    setHasMore(true);
    lastLocation.current = {
      lat: location.latitude,
      lng: location.longitude
    };
  }, [
    initialPosts,
    location.latitude,
    location.longitude,
    searchQuery,
  ]);

  // When location changes from no location to provided, fetch proximity posts immediately for page 1
  useEffect(() => {
    if (
      location.latitude !== null &&
      location.longitude !== null &&
      (lastLocation.current.lat !== location.latitude ||
        lastLocation.current.lng !== location.longitude)
    ) {
      setIsLoading(true);
      getPostsByProximity(
        location.latitude,
        location.longitude,
        1,
        PER_PAGE
      ).then((proximityPosts) => {
        setPosts(proximityPosts);
        setIsLoading(false);
        setHasMore(proximityPosts.length === PER_PAGE);
        setPage(1);
        lastLocation.current = {
          lat: location.latitude,
          lng: location.longitude
        };
      });
    }
  }, [location.latitude, location.longitude]);

  // Infinite scroll logic
  const fetchMorePosts = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    const nextPage = page + 1;
    let newPosts: Post[] = [];
    if (location.latitude !== null && location.longitude !== null) {
      newPosts = await getPostsByProximity(
        location.latitude,
        location.longitude,
        nextPage,
        PER_PAGE
      );
    } else {
      newPosts = await getPostsByProximity(
        undefined,
        undefined,
        nextPage,
        PER_PAGE
      );
    }
    setPosts((prev) => {
      // Avoid duplicates
      const ids = new Set(prev.map((p) => p.id));
      return [...prev, ...newPosts.filter((p) => !ids.has(p.id))];
    });
    setPage(nextPage);
    setIsLoading(false);
    setHasMore(newPosts.length === PER_PAGE);
  }, [
    isLoading,
    hasMore,
    page,
    location.latitude,
    location.longitude,
  ]);

  useEffect(() => {
    if (!loader.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMorePosts();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [fetchMorePosts]);

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

  return (
    <>
      <PostsList posts={filteredPosts} dbUserId={dbUserId} />
      {hasMore && (
        <div ref={loader} style={{ height: 40, textAlign: "center" }}>
          {isLoading ? "Loading more..." : ""}
        </div>
      )}
    </>
  );
}