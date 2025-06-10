"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { getPostsByProximity } from "@/actions/post";
import Image from 'next/image'

type Posts = Awaited<ReturnType<typeof getPostsByProximity>>;
type Post = Posts[number];

interface PostsMapProps {
  posts: Post[];
  userLocation?: { lat: number; lng: number };
  loading?: boolean;
}


function RecenterMap({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng]);
  }, [center.lat, center.lng, map]);
  return null;
}

export default function PostsMap({ posts, userLocation, loading }: PostsMapProps) {
  const BRAZIL_CENTER = { lat: -14.235004, lng: -51.92528 };
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(userLocation || BRAZIL_CENTER);
  
  const defaultIcon = useMemo(() => L.icon({
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    }), []);
  
  const userIcon = useMemo(() =>
    L.icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    }), []);

  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
    }
  }, [userLocation]);

  return (
    <div className="sticky top-20">
      {loading && (
        <div className="absolute z-[1000] w-full h-full flex items-center justify-center bg-black bg-opacity-30 rounded-xl">
          <span className="text-white text-lg font-medium animate-pulse">
            Loading map...
          </span>
        </div>
      )}
      <MapContainer
        aria-label="Posts map"
        className="rounded-xl"
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={15}
        style={{ height: "500px", width: "100%" }}
      >
        <RecenterMap center={mapCenter} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {posts.map((post) => {
          if (post.locationLat == null || post.locationLng == null) return null;
          return (
            <Marker
              key={post.id}
              position={[post.locationLat, post.locationLng]}
              icon={defaultIcon}
            >
              <Popup>
                {post.photo && (
                  <>
                    <Image
                      src={post.photo}
                      width={100}
                      height={100}
                      alt="Post popup image"
                    />
                    <br />
                  </>
                )}
                {post.type && (
                  <>
                    {post.type}
                    <br />
                  </>
                )}
                {post.neighborhood && <>Last seen: {post.neighborhood}</>}
              </Popup>
            </Marker>
          );
        })}

        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userIcon}
          >
            <Popup>
              <strong>Your location</strong>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}