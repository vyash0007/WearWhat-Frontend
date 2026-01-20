"use client";

import { useState, useEffect } from "react";
import { X, Bookmark, Trash2, Check } from "lucide-react";
import type { WardrobeItem } from "@/lib/api/types";
import { ATTRIBUTE_LABELS } from "@/lib/api/types";
import { wardrobeService } from "@/lib/api/wardrobe";
import { savedImagesService } from "@/lib/api/savedImages";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ShirtLoader from "@/components/ui/ShirtLoader";

interface EditImageModalProps {
  open: boolean;
  onClose: () => void;
  item: WardrobeItem | null;
  onDelete?: (itemId: string) => void;
}

export default function EditImageModal({ open, onClose, item, onDelete }: EditImageModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [currentItem, setCurrentItem] = useState(item);

  useEffect(() => {
    setCurrentItem(item);
    setSaveError("");
    setSaveSuccess(false);
  }, [item]);

  if (!open || !currentItem) return null;

  const handleDelete = async () => {
    if (!currentItem) return;

    setIsDeleting(true);
    try {
      const response = await wardrobeService.deleteItem(currentItem.id);
      if (response.success) {
        onDelete?.(currentItem.id);
        onClose();
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
      alert("Failed to delete item. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleSaveToggle = async () => {
    if (!currentItem) return;

    setIsSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    try {
      if (currentItem.saved) {
        if (!currentItem.saved_image_id) throw new Error("Saved image ID is missing");
        await savedImagesService.delete(currentItem.saved_image_id);
        setCurrentItem(prev => prev ? { ...prev, saved: false, saved_image_id: undefined } : null);
      } else {
        const response = await savedImagesService.saveImage({ image_id: currentItem.id });
        setCurrentItem(prev => prev ? { ...prev, saved: true, saved_image_id: response.id } : null);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (err) {
      setSaveError(`Failed to ${currentItem.saved ? 'unsave' : 'save'} item.`);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryGroupLabel = (group: string) => {
    const labels: Record<string, string> = {
      upperWear: "Upper Wear",
      bottomWear: "Bottom Wear",
      outerWear: "Outer Wear",
      footwear: "Footwear",
      otherItems: "Accessories",
    };
    return labels[group] || group;
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="relative m-4 w-full max-w-3xl rounded-2xl bg-white dark:bg-gray-900 shadow-2xl flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Item Details
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSaveToggle}
                disabled={isSaving}
                className={`text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 ${
                  currentItem.saved ? "text-blue-500 dark:text-blue-400" : ""
                }`}
              >
                {isSaving ? (
                  <ShirtLoader size="sm" />
                ) : saveSuccess ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Bookmark className={`h-5 w-5 ${currentItem.saved ? 'fill-current' : ''}`} />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col md:flex-row gap-6 p-6 overflow-y-auto">
            {/* Image */}
            <div className="w-full md:w-1/2 flex-shrink-0">
              <div className="aspect-square w-full rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                <img
                  src={currentItem.image_url}
                  alt={currentItem.category}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>

            {/* Details */}
            <div className="w-full md:w-1/2 space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</h4>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">
                  {currentItem.category.replace(/_/g, " ")}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {getCategoryGroupLabel(currentItem.categoryGroup)}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Attributes</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {Object.entries(currentItem.attributes)
                    .filter(([, value]) => value)
                    .map(([key, value]) => (
                      <div key={key}>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(ATTRIBUTE_LABELS as any)[key] || key}
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 capitalize">
                          {value}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Added On</h4>
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  {formatDate(currentItem.created_at)}
                </p>
              </div>

              {saveError && (
                <p className="text-sm text-red-500">{saveError}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              item from your wardrobe.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <ShirtLoader size="sm" />
                  <span className="ml-2">Deleting</span>
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
