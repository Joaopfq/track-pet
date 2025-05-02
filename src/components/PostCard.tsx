import { getPosts } from "@/actions/post";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

function PostCard({ post, dbUserId }: { post: Post; dbUserId: string | null }) {
  
  console.log("PostCard", post);
  return (
    <div>
      <h1> {post.petName} </h1>
    </div>
  )
}

export default PostCard;