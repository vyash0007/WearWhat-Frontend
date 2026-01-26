"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
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
    otherItems: "Accessories",
}

export default function StylingPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("upperWear")
    const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null)
    const [step, setStep] = useState<1 | 2>(1)
    const [loadingRecommendation, setLoadingRecommendation] = useState(false)
    const [recommendation, setRecommendation] = useState<StyleRecommendationResponse | null>(null)

    // Fetch wardrobe items with React Query
    const { data: wardrobeData, isLoading: loading, error, refetch } = useQuery({
        queryKey: ['wardrobe', 'items'],
        queryFn: async () => {
            const response = await wardrobeService.getItems()
            return response.items
        },
    })

    const wardrobeItems = wardrobeData || []

    const handleGetSuggestions = async () => {
        if (!selectedItem) return

        try {
            setLoadingRecommendation(true)
            const result = await stylingService.getStyleRecommendation(selectedItem.id)
            setRecommendation(result)
            setStep(2)
        } catch (err: unknown) {
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
                        <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex-1 min-w-0">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-lg tracking-tight text-foreground">AI Styling Results</h1>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Here are outfit suggestions based on your selected item
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => { setStep(1); setRecommendation(null); setSelectedItem(null); }}
                                className="w-full sm:w-auto mt-2 sm:mt-0 flex-shrink-0"
                            >
                                Try Another
                            </Button>
                        </div>

                        {/* Combined Outfit Image */}
                        <div className="bg-card rounded-lg sm:rounded-xl md:rounded-2xl border border-border p-3 sm:p-4 md:p-6">
                            <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 md:mb-4">Complete Outfit</h2>
                            <div className="relative aspect-video rounded-lg sm:rounded-xl overflow-hidden bg-muted">
                                <Image
                                    src={recommendation.combined_image_url}
                                    alt="Complete outfit"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>

                        {/* Matched Items */}
                        <div className="bg-card rounded-lg sm:rounded-xl md:rounded-2xl border border-border p-3 sm:p-4 md:p-6">
                            <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 md:mb-4">Outfit Items ({recommendation.total_items})</h2>
                            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
                                {recommendation.matched_items.map((item) => (
                                    <div
                                        key={item.id}
                                        className={cn(
                                            "relative bg-muted/50 rounded-lg sm:rounded-xl overflow-hidden",
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
                                        <div className="p-1.5 sm:p-2">
                                            <p className="text-[10px] xs:text-xs font-medium truncate">{item.category}</p>
                                            {item.is_source && (
                                                <Badge variant="default" className="mt-1 text-[10px] xs:text-xs px-1 py-0">Selected</Badge>
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
        <div className="min-h-screen p-4 md:p-6 lg:p-8 pb-24 sm:pb-6">
            <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 overflow-hidden">
                    {/* Header */}
                    <div className="min-w-0">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-lg tracking-tight text-foreground">AI Styling</h1>
                        <p className="text-sm text-muted-foreground mt-2">
                            Select an item from your wardrobe to get outfit suggestions
                        </p>
                    </div>

                    {/* Search Bar and Step Indicator Row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                        {/* Search Bar */}
                        <div className="relative w-full sm:max-w-md order-2 sm:order-1">
                            <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8 sm:pl-10 bg-card border-border text-xs sm:text-sm md:text-base h-9 sm:h-10"
                            />
                        </div>

                        {/* Step Indicator */}
                        <div className="flex items-center gap-1.5 sm:gap-2 bg-card rounded-full px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 border border-border w-fit order-1 sm:order-2 flex-shrink-0">
                            <Badge variant="default" className="rounded-full text-[10px] xs:text-xs sm:text-sm px-2 py-0.5">
                                1. Select
                            </Badge>
                            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                            <Badge variant="secondary" className="rounded-full text-[10px] xs:text-xs sm:text-sm px-2 py-0.5">
                                2. Result
                            </Badge>
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-2">
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
                        {/* Desktop Get Suggestions Button */}
                        {selectedItem && !loading && (
                            <Button
                                size="sm"
                                className="hidden md:flex gap-2 shadow-lg shadow-primary/20"
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
                        )}
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
                            <p className="text-muted-foreground mt-1">{error instanceof Error ? error.message : "Failed to load items"}</p>
                            <Button onClick={() => refetch()} className="mt-4">Try Again</Button>
                        </div>
                    )}

                    {/* Items Grid */}
                    {!loading && !error && (
                        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
                            {filteredItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
                                    className={cn(
                                        "group relative bg-card rounded-lg sm:rounded-xl md:rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 text-left",
                                        selectedItem?.id === item.id
                                            ? "border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/10"
                                            : "border-border hover:-translate-y-1"
                                    )}
                                >
                                    <div className="relative aspect-square bg-white">
                                        <Image
                                            src={item.image_url}
                                            alt={item.category}
                                            fill
                                            className="object-contain p-2"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                        {/* Selection Indicator */}
                                        {selectedItem?.id === item.id && (
                                            <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 md:top-2 md:right-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 rounded-full bg-primary flex items-center justify-center">
                                                <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-primary-foreground" />
                                            </div>
                                        )}

                                        {/* Item Name Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 p-1.5 sm:p-2 md:p-3">
                                            <h3 className="font-medium text-[10px] xs:text-xs sm:text-sm text-white truncate">{item.category}</h3>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Mobile Action Button */}
                    {selectedItem && !loading && (
                        <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
                            <Button
                                size="lg"
                                className="gap-2 shadow-2xl shadow-primary/30 w-full text-sm h-11"
                                onClick={handleGetSuggestions}
                                disabled={loadingRecommendation}
                            >
                                {loadingRecommendation ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Getting...
                                    </>
                                ) : (
                                    "Get Suggestions"
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
