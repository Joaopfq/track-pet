"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getPosts } from "@/actions/post";
import { getDbUserId } from "@/actions/user";
import PostCard from "@/components/PostCard";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { clearLocation, setLocation } from "@/lib/features/location/locationSlice";

// Dynamically import PostsMap with no SSR
const PostsMap = dynamic(() => import("@/components/PostsMap"), { ssr: false });

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

function isLocationValid(location: { latitude: number | null; longitude: number | null }): location is { latitude: number; longitude: number } {
  return location.latitude !== null && location.longitude !== null;
}

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

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [sortedPosts, setSortedPosts] = useState<Post[]>([]);
  const [dbUserId, setDbUserId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const location = useAppSelector((state) => state.location);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedPosts = await getPosts();
        const fetchedDbUserId = await getDbUserId();
        setPosts(fetchedPosts);
        setDbUserId(fetchedDbUserId);
      } catch (error) {
        toast.error("Failed to fetch posts or user ID");
      }
    };

    fetchData();
  }, []);

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

  useEffect(() => {
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
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-6">
        <div className="space-y-6">
          {sortedPosts.map((post) => (
            <PostCard key={post.id} post={post} dbUserId={dbUserId} />
          ))}
        </div>
      </div>
      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        <PostsMap
          posts={sortedPosts}
          userLocation={
            location.latitude !== null && location.longitude !== null
              ? { lat: location.latitude, lng: location.longitude }
              : undefined
          }  
        />
      </div>
    </div>
  );
}