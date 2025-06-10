"use client";

import { deletePost, getPostsByProximity } from "@/actions/post";
import { Card, CardContent} from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import toast from "react-hot-toast";
import { DeleteAlertDialog } from "./DeleteAlertDialog";
import ShareDropdown from "./ShareDropdown";
import Image from 'next/image'

type Posts = Awaited<ReturnType<typeof getPostsByProximity>>;
type Post = Posts[number];

function PostCard({ post, dbUserId }: { post: Post; dbUserId: string | null }) {
  
  const [seeMore, setSeeMore] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const handleDeletePost = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      const result = await deletePost(post.id);
      if (result.success) toast.success("Post deleted successfully");
      else throw new Error(result.error);
    } catch (error) {
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card id={post.id} className="overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex space-x-3 sm:space-x-4">
            <Link href={`/profile/${post.user.username}`}>
              <Avatar className="size-8 sm:w-10 sm:h-10">
                <AvatarImage alt="User image" src={post.user.image ?? "/avatar.png"} />
              </Avatar>
            </Link>

            {/* POST USER HEADER */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 truncate">
                  <Link
                    href={`/profile/${post.user.username}`}
                    className="font-semibold truncate"
                  >
                    {post.user.name}
                  </Link>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Link href={`/profile/${post.user.username}`}>@{post.user.username}</Link>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(post.postedAt))} ago</span>
                  </div>
                </div>
                {dbUserId === post.user.id && (
                  <DeleteAlertDialog isDeleting={isDeleting} onDeleteAction={handleDeletePost} />
                )}
              </div>
            </div>
          </div>

          {/* POST PET HEADER */}
          <h1 className={post.type === "MISSING" ? "text-destructive font-extrabold" : "text-chart-1 font-extrabold"}>
            { post.type === "MISSING" ? "LOST PET" : "FOUND PET"}            
          </h1>


          {/* POST IMAGE */}
          {post.photo && (
            <div className="rounded-lg overflow-hidden">
                <Image
                  src={post.photo}
                  width={500}
                  height={500}
                  alt="Picture of the pet"
                />
            </div>
          )}

          {/* POST SHARE */}
          <div className="flex  justify-end items-center">
              <ShareDropdown
                url={`${baseUrl}/#${post.id}`}
                title={`${post.id}`}
              />
          </div>         

          {/* POST CONTENT */}
          <div className="flex flex-col sm:flex-row sm:justify-stretch">
            <div className="pl-0 sm:pl-0 sm:pr-4">
              {post.petName && (
                <div className="text-sm text-muted-foreground">
                  <strong>Pet Name:</strong> {post.petName}
                </div>
              )}
              {post.species && post.color && (
                <div className="mt-2 text-sm text-muted-foreground">
                  <strong>Breed:</strong> {post.breed} {post.color}
                </div>
              )}
              {post.gender && (
                <div className="mt-2 text-sm text-muted-foreground">
                  <strong>Gender:</strong> {post.gender}
                </div>
              )}
            </div>
            <div>
              {post.ageApprox && (
                <div className="text-sm text-muted-foreground">
                  <strong>Age:</strong> {post.ageApprox}
                </div>
              )}
              {post.neighborhood && (
                <div className="mt-2 text-sm text-muted-foreground">
                  <strong>Last seen:</strong> {post.neighborhood}
                </div>
              )}
              {post.user.email && (
                <div className="mt-2 text-sm text-muted-foreground">
                  <strong>Contact: </strong>                  
                  <Link
                    href={`mailto:${post.user.email}`}
                    className="text-chart-5 hover:underline">
                    {post.user.email}     
                  </Link>                  
                </div>
              )}
            </div>
          </div>

          {/* POST SEE MORE */}
          <button
            onClick={() => setSeeMore(!seeMore)}
            className="text-chart-5 hover:underline ml-1"
          >
            {seeMore ? "" : "See More"}
          </button>

          { seeMore && (
            <div className="mt-2 text-sm text-muted-foreground">
              {post.description && (
                <div>
                  <strong>Description: </strong> 
                  {post.description}
                  
                </div>
              )}
            </div>
          )}
          
        </div>
      </CardContent>
    </Card>
  )
}

export default PostCard;