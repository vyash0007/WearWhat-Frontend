"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { TrendingUp, Clock, Users, X } from "lucide-react"
import ShirtLoader from "@/components/ui/ShirtLoader"
import { Button } from "@/components/ui/button"
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
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const queryClient = useQueryClient()

    // Fetch posts with React Query
    const { data: postsData, isLoading: loading, error, refetch } = useQuery({
        queryKey: ['posts', 'feed'],
        queryFn: async () => {
            const response = await postsService.getFeed(20, 0)
            console.log("Feed posts response:", response)
            const posts = response?.posts || []
            posts.forEach((post: Post) => {
                console.log(`Post ${post.id}: likes_count=${post.likes_count}, is_liked=${post.is_liked}, is_saved=${post.is_saved}`)
            })
            return posts
        },
    })

    const posts = postsData || []

    const toggleLike = async (postId: string) => {
        try {
            const response = await postsService.like(postId)
            console.log(`Like response for post ${postId}:`, response)

            // Invalidate and refetch posts to get updated is_liked status
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        } catch (err) {
            console.error("Error liking post:", err)
        }
    }

    const toggleSave = async (postId: string) => {
        try {
            const response = await postsService.save(postId)
            console.log(`Save response for post ${postId}:`, response)

            // Invalidate and refetch posts to get updated is_saved status
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        } catch (err) {
            console.error("Error saving post:", err)
        }
    }

    // Filter posts based on selected tab
    const getFilteredPosts = () => {
        if (selectedFilter === "Recent") {
            const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
            return posts.filter(post => new Date(post.created_at) > twoHoursAgo)
        }
        return posts
    }

    const filteredPosts = getFilteredPosts()

    return (
        <div className="min-h-screen p-4 md:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-lg tracking-tight text-foreground">Style Community</h1>
                    <p className="text-sm text-muted-foreground mt-2">
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
                    onSave={toggleSave}
                    isLiked={selectedPost?.is_liked ?? false}
                    isSaved={selectedPost?.is_saved ?? false}
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
                        <p className="text-muted-foreground mt-1">{error instanceof Error ? error.message : "Failed to load posts"}</p>
                        <Button onClick={() => refetch()} className="mt-4">Try Again</Button>
                    </div>
                )}

                {/* Following Tab - Coming Soon */}
                {!loading && !error && selectedFilter === "Following" && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Users className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">Coming Soon</h3>
                        <p className="text-muted-foreground mt-1">Follow your favorite creators and see their posts here</p>
                    </div>
                )}

                {/* Posts Feed */}
                {!loading && !error && selectedFilter !== "Following" && filteredPosts.length > 0 && (
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                        {filteredPosts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                onLike={toggleLike}
                                onSave={toggleSave}
                                isLiked={post.is_liked}
                                isSaved={post.is_saved}
                                onCommentClick={(p) => {
                                    setSelectedPost(p)
                                    setIsDetailOpen(true)
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Empty State - Recent */}
                {!loading && !error && selectedFilter === "Recent" && filteredPosts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Clock className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">No recent posts</h3>
                        <p className="text-muted-foreground mt-1">No posts from the last 2 hours</p>
                    </div>
                )}

                {/* Empty State - For You */}
                {!loading && !error && selectedFilter === "For You" && filteredPosts.length === 0 && (
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
