import { getProfileByUsername, getUserPosts} from '@/actions/profile'
import { notFound } from 'next/navigation';
import React from 'react'
import ProfilePageClient from './ProfilePage';


export async function generateMetadata({params}: {params: {username: string}}) {
  
  const user = await getProfileByUsername(params.username);

  if (!user) return null;

  return {
    title: `${user.name ?? user.username}`,
    description: `Welcome to ${user.name ?? user.username}'s profile`,
  };
}


async function ProfilePageServer({params}: {params: {username: string}}) {

  const user = await getProfileByUsername(params.username);
  if (!user) notFound();

  const post = await getUserPosts(user.id);


  return (
    <ProfilePageClient 
    user={user}
    posts={post}
    />
  )
}

export default ProfilePageServer