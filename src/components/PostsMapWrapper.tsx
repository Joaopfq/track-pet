"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { clearLocation, setLocation } from "@/lib/features/location/locationSlice";
import PostsMap from "@/components/PostsMap";
import toast from "react-hot-toast";
import { getPosts } from "@/actions/post";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRadians = (degree: number) => (degree * Math.PI) / 180;
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function isLocationValid(location: { latitude: number | null; longitude: number | null }): location is { latitude: number; longitude: number } {
  return location.latitude !== null && location.longitude !== null;
}

export default function PostsMapWrapper({ posts }: { posts: Post[] }) {
  const [sortedPosts, setSortedPosts] = useState<Post[]>(posts);
  const location = useAppSelector((state) => state.location);
  const dispatch = useAppDispatch();

  useEffect(() => {
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

  useEffect(() => {
    if (posts.length > 0 && isLocationValid(location)) {
      const sorted = [...posts].sort((postA, postB) => {
        const distanceA = calculateDistance(
          location.latitude,
          location.longitude,
          postA.locationLat,
          postA.locationLng
        );
        const distanceB = calculateDistance(
          location.latitude,
          location.longitude,
          postB.locationLat,
          postB.locationLng
        );
        return distanceA - distanceB;
      });

      setSortedPosts(sorted);
    } else {
      setSortedPosts(posts);
    }
  }, [posts, location]);

  return (
    <PostsMap
      posts={sortedPosts}
      userLocation={
        location.latitude !== null && location.longitude !== null
          ? { lat: location.latitude, lng: location.longitude }
          : undefined
      }
    />
  );
}