"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, TrendingUp, Clock, Users, X } from "lucide-react"
import ShirtLoader from "@/components/ui/ShirtLoader"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { postsService } from "@/lib/api/posts"
import type { Post } from "@/lib/api/posts"
import { PostCard } from "@/components/social/PostCard"
import { PostDetail } from "@/components/social/PostDetail"

const filters = [
    { label: "For You", icon: TrendingUp },
    { label: "Recent", icon: Clock },
    { label: "Following", icon: Users },
]

export default function CommunityPage() {
    const [selectedFilter, setSelectedFilter] = useState("For You")
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await postsService.getFeed(20, 0)
            setPosts(response.posts)
        } catch (err: any) {
            console.error("Error fetching posts:", err)
            setError(err.message || "Failed to load posts")
        } finally {
            setLoading(false)
        }
    }

    const toggleLike = async (postId: string) => {
        try {
            await postsService.like(postId)

            // Update local state
            setLikedPosts(prev => {
                const newSet = new Set(prev)
                if (newSet.has(postId)) {
                    newSet.delete(postId)
                } else {
                    newSet.add(postId)
                }
                return newSet
            })

            // Update likes count in posts
            setPosts(prev => prev.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        likes_count: likedPosts.has(postId) ? post.likes_count - 1 : post.likes_count + 1
                    }
                }
                return post
            }))
        } catch (err) {
            console.error("Error liking post:", err)
        }
    }

    const handleDeletePost = async (postId: string) => {
        try {
            await postsService.delete(postId)
            setPosts(prev => prev.filter(post => post.id !== postId))
        } catch (err) {
            console.error("Error deleting post:", err)
            alert("Failed to delete post")
        }
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
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

    return (
        <div className="min-h-screen p-4 md:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Style Community</h1>
                    <p className="text-muted-foreground mt-1">
                        Share your favorite outfits and get inspired by others
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {filters.map((filter) => (
                        <Button
                            key={filter.label}
                            variant={selectedFilter === filter.label ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedFilter(filter.label)}
                            className={cn(
                                "rounded-full gap-2",
                                selectedFilter === filter.label && "shadow-lg shadow-primary/20"
                            )}
                        >
                            <filter.icon className="h-4 w-4" />
                            {filter.label}
                        </Button>
                    ))}
                </div>

                {/* Post Detail Modal */}
                <PostDetail
                    post={selectedPost}
                    isOpen={isDetailOpen}
                    onClose={() => setIsDetailOpen(false)}
                    onLike={toggleLike}
                    isLiked={selectedPost ? likedPosts.has(selectedPost.id) : false}
                />

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <ShirtLoader size="xl" />
                        <p className="text-muted-foreground mt-4">Loading posts...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                            <X className="h-8 w-8 text-destructive" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">Failed to load posts</h3>
                        <p className="text-muted-foreground mt-1">{error}</p>
                        <Button onClick={fetchPosts} className="mt-4">Try Again</Button>
                    </div>
                )}

                {/* Posts Feed */}
                {!loading && !error && (
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                        {posts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                onLike={toggleLike}
                                onDelete={handleDeletePost}
                                isLiked={likedPosts.has(post.id)}
                                onCommentClick={(p) => {
                                    setSelectedPost(p)
                                    setIsDetailOpen(true)
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && posts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Users className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">No posts yet</h3>
                        <p className="text-muted-foreground mt-1">Be the first to share your style!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
