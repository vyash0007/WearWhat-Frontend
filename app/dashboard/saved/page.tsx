"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Bookmark, Grid3X3, LayoutGrid, MoreHorizontal, Trash2, Share2, X } from "lucide-react"
import ShirtLoader from "@/components/ui/ShirtLoader"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { savedImagesService } from "@/lib/api/savedImages"
import type { SavedImage } from "@/lib/api/types"

export default function SavedPage() {
    const [viewMode, setViewMode] = useState<"grid" | "masonry">("grid")
    const [savedImages, setSavedImages] = useState<SavedImage[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchSavedImages()
    }, [])

    const fetchSavedImages = async () => {
        try {
            setLoading(true)
            setError(null)
            const images = await savedImagesService.getAll()
            setSavedImages(images)
        } catch (err: any) {
            console.error("Error fetching saved images:", err)
            setError(err.message || "Failed to load saved images")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (savedImageId: string) => {
        try {
            await savedImagesService.delete(savedImageId)
            setSavedImages(prev => prev.filter(img => img.id !== savedImageId))
        } catch (err) {
            console.error("Error deleting saved image:", err)
            alert("Failed to delete image")
        }
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
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Bookmark className="h-6 w-6 text-primary" />
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Saved Outfits</h1>
                        </div>
                        <p className="text-muted-foreground">
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
                        <p className="text-muted-foreground mt-1">{error}</p>
                        <Button onClick={fetchSavedImages} className="mt-4">Try Again</Button>
                    </div>
                )}

                {/* Saved Images Grid */}
                {!loading && !error && savedImages.length > 0 && (
                    <div className={cn(
                        "grid gap-4",
                        viewMode === "grid"
                            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                            : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                    )}>
                        {savedImages.map((savedImage) => (
                            <div
                                key={savedImage.id}
                                className="group bg-card rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                            >
                                {/* Image */}
                                <div className="relative p-3">
                                    <div className="relative aspect-square rounded-xl overflow-hidden bg-muted/50">
                                        <Image
                                            src={savedImage.image_url}
                                            alt="Saved outfit"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-3 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="secondary" size="sm" className="gap-2">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    Options
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem className="gap-2">
                                                    <Share2 className="h-4 w-4" /> Share
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="gap-2 text-destructive"
                                                    onClick={() => handleDelete(savedImage.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" /> Remove
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="px-4 pb-4">
                                    {savedImage.note && (
                                        <p className="text-sm text-muted-foreground mb-2">{savedImage.note}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Saved {getTimeAgo(savedImage.saved_at)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && savedImages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Bookmark className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">No saved outfits yet</h3>
                        <p className="text-muted-foreground mt-1">Start saving outfits from the community or planning pages</p>
                    </div>
                )}
            </div>
        </div>
    )
}
