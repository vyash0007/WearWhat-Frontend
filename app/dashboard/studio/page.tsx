"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import { Sparkles, Plus, X, Check, Coins, Calendar, Tag } from "lucide-react"
import type { StudioImage } from "@/lib/api/studio"
import ShirtLoader from "@/components/ui/ShirtLoader"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { studioService } from "@/lib/api/studio"
import { wardrobeService } from "@/lib/api/wardrobe"
import type { WardrobeItem } from "@/lib/api/types"

export default function StudioPage() {
    const queryClient = useQueryClient()
    const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [selectedStudioImage, setSelectedStudioImage] = useState<StudioImage | null>(null)
    const [selectedCategory, setSelectedCategory] = useState("upperWear")

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Fetch studio images and tokens
    const { data: studioData, isLoading: loadingStudio, error: studioError, refetch: refetchStudio } = useQuery({
        queryKey: ['studio', 'images'],
        queryFn: async () => {
            const response = await studioService.getAll(20, 0)
            console.log("Studio images response:", response)
            return {
                images: response?.images || [],
                tokens: response?.tokens ?? 0
            }
        },
    })

    // Fetch wardrobe items for selection
    const { data: wardrobeData, isLoading: loadingWardrobe } = useQuery({
        queryKey: ['wardrobe', 'items'],
        queryFn: async () => {
            const response = await wardrobeService.getItems()
            return response?.items || []
        },
        enabled: isSelectDialogOpen, // Only fetch when dialog is open
    })

    const studioImages = studioData?.images || []
    const tokens = studioData?.tokens ?? 0
    const wardrobeItems = wardrobeData || []

    // Category labels for filter buttons
    const categories = ["upperWear", "bottomWear", "outerWear", "footwear", "otherItems"]
    const categoryLabels: Record<string, string> = {
        upperWear: "Upper Wear",
        bottomWear: "Bottom Wear",
        outerWear: "Outer Wear",
        footwear: "Footwear",
        otherItems: "Accessories",
    }

    // Filter wardrobe items by selected category
    const filteredWardrobeItems = wardrobeItems.filter(
        (item) => item.categoryGroup === selectedCategory
    )

    const handleGenerate = async () => {
        if (!selectedItem) return

        try {
            setIsGenerating(true)
            const response = await studioService.generate(selectedItem.id)
            console.log("Generate response:", response)

            if (!response.success) {
                // Handle no tokens case
                alert(response.message || "Failed to generate studio image")
                queryClient.invalidateQueries({ queryKey: ['studio'] })
                return
            }

            // Refetch studio images
            queryClient.invalidateQueries({ queryKey: ['studio'] })

            // Close dialog and reset
            setIsSelectDialogOpen(false)
            setSelectedItem(null)
        } catch (err) {
            console.error("Error generating studio image:", err)
            alert("Failed to generate studio image")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="min-h-screen p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-lg tracking-tight text-foreground">Studio</h1>
                        <p className="text-sm text-muted-foreground mt-2">
                            Enhance your wardrobe images with AI-powered studio quality.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border">
                            <Coins className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">{tokens} tokens</span>
                        </div>
                        <Button
                            onClick={() => setIsSelectDialogOpen(true)}
                            className="gap-2"
                            disabled={tokens === 0}
                        >
                            <Plus className="h-4 w-4" />
                            Create New
                        </Button>
                    </div>
                </div>

                {/* Loading State */}
                {loadingStudio && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <ShirtLoader size="xl" />
                        <p className="text-muted-foreground mt-4">Loading studio images...</p>
                    </div>
                )}

                {/* Error State */}
                {studioError && !loadingStudio && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                            <X className="h-8 w-8 text-destructive" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">Failed to load studio images</h3>
                        <p className="text-muted-foreground mt-1">{studioError instanceof Error ? studioError.message : "Unknown error"}</p>
                        <Button onClick={() => refetchStudio()} className="mt-4">Try Again</Button>
                    </div>
                )}

                {/* Studio Images Grid */}
                {!loadingStudio && !studioError && studioImages.length > 0 && (
                    <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {studioImages.map((image) => (
                            <button
                                key={image.id}
                                onClick={() => setSelectedStudioImage(image)}
                                className="group bg-card rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 text-left"
                            >
                                {/* Studio Image with Original Thumbnail */}
                                <div className="relative aspect-square">
                                    <Image
                                        src={image.studio_image_url}
                                        alt="Studio enhanced image"
                                        fill
                                        className="object-cover"
                                    />
                                    {/* Original image thumbnail in bottom right */}
                                    <div className="absolute bottom-3 right-3 w-16 h-16 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                                        <Image
                                            src={image.original_image_url}
                                            alt="Original image"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loadingStudio && !studioError && studioImages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Sparkles className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">No studio images yet</h3>
                        <p className="text-muted-foreground mt-1">Create your first studio-quality image from your wardrobe</p>
                        {tokens > 0 ? (
                            <Button onClick={() => setIsSelectDialogOpen(true)} className="mt-4 gap-2">
                                <Plus className="h-4 w-4" />
                                Create New
                            </Button>
                        ) : (
                            <p className="text-sm text-yellow-600 mt-4">You need tokens to generate studio images</p>
                        )}
                    </div>
                )}
            </div>

            {/* Select Wardrobe Item Dialog */}
            <Dialog open={isSelectDialogOpen} onOpenChange={(open) => {
                setIsSelectDialogOpen(open)
                if (!open) {
                    setSelectedItem(null)
                    setSelectedCategory("upperWear")
                }
            }}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Select Wardrobe Item</DialogTitle>
                        <DialogDescription>
                            Choose an item from your wardrobe to enhance with studio quality.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2 py-2">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(category)}
                                className={cn(
                                    "rounded-full",
                                    selectedCategory === category && "shadow-lg shadow-primary/20"
                                )}
                            >
                                {categoryLabels[category]}
                            </Button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto py-4">
                        {loadingWardrobe ? (
                            <div className="flex flex-col items-center justify-center py-8">
                                <ShirtLoader size="lg" />
                                <p className="text-muted-foreground mt-4">Loading wardrobe...</p>
                            </div>
                        ) : filteredWardrobeItems.length > 0 ? (
                            <div className="grid gap-3 grid-cols-3 sm:grid-cols-4 md:grid-cols-5">
                                {filteredWardrobeItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setSelectedItem(item)}
                                        className={cn(
                                            "relative aspect-square rounded-xl overflow-hidden border-2 transition-all",
                                            selectedItem?.id === item.id
                                                ? "border-primary ring-2 ring-primary/20"
                                                : "border-border hover:border-primary/50"
                                        )}
                                    >
                                        <Image
                                            src={item.image_url}
                                            alt={item.category}
                                            fill
                                            className="object-cover"
                                        />
                                        {selectedItem?.id === item.id && (
                                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                                    <Check className="h-4 w-4 text-primary-foreground" />
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        ) : wardrobeItems.length > 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <p className="text-muted-foreground">No items in this category.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <p className="text-muted-foreground">No wardrobe items found.</p>
                                <p className="text-muted-foreground text-sm">Upload some items to your wardrobe first.</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsSelectDialogOpen(false)
                                setSelectedItem(null)
                            }}
                            disabled={isGenerating}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleGenerate}
                            disabled={!selectedItem || isGenerating}
                            className="gap-2"
                        >
                            {isGenerating ? (
                                <>
                                    <ShirtLoader size="sm" />
                                    Generating...
                                </>
                            ) : (
                                "Generate"
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Studio Image Detail Dialog */}
            <Dialog open={!!selectedStudioImage} onOpenChange={() => setSelectedStudioImage(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
                    <DialogTitle className="sr-only">Studio Image Details</DialogTitle>
                    {selectedStudioImage && (
                        <>
                            <div className="flex-1 overflow-y-auto">
                                {/* Images Comparison */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                                    {/* Studio Image */}
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">Studio Enhanced</p>
                                        <div className="relative aspect-square rounded-xl overflow-hidden border border-border">
                                            <Image
                                                src={selectedStudioImage.studio_image_url}
                                                alt="Studio enhanced image"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Original Image */}
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">Original</p>
                                        <div className="relative aspect-square rounded-xl overflow-hidden border border-border">
                                            <Image
                                                src={selectedStudioImage.original_image_url}
                                                alt="Original image"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Metadata */}
                                <div className="px-6 pb-6 space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Tag className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Category:</span>
                                        <span className="font-medium capitalize">{selectedStudioImage.category_group}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Created:</span>
                                        <span className="font-medium">{formatDate(selectedStudioImage.created_at)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="border-t p-4 flex justify-end">
                                <Button variant="outline" onClick={() => setSelectedStudioImage(null)}>
                                    Close
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
