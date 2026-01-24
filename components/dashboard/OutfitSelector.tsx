"use client";

import { useState, useMemo } from "react";
import { Check, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { WardrobeItem } from "@/lib/api/types";
import { CATEGORY_GROUPS } from "@/lib/api/types";

interface OutfitSelectorProps {
  items: WardrobeItem[];
  selectedItem: WardrobeItem | null;
  onSelectionChange: (item: WardrobeItem | null) => void;
  onGetSuggestions?: () => void;
  isLoading?: boolean;
}

type CategoryGroup = keyof typeof CATEGORY_GROUPS;

const CATEGORY_GROUP_LABELS: Record<CategoryGroup, string> = {
  upperWear: "Upper Wear",
  bottomWear: "Bottom Wear",
  outerWear: "Outer Wear",
  footwear: "Footwear",
  otherItems: "Accessories",
};

export default function OutfitSelector({
  items,
  selectedItem,
  onSelectionChange,
  onGetSuggestions,
  isLoading = false,
}: OutfitSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<CategoryGroup | null>("upperWear");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Filter by category group
      if (activeFilter !== null && item.categoryGroup !== activeFilter) {
        return false;
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.category.toLowerCase().includes(query) ||
          item.categoryGroup.toLowerCase().includes(query) ||
          Object.values(item.attributes).some(
            (val) => val && val.toLowerCase().includes(query)
          )
        );
      }

      return true;
    });
  }, [items, activeFilter, searchQuery]);

  const isSelected = (item: WardrobeItem) => {
    return selectedItem?.id === item.id;
  };

  const toggleSelection = (item: WardrobeItem) => {
    if (isSelected(item)) {
      onSelectionChange(null);
    } else {
      onSelectionChange(item);
    }
  };

  const clearSelection = () => {
    onSelectionChange(null);
  };

  const categoryGroups = Object.keys(CATEGORY_GROUPS) as CategoryGroup[];

  return (
    <div className="flex flex-col h-full">
      {/* Header with search and filters */}
      <div className="space-y-4 mb-4">
        <div className="flex items-center gap-3">
          <Input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 h-10 rounded-lg"
          />
          {selectedItem && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearSelection}
              className="shrink-0"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="h-4 w-4 text-gray-500 shrink-0" />
          {categoryGroups.map((group) => (
            <Button
              key={group}
              variant={activeFilter === group ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(activeFilter === group ? null : group)}
              className="rounded-full text-xs shrink-0"
            >
              {CATEGORY_GROUP_LABELS[group]}
            </Button>
          ))}
        </div>
      </div>

      {/* Selected item preview with Get Suggestions button */}
      {selectedItem && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-900 dark:border-gray-100 cursor-pointer group"
                onClick={() => toggleSelection(selectedItem)}
              >
                <img
                  src={selectedItem.image_url}
                  alt={selectedItem.category}
                  className="h-full w-full object-contain bg-white"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <X className="h-4 w-4 text-white" />
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                  {selectedItem.category}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {CATEGORY_GROUP_LABELS[selectedItem.categoryGroup as CategoryGroup]}
                </p>
              </div>
            </div>
            {onGetSuggestions && (
              <Button
                onClick={onGetSuggestions}
                disabled={isLoading}
                className="rounded-xl"
              >
                {isLoading ? "Loading..." : "Get Suggestions"}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Items grid */}
      <div className="flex-1 overflow-y-auto">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery || activeFilter !== null
                ? "No items match your filters"
                : "No items in your wardrobe"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {filteredItems.map((item) => {
              const selected = isSelected(item);

              return (
                <div
                  key={item.id}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${selected
                    ? "border-gray-900 dark:border-gray-100 ring-2 ring-gray-900/20 dark:ring-gray-100/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
                    }`}
                  onClick={() => toggleSelection(item)}
                >
                  <img
                    src={item.image_url}
                    alt={item.category}
                    className="h-full w-full object-contain bg-white p-1"
                  />

                  {/* Selection indicator */}
                  {selected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-900 dark:bg-gray-100 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white dark:text-gray-900" />
                    </div>
                  )}

                  {/* Category label */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-6">
                    <p className="text-xs text-white font-medium truncate">
                      {item.category}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
