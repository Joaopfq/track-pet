"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setLocation, clearLocation } from "@/lib/features/location/locationSlice";
import { getPostsByProximity } from "@/actions/post";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

const PostsMap = dynamic(() => import("@/components/PostsMap"), { ssr: false,
  loading: () => <div style={{ height: 500, background: "#eee" }}>Loading map…</div>
 });

type Posts = Awaited<ReturnType<typeof getPostsByProximity>>;
type Post = Posts[number];

export default function PostsMapWrapper({ initialPosts }: { initialPosts: Post[] }) {
  const location = useAppSelector((state) => state.location);
  const dispatch = useAppDispatch();
  const [posts, setPosts] = useState<Post[]>(initialPosts ?? []);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        let postsRes: Post[];
        if (
          location.latitude !== null &&
          location.longitude !== null
        ) {
          postsRes = await getPostsByProximity(location.latitude, location.longitude);
        } else {
          postsRes = await getPostsByProximity();
        }
        setPosts(postsRes);
      } catch (e) {
        toast.error("Failed to fetch map posts.");
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [location.latitude, location.longitude]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      navigator.geolocation &&
      (location.latitude === null || location.longitude === null)
    ) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          dispatch(
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            })
          );
        },
        () => {
          toast.error("Unable to get your location.");
          dispatch(clearLocation());
        }
      );
    }
  }, [dispatch, location.latitude, location.longitude]);

  return (
    <PostsMap
      posts={posts}
      userLocation={
        location.latitude !== null && location.longitude !== null
          ? { lat: location.latitude, lng: location.longitude }
          : undefined
      }
      loading={loading}
    />
  );
}