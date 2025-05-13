"use client"

import { getProfileByUsername, getUserPosts, updateProfile } from '@/actions/profile'
import PostCard from '@/components/PostCard'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SignInButton, useUser } from '@clerk/nextjs'
import { format } from 'date-fns'
import { CalendarIcon, EditIcon, FileTextIcon, PhoneIcon } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

type User = Awaited<ReturnType<typeof getProfileByUsername>>
type Posts = Awaited<ReturnType<typeof getUserPosts>>
type Post = Posts[number];

interface ProfilePageClientProps {
  user: NonNullable<User>
  posts: Posts
}

function ProfilePageClient({posts, user}:ProfilePageClientProps) {

  const { user : currentUser} = useUser();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const [editForm, setEditForm] = useState({
    name: user.name || "",
    phone: user.phone || "",
  });

  const handleEditSubmit = async () => {
    const formData = new FormData();
    Object.entries(editForm).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await updateProfile(formData);
    if (result.success) {
      setShowEditDialog(false);
      toast.success("Profile updated successfully");
    }
  };

  const isOwnProfile =
    currentUser?.username === user.username ||
    currentUser?.emailAddresses[0].emailAddress.split("@")[0] === user.username;

  const formattedDate = format(new Date(user.createdAt), "MMMM yyyy");


  return (
    <div className="max-w-3xl mx-auto">
    <div className="grid grid-cols-1 gap-6">
      <div className="w-full max-w-lg mx-auto">
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.image ?? "/avatar.png"} />
              </Avatar>
              <h1 className="mt-4 text-2xl font-bold">{user.name ?? user.username}</h1>
              <p className="text-muted-foreground">@{user.username}</p>
              { user.phone && <p className="mt-2 text-sm">{user.phone}</p> }

              {/* PROFILE STATS */}
              <div className="w-full mt-6">
                <div className="flex justify-center mb-4">
                  <div>
                    <div className="font-semibold">{user._count.posts.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Posted Pets</div>
                  </div>
                </div>
              </div>

              {/* "EDIT PROFILE BUTTON */}
              { isOwnProfile && (
                <Button className="w-full mt-4" onClick={() => setShowEditDialog(true)}>
                  <EditIcon className="size-4 mr-2" />
                  Edit Profile
                </Button>
              )}

              {/* PHONE */}
              <div className="w-full mt-6 space-y-2 text-sm">
                {user.phone && (
                  <div className="flex items-center text-muted-foreground">
                    <PhoneIcon className="size-4 mr-2" />
                    {user.phone}
                  </div>
                )}
                <div className="flex items-center text-muted-foreground">
                  <CalendarIcon className="size-4 mr-2" />
                  Joined {formattedDate}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger
            value="posts"
            className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary
             data-[state=active]:bg-transparent px-6 font-semibold"
          >
            <FileTextIcon className="size-4" />
            Posts
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-6">
          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} post={post} dbUserId={user.id} />)
            ) : (
              <div className="text-center py-8 text-muted-foreground">No posts yet</div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                name="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-">
              <Label>Phone</Label>
              <Input
                name="phone"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                placeholder="XX-XXXXX-XXXX"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button className='bg-primary-foreground text-primary'  onClick={handleEditSubmit}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </div>
  )

  
}

export default ProfilePageClient