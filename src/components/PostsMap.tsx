"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getPosts } from "@/actions/post";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

interface PostsMapProps {
  posts: Post[];
  userLocation?: { lat: number; lng: number };
}

export default function PostsMap({ posts, userLocation }: PostsMapProps) {
  // Default center of the map (either user's location or fallback to { lat: 0, lng: 0 })
  const defaultCenter = userLocation || { lat: 0, lng: 0 };

  return (
    <MapContainer
      className="sticky top-20 rounded-xl"    
      center={[defaultCenter.lat, defaultCenter.lng]}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Render markers for all posts */}
      {posts.map((post) => {
        // Safeguard against invalid coordinates
        if (post.locationLat == null || post.locationLng == null) return null;

        return (
          <Marker
            key={post.id}
            position={[post.locationLat, post.locationLng]}
            icon={L.icon({
              iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
          >
            <Popup>
              <img
                src={post.photo}
                alt="Post photo"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
              <br />
              {post.type}
              <br />
              Last seen: {post.neighborhood}
            </Popup>
          </Marker>
        );
      })}

      {/* Add a marker for the user's location, if available */}
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={L.icon({
            iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          })}
        >
          <Popup>
            <strong>Your Location</strong>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}