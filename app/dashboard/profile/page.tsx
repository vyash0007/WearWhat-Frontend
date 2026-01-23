"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Camera, LogOut, Edit3, Heart, MessageCircle, MoreHorizontal, Trash2, Settings, Crown, X } from "lucide-react"
import ShirtLoader from "@/components/ui/ShirtLoader"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { userService } from "@/lib/api/user"
import { postsService } from "@/lib/api/posts"
import { authService } from "@/lib/api/auth"
import { savedImagesService } from "@/lib/api/savedImages"
import type { UserProfile } from "@/lib/api/user"
import type { Post } from "@/lib/api/posts"
import { useRouter } from "next/navigation"
import { PostCard } from "@/components/social/PostCard"
import { PostDetail } from "@/components/social/PostDetail"

export default function ProfilePage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts")
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [userPosts, setUserPosts] = useState<Post[]>([])
    const [savedCount, setSavedCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [isEditingName, setIsEditingName] = useState(false)
    const [editedFirstName, setEditedFirstName] = useState("")
    const [editedLastName, setEditedLastName] = useState("")
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
    const [isUploadingImage, setIsUploadingImage] = useState(false)

    useEffect(() => {
        fetchProfileData()
    }, [])

    const fetchProfileData = async () => {
        try {
            setLoading(true)
            setError(null)

            // Fetch user profile
            const profileResponse = await userService.getProfile()
            setUserProfile(profileResponse.user)

            // Fetch user's posts
            const postsResponse = await postsService.getMyPosts(20, 0)
            console.log("Profile posts response:", postsResponse)
            if (postsResponse && postsResponse.posts) {
                setUserPosts(postsResponse.posts)
            } else {
                console.warn("Unexpected posts response format:", postsResponse)
                setUserPosts([])
            }

            // Fetch saved images count
            const savedImages = await savedImagesService.getAll()
            setSavedCount(savedImages.length)

            // Set initial values for editing
            setEditedFirstName(profileResponse.user.first_name)
            setEditedLastName(profileResponse.user.last_name)
        } catch (err: any) {
            console.error("Error fetching profile data:", err)
            setError(err.message || "Failed to load profile")
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            await authService.logout()
            router.push("/login")
        } catch (err) {
            console.error("Error logging out:", err)
            // Still redirect to login even if logout fails
            router.push("/login")
        }
    }

    const handleDeletePost = async (postId: string) => {
        try {
            await postsService.delete(postId)
            setUserPosts(prev => prev.filter(post => post.id !== postId))
        } catch (err) {
            console.error("Error deleting post:", err)
            alert("Failed to delete post")
        }
    }

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName[0]}${lastName[0]}`.toUpperCase()
    }

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (seconds < 60) return 'just now'
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
        return `${Math.floor(seconds / 604800)}w ago`
    }

    const handleSaveName = async () => {
        if (!editedFirstName.trim() || !editedLastName.trim()) {
            alert("First name and last name are required")
            return
        }

        try {
            setIsUpdatingProfile(true)
            const response = await userService.updateProfile({
                first_name: editedFirstName.trim(),
                last_name: editedLastName.trim(),
            })
            setUserProfile(response.user)
            setIsEditingName(false)
        } catch (err) {
            console.error("Error updating profile:", err)
            alert("Failed to update profile")
        } finally {
            setIsUpdatingProfile(false)
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            setIsUploadingImage(true)
            const response = await userService.uploadProfileImage(file)
            setUserProfile(response.user)
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

    if (error || !userProfile) {
        return (
            <div className="min-h-screen p-4 md:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                        <X className="h-8 w-8 text-destructive" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Failed to load profile</h3>
                    <p className="text-muted-foreground mt-1">{error}</p>
                    <Button onClick={fetchProfileData} className="mt-4">Try Again</Button>
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
                                    onChange={handleImageUpload}
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
                                    <p className="text-2xl font-bold text-foreground">{savedCount}</p>
                                    <p className="text-sm text-muted-foreground">Saved</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-foreground">0</p>
                                    <p className="text-sm text-muted-foreground">Followers</p>
                                </div>
                            </div>

                            {/* Pro Badge or Upgrade */}
                            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
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
                            isLiked={false} // Profile page doesn't track likes in state yet, could be added
                        />
                        {userPosts.length > 0 ? (
                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                                {userPosts.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        onDelete={handleDeletePost}
                                        isLiked={false}
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

                {/* Empty State for Saved Tab */}
                {activeTab === "saved" && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Heart className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">View your saved outfits</h3>
                        <p className="text-muted-foreground mt-1">Visit the Saved page to see all your saved outfits</p>
                        <Button className="mt-4" onClick={() => router.push("/dashboard/saved")}>
                            Go to Saved
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
