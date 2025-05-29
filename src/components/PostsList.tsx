import { getPostsByProximity } from "@/actions/post";
import PostCard from "@/components/PostCard";

type Posts = Awaited<ReturnType<typeof getPostsByProximity>>;
type Post = Posts[number];

export default function PostsList({ posts, dbUserId }: { posts: Post[]; dbUserId: string | null }) {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} dbUserId={dbUserId} />
      ))}
    </div>
  );
}