"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getPostsByProximity } from "@/actions/post";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { clearLocation, setLocation } from "@/lib/features/location/locationSlice";

const PostsMap = dynamic(() => import("@/components/PostsMap"), { ssr: false });

type Posts = Awaited<ReturnType<typeof getPostsByProximity>>;
type Post = Posts[number];

function isLocationValid(location: { latitude: number | null; longitude: number | null }): location is { latitude: number; longitude: number } {
  return location.latitude !== null && location.longitude !== null;
}

function MapPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const dispatch = useAppDispatch();
  const location = useAppSelector((state) => state.location);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedPosts = await getPostsByProximity();
        setPosts(fetchedPosts);
      } catch (error) {
        toast.error("Failed to fetch posts");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Only attempt to fetch location if it's not already stored
    if (!isLocationValid(location)) {
      if (typeof window !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            dispatch(setLocation({ latitude: userLat, longitude: userLon }));
          },
          (error) => {
            toast.error("Failed to retrieve user location");
            dispatch(clearLocation());
          }
        );
      } else {
        toast.error("Geolocation is not supported by this browser.");
      }
    }
  }, [dispatch, location]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <PostsMap
        posts={posts}
        userLocation={
          isLocationValid(location)
            ? { lat: location.latitude, lng: location.longitude }
            : undefined
        }
      />
    </div>
  );
}

export default MapPage;