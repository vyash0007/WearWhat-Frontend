"use client";

import { useState } from "react";
import { X, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { postsService } from "@/lib/api/posts";
import ShirtLoader from "@/components/ui/ShirtLoader";

interface PostOutfitModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  onSuccess?: () => void;
}

export default function PostOutfitModal({ open, onClose, imageUrl, onSuccess }: PostOutfitModalProps) {
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const handlePost = async () => {
    setIsPosting(true);
    setError("");

    try {
      await postsService.create({
        image_url: imageUrl,
        text: content.trim() || undefined,
      });
      setSuccess(true);
      setTimeout(() => {
        setContent("");
        setSuccess(false);
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err) {
      setError("Failed to create post. Please try again.");
      console.error("Post error:", err);
      setIsPosting(false);
    }
  };

  const handleClose = () => {
    setContent("");
    setError("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative m-4 w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Share Outfit
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Image Preview */}
          <div className="aspect-square w-full max-w-[280px] mx-auto rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={imageUrl}
              alt="Outfit to post"
              className="h-full w-full object-contain"
            />
          </div>

          {/* Post Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              What&apos;s on your mind?
            </label>
            <Textarea
              placeholder="Share your thoughts about this outfit..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
              {content.length}/500
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isPosting}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePost}
            disabled={isPosting || success}
            className={success ? "bg-green-600 hover:bg-green-600" : ""}
          >
            {success ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Posted!
              </>
            ) : isPosting ? (
              <>
                <ShirtLoader size="sm" />
                <span className="ml-2">Posting...</span>
              </>
            ) : (
              <>
                <Share2 className="mr-2 h-4 w-4" />
                Post
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
