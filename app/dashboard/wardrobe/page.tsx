"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import { Search, Plus, Grid3X3, List, MoreHorizontal, Trash2, X } from "lucide-react"
import ShirtLoader from "@/components/ui/ShirtLoader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { wardrobeService } from "@/lib/api/wardrobe"
import type { WardrobeItem } from "@/lib/api/types"
import { CATEGORY_GROUPS, ATTRIBUTE_LABELS } from "@/lib/api/types"
import { useRouter } from "next/navigation"
import NewOutfitModal from "@/components/dashboard/NewOutfitModal"

const categories = ["All", "Upper Wear", "Bottom Wear", "Outer Wear", "Footwear", "Accessories"]

const categoryGroupMap: Record<string, string> = {
    "Upper Wear": "upperWear",
    "Bottom Wear": "bottomWear",
    "Outer Wear": "outerWear",
    "Footwear": "footwear",
    "Accessories": "otherItems",
}

export default function WardrobePage() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null)
    const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false)

    // Fetch wardrobe items with React Query
    const { data: wardrobeData, isLoading: loading, error, refetch } = useQuery({
        queryKey: ['wardrobe', 'items'],
        queryFn: async () => {
            const response = await wardrobeService.getItems()
            return response.items
        },
    })

    const wardrobeItems = wardrobeData || []

    const handleDeleteItem = async (itemId: string) => {
        try {
            await wardrobeService.deleteItem(itemId)
            setSelectedItem(null)
            // Invalidate and refetch wardrobe items
            queryClient.invalidateQueries({ queryKey: ['wardrobe'] })
        } catch (err: any) {
            console.error("Error deleting item:", err)
            alert("Failed to delete item")
        }
    }

    const filteredItems = wardrobeItems.filter((item) => {
        const matchesSearch = item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.attributes.color?.toLowerCase().includes(searchQuery.toLowerCase())

        if (selectedCategory === "All") {
            return matchesSearch
        }

        const categoryGroup = categoryGroupMap[selectedCategory]
        return matchesSearch && item.categoryGroup === categoryGroup
    })

    // Get display name for category
    const getCategoryDisplayName = (categoryGroup: string) => {
        const mapping: Record<string, string> = {
            upperWear: "Upper Wear",
            bottomWear: "Bottom Wear",
            outerWear: "Outer Wear",
            footwear: "Footwear",
            otherItems: "Accessories",
        }
        return mapping[categoryGroup] || categoryGroup
    }

    return (
        <div className="min-h-screen p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground">Wardrobe</h1>
                        <p className="text-sm text-muted-foreground mt-2">
                            You have <span className="font-semibold text-foreground">{wardrobeItems.length} items</span> in your wardrobe.
                        </p>
                    </div>
                    <Button className="gap-2 shadow-lg shadow-primary/20" onClick={() => setIsNewItemModalOpen(true)}>
                        <Plus className="h-4 w-4" />
                        New Item
                    </Button>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-card border-border"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-lg border border-border bg-card p-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "h-8 w-8 p-0",
                                    viewMode === "grid" && "bg-muted"
                                )}
                                onClick={() => setViewMode("grid")}
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "h-8 w-8 p-0",
                                    viewMode === "list" && "bg-muted"
                                )}
                                onClick={() => setViewMode("list")}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Category Filter */}
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
                            {category}
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
                        <h3 className="text-lg font-semibold text-foreground">Failed to load wardrobe</h3>
                        <p className="text-muted-foreground mt-1">{error instanceof Error ? error.message : "Failed to load wardrobe"}</p>
                        <Button onClick={() => refetch()} className="mt-4">Try Again</Button>
                    </div>
                )}

                {/* Items Grid */}
                {!loading && !error && (
                    <div className={cn(
                        "grid gap-4",
                        viewMode === "grid"
                            ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                            : "grid-cols-1"
                    )}>
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedItem(item)}
                                className={cn(
                                    "group relative bg-card rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer",
                                    viewMode === "list" && "flex items-center"
                                )}
                            >
                                <div className={cn(
                                    "relative aspect-square bg-white",
                                    viewMode === "list" && "w-24 h-24 aspect-auto flex-shrink-0"
                                )}>
                                    <Image
                                        src={item.image_url}
                                        alt={item.category}
                                        fill
                                        className="object-contain p-2"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    {/* Hover Actions */}
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDeleteItem(item.id)}>
                                                    <Trash2 className="h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                <div className={cn(
                                    "p-3",
                                    viewMode === "list" && "flex-1 flex items-center justify-between"
                                )}>
                                    <div>
                                        <h3 className="font-medium text-sm text-foreground truncate">{item.category}</h3>
                                        <Badge variant="secondary" className="mt-1 text-xs">
                                            {getCategoryDisplayName(item.categoryGroup)}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredItems.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Search className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">No items found</h3>
                        <p className="text-muted-foreground mt-1">
                            {wardrobeItems.length === 0
                                ? "Upload your first item to get started"
                                : "Try adjusting your search or filter criteria"}
                        </p>
                        {wardrobeItems.length === 0 && (
                            <Button onClick={() => setIsNewItemModalOpen(true)} className="mt-4">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Items
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Item Details Dialog */}
            <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Item Details</DialogTitle>
                    </DialogHeader>
                    {selectedItem && (
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Image */}
                            <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                                <Image
                                    src={selectedItem.image_url}
                                    alt={selectedItem.category}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Details */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Category</h3>
                                    <p className="text-lg font-semibold text-foreground">{selectedItem.category}</p>
                                    <Badge variant="secondary" className="mt-2">{getCategoryDisplayName(selectedItem.categoryGroup)}</Badge>
                                </div>

                                {Object.keys(selectedItem.attributes).length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-medium text-muted-foreground">Attributes</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {Object.entries(selectedItem.attributes).map(([key, value]) => {
                                                if (!value) return null
                                                return (
                                                    <div key={key}>
                                                        <p className="text-xs text-muted-foreground">{ATTRIBUTE_LABELS[key] || key}</p>
                                                        <p className="text-sm font-medium text-foreground">{value}</p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {selectedItem.created_at && (
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Added On</h3>
                                        <p className="text-sm text-foreground">
                                            {new Date(selectedItem.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                )}

                                <div className="flex gap-2 pt-4">
                                    <Button
                                        variant="outline"
                                        className="flex-1 gap-2 text-destructive hover:text-destructive"
                                        onClick={() => {
                                            handleDeleteItem(selectedItem.id)
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <NewOutfitModal
                open={isNewItemModalOpen}
                onClose={() => setIsNewItemModalOpen(false)}
                onSuccess={() => queryClient.invalidateQueries({ queryKey: ['wardrobe'] })}
            />
        </div>
    )
}
