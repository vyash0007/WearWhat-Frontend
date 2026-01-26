"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { Bookmark, Grid3X3, LayoutGrid, X } from "lucide-react"
import ShirtLoader from "@/components/ui/ShirtLoader"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { postsService } from "@/lib/api/posts"

export default function SavedPage() {
    const [viewMode, setViewMode] = useState<"grid" | "masonry">("grid")

    // Fetch saved posts with React Query
    const { data: savedPostsData, isLoading: loading, error, refetch } = useQuery({
        queryKey: ['posts', 'saved'],
        queryFn: async () => {
            const response = await postsService.getSavedPosts(20, 0)
            console.log("Saved posts response:", response)
            return response?.posts || []
        },
    })

    const savedPosts = savedPostsData || []

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
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-lg tracking-tight text-foreground">Saved Outfits</h1>
                        <p className="text-sm text-muted-foreground mt-2">
                            Your collection of favorite outfits and style inspirations.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-lg border border-border bg-card p-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn("h-8 w-8 p-0", viewMode === "grid" && "bg-muted")}
                                onClick={() => setViewMode("grid")}
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn("h-8 w-8 p-0", viewMode === "masonry" && "bg-muted")}
                                onClick={() => setViewMode("masonry")}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <ShirtLoader size="xl" />
                        <p className="text-muted-foreground mt-4">Loading saved outfits...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                            <X className="h-8 w-8 text-destructive" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">Failed to load saved outfits</h3>
                        <p className="text-muted-foreground mt-1">{error instanceof Error ? error.message : "Failed to load saved outfits"}</p>
                        <Button onClick={() => refetch()} className="mt-4">Try Again</Button>
                    </div>
                )}

                {/* Saved Images Grid */}
                {!loading && !error && savedPosts.length > 0 && (
                    <div className={cn(
                        "grid gap-4",
                        viewMode === "grid"
                            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                            : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                    )}>
                        {savedPosts.map((post) => (
                            <div
                                key={post.id}
                                className="group bg-card rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                            >
                                {/* Image */}
                                <div className="relative aspect-square">
                                    <Image
                                        src={post.image_url}
                                        alt="Saved outfit"
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Info */}
                                <div className="p-3">
                                    <p className="text-sm font-medium text-foreground truncate">{post.user_name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {getTimeAgo(post.created_at)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && savedPosts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Bookmark className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">No saved outfits yet</h3>
                        <p className="text-muted-foreground mt-1">Save posts from the community to see them here</p>
                    </div>
                )}
            </div>
        </div>
    )
}
