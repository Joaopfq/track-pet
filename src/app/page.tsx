import dynamic from "next/dynamic";
import { getPosts } from "@/actions/post";
import { getDbUserId } from "@/actions/user";
import PostsList from "@/components/PostsList";

// Dynamically import PostsMapWrapper as a Client Component
const PostsMapWrapper = dynamic(() => import("@/components/PostsMapWrapper"), { ssr: false });

export default async function Home() {
  const posts = await getPosts();
  const dbUserId = await getDbUserId();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-6">
        <PostsList posts={posts} dbUserId={dbUserId} />
      </div>
      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        <PostsMapWrapper posts={posts} />
      </div>
    </div>
  );
}