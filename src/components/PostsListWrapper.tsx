"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAppSelector } from "@/lib/hooks";
import { getPostsByProximity } from "@/actions/post";
import PostsList from "@/components/PostsList";
import { LoadingSpinner } from "./LoadingSpinner";

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
  const lastLocation = useRef<{ lat: number | null; lng: number | null; search: string }>({
    lat: null,
    lng: null,
    search: "",
  });

  // When location or search changes, reset posts and page and fetch new
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setIsLoading(true);

    const fetchInitialPosts = async () => {
      let postsData: Post[];
      if (location.latitude !== null && location.longitude !== null) {
        postsData = await getPostsByProximity(
          location.latitude,
          location.longitude,
          1,
          PER_PAGE,
          searchQuery
        );
      } else {
        postsData = await getPostsByProximity(
          undefined,
          undefined,
          1,
          PER_PAGE,
          searchQuery
        );
      }
      setPosts(postsData);
      setIsLoading(false);
      setHasMore(postsData.length === PER_PAGE);
      lastLocation.current = {
        lat: location.latitude,
        lng: location.longitude,
        search: searchQuery,
      };
    };
    fetchInitialPosts();
  }, [
    location.latitude,
    location.longitude,
    searchQuery,
  ]);

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
        PER_PAGE,
        searchQuery
      );
    } else {
      newPosts = await getPostsByProximity(
        undefined,
        undefined,
        nextPage,
        PER_PAGE,
        searchQuery
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
    searchQuery,
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

  return (
    <>
      <PostsList posts={posts} dbUserId={dbUserId} />
      {hasMore && (
        <div ref={loader} className="flex justify-center items-center my-4">
          {isLoading ? <LoadingSpinner /> : ""}
        </div>
      )}
    </>
  );
}
