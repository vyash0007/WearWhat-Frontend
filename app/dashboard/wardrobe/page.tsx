"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import NewOutfitModal from "@/components/dashboard/NewOutfitModal";
import EditImageModal from "@/components/dashboard/EditImageModal";
import { wardrobeService } from "@/lib/api/wardrobe";
import type { WardrobeItem } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SquarePen, Plus } from "lucide-react";
import ShirtLoader from "@/components/ui/ShirtLoader";

export default function WardrobePage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["wardrobe"],
    queryFn: async () => {
      const response = await wardrobeService.getItems();
      if (response.success) {
        return response.items;
      }
      throw new Error("Failed to load wardrobe items");
    },
  });

  const items = data ?? [];

  const handleEditClick = (item: WardrobeItem) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleUploadClose = () => {
    setShowUploadModal(false);
    queryClient.invalidateQueries({ queryKey: ["wardrobe"] });
  };

  const handleDeleteItem = (itemId: string) => {
    queryClient.setQueryData<WardrobeItem[]>(["wardrobe"], (oldData) =>
      oldData ? oldData.filter((item) => item.id !== itemId) : []
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.category.toLowerCase().includes(query) ||
      item.categoryGroup.toLowerCase().includes(query) ||
      Object.values(item.attributes).some(
        (val) => val && val.toLowerCase().includes(query)
      )
    );
  });

  return (
    <main className="flex h-full flex-col overflow-hidden">
      <NewOutfitModal open={showUploadModal} onClose={handleUploadClose} />
      <EditImageModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        item={selectedItem}
        onDelete={handleDeleteItem}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Wardrobe
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {isLoading ? "Loading items..." : `You have ${filteredItems.length} items in your wardrobe.`}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-800 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-blue-500"
          />
          <Button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Item</span>
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="my-5">
          <AlertDescription className="flex items-center justify-between">
            {error instanceof Error ? error.message : "Failed to load wardrobe items"}
            <Button onClick={() => refetch()} variant="secondary">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-8 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[20vh] pt-20">
            <ShirtLoader size="lg" />
          </div>
        ) : !error && items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="text-6xl">👕</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Your wardrobe is empty
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Upload your first outfit to get started
              </p>
              <Button
                onClick={() => setShowUploadModal(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Items
              </Button>
            </div>
          </div>
        ) : !error && filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative w-full cursor-pointer"
                onClick={() => handleEditClick(item)}
              >
                <div className="aspect-square w-full overflow-hidden rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 relative">
                  <img
                    src={item.image_url}
                    alt={item.category}
                    className="h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
                    <SquarePen className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Edit</span>
                  </div>
                  {item.created_at && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {formatDate(item.created_at)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
           <div className="flex flex-1 items-center justify-center text-center text-gray-500 dark:text-gray-400">
            <div>
              <h3 className="text-xl font-semibold">No items found</h3>
              <p>Your search for &quot;{searchQuery}&quot; did not return any results.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
