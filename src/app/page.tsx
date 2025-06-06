import dynamic from "next/dynamic";
import { getPostsByProximity } from "@/actions/post";
import { getDbUserId } from "@/actions/user";
import PostsListWrapper from "@/components/PostsListWrapper";

const PostsMapWrapper = dynamic(() => import("@/components/PostsMapWrapper"), { ssr: false });

export default async function Home() {
  const posts = await getPostsByProximity();
  const dbUserId = await getDbUserId();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-6">
        <PostsListWrapper initialPosts={posts} dbUserId={dbUserId} />
      </div>
      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        <PostsMapWrapper initialPosts={posts} />
      </div>
    </div>
  );
}