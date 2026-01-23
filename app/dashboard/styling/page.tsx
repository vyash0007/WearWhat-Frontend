"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Search, ChevronRight, Check, X, Loader2 } from "lucide-react"
import ShirtLoader from "@/components/ui/ShirtLoader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { wardrobeService } from "@/lib/api/wardrobe"
import { stylingService } from "@/lib/api/styling"
import type { WardrobeItem } from "@/lib/api/types"
import type { StyleRecommendationResponse } from "@/lib/api/styling"

const categories = ["upperWear", "bottomWear", "outerWear", "footwear", "otherItems"]
const categoryLabels: Record<string, string> = {
    upperWear: "Upper Wear",
    bottomWear: "Bottom Wear",
    outerWear: "Outer Wear",
    footwear: "Footwear",
    otherItems: "Other Items",
}

export default function StylingPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("upperWear")
    const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null)
    const [step, setStep] = useState<1 | 2>(1)
    const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingRecommendation, setLoadingRecommendation] = useState(false)
    const [recommendation, setRecommendation] = useState<StyleRecommendationResponse | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchWardrobeItems()
    }, [])

    const fetchWardrobeItems = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await wardrobeService.getItems()
            setWardrobeItems(response.items)
        } catch (err: any) {
            console.error("Error fetching wardrobe items:", err)
            setError(err.message || "Failed to load wardrobe items")
        } finally {
            setLoading(false)
        }
    }

    const handleGetSuggestions = async () => {
        if (!selectedItem) return

        try {
            setLoadingRecommendation(true)
            const result = await stylingService.getStyleRecommendation(selectedItem.id)
            setRecommendation(result)
            setStep(2)
        } catch (err: any) {
            console.error("Error getting recommendations:", err)
            alert("Failed to get style recommendations. Please try again.")
        } finally {
            setLoadingRecommendation(false)
        }
    }

    const filteredItems = wardrobeItems.filter((item) => {
        const matchesSearch = item.category.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = item.categoryGroup === selectedCategory
        return matchesSearch && matchesCategory
    })

    if (step === 2 && recommendation) {
        return (
            <div className="min-h-screen p-4 md:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">AI Styling Results</h1>
                            </div>
                            <p className="text-muted-foreground">
                                Here are outfit suggestions based on your selected item
                            </p>
                        </div>
                        <Button variant="outline" onClick={() => { setStep(1); setRecommendation(null); setSelectedItem(null); }}>
                            Try Another
                        </Button>
                    </div>

                    {/* Combined Outfit Image */}
                    <div className="bg-card rounded-2xl border border-border p-6">
                        <h2 className="text-lg font-semibold mb-4">Complete Outfit</h2>
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                            <Image
                                src={recommendation.combined_image_url}
                                alt="Complete outfit"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>

                    {/* Matched Items */}
                    <div className="bg-card rounded-2xl border border-border p-6">
                        <h2 className="text-lg font-semibold mb-4">Outfit Items ({recommendation.total_items})</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {recommendation.matched_items.map((item) => (
                                <div
                                    key={item.id}
                                    className={cn(
                                        "relative bg-muted/50 rounded-xl overflow-hidden",
                                        item.is_source && "ring-2 ring-primary"
                                    )}
                                >
                                    <div className="relative aspect-square">
                                        <Image
                                            src={item.image_url}
                                            alt={item.category}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-2">
                                        <p className="text-xs font-medium truncate">{item.category}</p>
                                        {item.is_source && (
                                            <Badge variant="default" className="mt-1 text-xs">Selected</Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">AI Styling</h1>
                        </div>
                        <p className="text-muted-foreground">
                            Select an item from your wardrobe to get outfit suggestions
                        </p>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex items-center gap-2 bg-card rounded-full px-4 py-2 border border-border">
                        <Badge variant="default" className="rounded-full">
                            1. Select
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="secondary" className="rounded-full">
                            2. Result
                        </Badge>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-card border-border"
                    />
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            variant={selectedCategory === category ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(category)}
                            className={cn(
                                "rounded-full whitespace-nowrap flex-shrink-0",
                                selectedCategory === category && "shadow-lg shadow-primary/20"
                            )}
                        >
                            {categoryLabels[category]}
                        </Button>
                    ))}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <ShirtLoader size="xl" />
                        <p className="text-muted-foreground mt-4">Loading your wardrobe...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                            <X className="h-8 w-8 text-destructive" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">Failed to load items</h3>
                        <p className="text-muted-foreground mt-1">{error}</p>
                        <Button onClick={fetchWardrobeItems} className="mt-4">Try Again</Button>
                    </div>
                )}

                {/* Items Grid */}
                {!loading && !error && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {filteredItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
                                className={cn(
                                    "group relative bg-card rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 text-left",
                                    selectedItem?.id === item.id
                                        ? "border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/10"
                                        : "border-border hover:-translate-y-1"
                                )}
                            >
                                <div className="relative aspect-square bg-muted/50">
                                    <Image
                                        src={item.image_url}
                                        alt={item.category}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                    {/* Selection Indicator */}
                                    {selectedItem?.id === item.id && (
                                        <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                                            <Check className="h-4 w-4 text-primary-foreground" />
                                        </div>
                                    )}

                                    {/* Item Name Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-3">
                                        <h3 className="font-medium text-sm text-white truncate">{item.category}</h3>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Action Button */}
                {selectedItem && !loading && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 lg:static lg:translate-x-0 lg:flex lg:justify-center lg:pt-4">
                        <Button
                            size="lg"
                            className="gap-2 shadow-2xl shadow-primary/30 px-8"
                            onClick={handleGetSuggestions}
                            disabled={loadingRecommendation}
                        >
                            {loadingRecommendation ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Getting Suggestions...
                                </>
                            ) : (
                                "Get AI Suggestions"
                            )}
                        </Button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredItems.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Search className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">No items found</h3>
                        <p className="text-muted-foreground mt-1">Try a different category or search term</p>
                    </div>
                )}
            </div>
        </div>
    )
}
