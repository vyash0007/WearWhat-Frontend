"use client"

import { useState, useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Camera, LogOut, Edit3, Heart, MessageCircle, Settings, Crown, X, Check } from "lucide-react"
import ShirtLoader from "@/components/ui/ShirtLoader"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { userService } from "@/lib/api/user"
import { postsService } from "@/lib/api/posts"
import { useAuth } from "@/lib/context"
import type { Post } from "@/lib/api/posts"
import { useRouter } from "next/navigation"
import { PostCard } from "@/components/social/PostCard"
import { PostDetail } from "@/components/social/PostDetail"
import UpgradeToProModal from "@/components/dashboard/UpgradeToProModal"
import ProfileImageCropModal from "@/components/dashboard/ProfileImageCropModal"

export default function ProfilePage() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { logout } = useAuth()
    const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts")
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [isEditingName, setIsEditingName] = useState(false)
    const [editedFirstName, setEditedFirstName] = useState("")
    const [editedLastName, setEditedLastName] = useState("")
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
    const [isUploadingImage, setIsUploadingImage] = useState(false)
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
    const [selectedImageForCrop, setSelectedImageForCrop] = useState<File | null>(null)

    // Fetch user profile with React Query
    const { data: userProfile, isLoading: profileLoading, error: profileError, refetch: refetchProfile } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const response = await userService.getProfile()
            return response.user
        },
    })

    // Fetch user's posts with React Query
    const { data: userPosts = [], isLoading: postsLoading } = useQuery({
        queryKey: ['posts', 'myPosts'],
        queryFn: async () => {
            const response = await postsService.getMyPosts(20, 0)
            console.log("Profile posts response:", response)
            return response?.posts || []
        },
    })

    // Fetch saved posts with React Query
    const { data: savedPosts = [], isLoading: savedLoading } = useQuery({
        queryKey: ['posts', 'saved'],
        queryFn: async () => {
            const response = await postsService.getSavedPosts(20, 0)
            console.log("Saved posts response:", response)
            return response?.posts || []
        },
    })

    const loading = profileLoading || postsLoading || savedLoading

    // Set initial values for editing when profile loads
    useEffect(() => {
        if (userProfile) {
            setEditedFirstName(userProfile.first_name)
            setEditedLastName(userProfile.last_name)
        }
    }, [userProfile])

    const handleLogout = async () => {
        try {
            await logout()
            router.push("/")
        } catch (err) {
            console.error("Error logging out:", err)
            router.push("/")
        }
    }

    const handleDeletePost = async (postId: string) => {
        try {
            await postsService.delete(postId)
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        } catch (err) {
            console.error("Error deleting post:", err)
            alert("Failed to delete post")
        }
    }

    const handleLike = async (postId: string) => {
        try {
            const response = await postsService.like(postId)
            console.log(`Like response for post ${postId}:`, response)
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        } catch (err) {
            console.error("Error liking post:", err)
        }
    }

    const handleSave = async (postId: string) => {
        try {
            const response = await postsService.save(postId)
            console.log(`Save response for post ${postId}:`, response)
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        } catch (err) {
            console.error("Error saving post:", err)
        }
    }

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName[0]}${lastName[0]}`.toUpperCase()
    }

    const handleSaveName = async () => {
        if (!editedFirstName.trim() || !editedLastName.trim()) {
            alert("First name and last name are required")
            return
        }

        try {
            setIsUpdatingProfile(true)
            await userService.updateProfile({
                first_name: editedFirstName.trim(),
                last_name: editedLastName.trim(),
            })
            queryClient.invalidateQueries({ queryKey: ['profile'] })
            setIsEditingName(false)
        } catch (err) {
            console.error("Error updating profile:", err)
            alert("Failed to update profile")
        } finally {
            setIsUpdatingProfile(false)
        }
    }

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setSelectedImageForCrop(file)
        e.target.value = ""
    }

    const handleCroppedImageUpload = async (croppedFile: File) => {
        try {
            setIsUploadingImage(true)
            await userService.uploadProfileImage(croppedFile)
            queryClient.invalidateQueries({ queryKey: ['profile'] })
            setSelectedImageForCrop(null)
        } catch (err) {
            console.error("Error uploading image:", err)
            alert("Failed to upload profile image")
        } finally {
            setIsUploadingImage(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen p-4 md:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-16">
                    <ShirtLoader size="xl" />
                    <p className="text-muted-foreground mt-4">Loading profile...</p>
                </div>
            </div>
        )
    }

    if (profileError || !userProfile) {
        return (
            <div className="min-h-screen p-4 md:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                        <X className="h-8 w-8 text-destructive" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Failed to load profile</h3>
                    <p className="text-muted-foreground mt-1">{profileError instanceof Error ? profileError.message : "Unknown error"}</p>
                    <Button onClick={() => refetchProfile()} className="mt-4">Try Again</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-4 md:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Profile Header */}
                <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                        {/* Avatar */}
                        <div className="relative group">
                            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-xl">
                                {userProfile.profile_image_url ? (
                                    <AvatarImage src={userProfile.profile_image_url} alt={`${userProfile.first_name} ${userProfile.last_name}`} />
                                ) : null}
                                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                                    {getInitials(userProfile.first_name, userProfile.last_name)}
                                </AvatarFallback>
                            </Avatar>
                            <label className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Camera className="h-4 w-4" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageSelect}
                                    disabled={isUploadingImage}
                                />
                            </label>
                            {isUploadingImage && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                                    <ShirtLoader size="sm" />
                                </div>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
                                <div>
                                    {isEditingName ? (
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <input
                                                type="text"
                                                value={editedFirstName}
                                                onChange={(e) => setEditedFirstName(e.target.value)}
                                                className="text-2xl md:text-3xl font-bold text-foreground bg-transparent border-b-2 border-primary focus:outline-none w-32"
                                                placeholder="First name"
                                            />
                                            <input
                                                type="text"
                                                value={editedLastName}
                                                onChange={(e) => setEditedLastName(e.target.value)}
                                                className="text-2xl md:text-3xl font-bold text-foreground bg-transparent border-b-2 border-primary focus:outline-none w-32"
                                                placeholder="Last name"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={handleSaveName}
                                                disabled={isUpdatingProfile}
                                            >
                                                {isUpdatingProfile ? (
                                                    <ShirtLoader size="sm" />
                                                ) : (
                                                    <Check className="h-4 w-4 text-green-500" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => {
                                                    setIsEditingName(false)
                                                    setEditedFirstName(userProfile.first_name)
                                                    setEditedLastName(userProfile.last_name)
                                                }}
                                                disabled={isUpdatingProfile}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                                                {userProfile.first_name} {userProfile.last_name}
                                            </h1>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => setIsEditingName(true)}
                                            >
                                                <Edit3 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                    <p className="text-muted-foreground">{userProfile.email}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="gap-2 bg-transparent">
                                        <Settings className="h-4 w-4" />
                                        Settings
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="gap-2 text-destructive hover:text-destructive bg-transparent"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </Button>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-6">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-foreground">{userPosts.length}</p>
                                    <p className="text-sm text-muted-foreground">Posts</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-foreground">{savedPosts.length}</p>
                                    <p className="text-sm text-muted-foreground">Saved</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-foreground">0</p>
                                    <p className="text-sm text-muted-foreground">Followers</p>
                                </div>
                            </div>

                            {/* Pro Badge or Upgrade */}
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 bg-transparent"
                                onClick={() => setIsUpgradeModalOpen(true)}
                            >
                                <Crown className="h-4 w-4 text-amber-500" />
                                Upgrade to Pro
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-border">
                    <button
                        onClick={() => setActiveTab("posts")}
                        className={cn(
                            "px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
                            activeTab === "posts"
                                ? "border-primary text-foreground"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                    >
                        My Posts
                    </button>
                    <button
                        onClick={() => setActiveTab("saved")}
                        className={cn(
                            "px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
                            activeTab === "saved"
                                ? "border-primary text-foreground"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Saved
                    </button>
                </div>

                {/* Posts Grid */}
                {activeTab === "posts" && (
                    <>
                        <PostDetail
                            post={selectedPost}
                            isOpen={isDetailOpen}
                            onClose={() => setIsDetailOpen(false)}
                            onLike={handleLike}
                            onSave={handleSave}
                            isLiked={selectedPost?.is_liked ?? false}
                            isSaved={selectedPost?.is_saved ?? false}
                        />
                        {userPosts.length > 0 ? (
                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                                {userPosts.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        onDelete={handleDeletePost}
                                        onLike={handleLike}
                                        onSave={handleSave}
                                        isLiked={post.is_liked}
                                        isSaved={post.is_saved}
                                        onCommentClick={(p) => {
                                            setSelectedPost(p)
                                            setIsDetailOpen(true)
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                    <MessageCircle className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground">No posts yet</h3>
                                <p className="text-muted-foreground mt-1">Share your first outfit with the community</p>
                            </div>
                        )}
                    </>
                )}

                {/* Saved Posts Grid */}
                {activeTab === "saved" && (
                    <>
                        {savedPosts.length > 0 ? (
                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                                {savedPosts.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        onLike={handleLike}
                                        onSave={handleSave}
                                        isLiked={post.is_liked}
                                        isSaved={post.is_saved}
                                        onCommentClick={(p) => {
                                            setSelectedPost(p)
                                            setIsDetailOpen(true)
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                    <Heart className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground">No saved posts yet</h3>
                                <p className="text-muted-foreground mt-1">Save posts from the community to see them here</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Upgrade to Pro Modal */}
            <UpgradeToProModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
            />

            {/* Profile Image Crop Modal */}
            {selectedImageForCrop && (
                <ProfileImageCropModal
                    imageFile={selectedImageForCrop}
                    onClose={() => setSelectedImageForCrop(null)}
                    onCropComplete={handleCroppedImageUpload}
                    isUploading={isUploadingImage}
                />
            )}
        </div>
    )
}
