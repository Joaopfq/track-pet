import { getPosts } from "@/actions/post";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

function PostCard({ post, dbUserId }: { post: Post; dbUserId: string | null }) {
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex space-x-3 sm:space-x-4">
            <Link href={`/profile/${post.user.username}`}>
              <Avatar className="size-8 sm:w-10 sm:h-10">
                <AvatarImage src={post.user.image ?? "/avatar.png"} />
              </Avatar>
            </Link>

            {/* POST HEADER & TEXT CONTENT */}
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
              </div>
              <p className="mt-2 text-sm text-foreground break-words">{post.description}</p>
            </div>
          </div>

          {/* POST IMAGE */}
          {post.photo && (
            <div className="rounded-lg overflow-hidden">
              <img src={post.photo} alt="Pet photo" className="w-full h-auto object-cover" />
            </div>
          )}

          {/* LIKE & COMMENT BUTTONS */}
          

          {/* COMMENTS SECTION */}
          
        </div>
      </CardContent>
    </Card>
  )
}

export default PostCard;