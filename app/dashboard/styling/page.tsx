"use client";

import React, { useState } from "react";
import { Send, Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { stylingService, type StylingRecommendationResponse } from "@/lib/api/styling";
import { savedImagesService } from "@/lib/api";
import PostOutfitModal from "@/components/dashboard/PostOutfitModal";
import ShirtLoader from "@/components/ui/ShirtLoader";

export default function StylingPage() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<StylingRecommendationResponse | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await stylingService.getRecommendation(prompt.trim());
      setResult(response);
    } catch (err) {
      setError("Failed to get recommendation. Please try again.");
      console.error("Styling error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setIsSaving(true);
    try {
      await savedImagesService.saveImage({
        image_id: result.combined_image_url,
        note: result.prompt,
      });
      // You might want to show a success message here
    } catch (error) {
      console.error("Failed to save image:", error);
      // You might want to show an error message here
    } finally {
      setIsSaving(false);
    }
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
    <main className="flex h-full flex-col overflow-hidden">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        AI Styling
      </h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Describe an occasion or style, and get personalized outfit recommendations from your wardrobe.
      </p>

      {/* Prompt Input */}
      <form onSubmit={handleSubmit} className="mt-8">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="e.g., a casual office look, date night outfit, weekend brunch..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
              className="h-12 px-4 text-base rounded-xl border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 shadow-sm focus:border-gray-900 focus:ring-gray-900"
            />
          </div>
          <Button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="h-12 px-6 rounded-xl"
          >
            {isLoading ? (
              <ShirtLoader size="sm" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>

      {/* Error State */}
      {error && (
        <div className="mt-6 rounded-lg bg-red-50 dark:bg-red-900/50 p-4 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="mt-12 flex flex-1 flex-col items-center justify-center min-h-[20vh] pt-20">
          <div className="flex flex-col items-center gap-4">
            <ShirtLoader size="lg" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">Creating your perfect outfit...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !result && !error && (
        <div className="mt-12 flex flex-1 flex-col items-center justify-center text-center">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Get Outfit Recommendations
            </h2>
            <p className="max-w-md text-gray-500 dark:text-gray-400">
              Enter a prompt describing the occasion, style, or vibe you&apos;re going for.
              Our AI will curate the perfect outfit from your wardrobe.
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !isLoading && (
        <div className="mt-8 flex-1 overflow-y-auto pb-8">
          {/* Combined Image */}
          <div className="mb-8 relative">
            <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Your Styled Outfit</h2>
            <div className="overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
              <img
                src={result.combined_image_url}
                alt="Combined outfit"
                className="w-full max-h-[500px] object-contain bg-gray-50 dark:bg-gray-800/50"
              />
            </div>
            <div className="absolute top-12 right-4 flex gap-2">
              <Button
                onClick={() => setShowPostModal(true)}
                variant="secondary"
                className="rounded-full"
              >
                <Share2 className="h-4 w-4" />
                <span className="ml-2">Post</span>
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                variant="secondary"
                className="rounded-full"
              >
                {isSaving ? (
                  <ShirtLoader size="sm" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
                <span className="ml-2">{isSaving ? "Saving..." : "Save"}</span>
              </Button>
            </div>
          </div>

          {/* Selected Categories */}
          <div className="mb-8">
            <h3 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Selected Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.selected_categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-gray-900 dark:bg-gray-100 px-4 py-2 text-sm font-medium text-white dark:text-gray-900"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          {/* Individual Items */}
          <div>
            <h3 className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Items in this Outfit
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {result.items.map((item) => (
                <div
                  key={item.id}
                  className="group overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 transition-shadow hover:shadow-md"
                >
                  <div className="aspect-square bg-gray-50 dark:bg-gray-700/50 p-3">
                    <img
                      src={item.image_url}
                      alt={item.category}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{item.category}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{getCategoryGroupLabel(item.categoryGroup)}</p>
                    {item.attributes.color && (
                      <span className="mt-2 inline-block rounded-md bg-gray-100 dark:bg-gray-700 px-2 py-1 text-xs text-gray-600 dark:text-gray-300">
                        {item.attributes.color}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Try Again Button */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => {
                setResult(null);
                setPrompt("");
              }}
              variant="outline"
              className="rounded-xl px-6 py-3"
            >
              Try Another Prompt
            </Button>
          </div>
        </div>
      )}

      {/* Post Modal */}
      {result && (
        <PostOutfitModal
          open={showPostModal}
          onClose={() => setShowPostModal(false)}
          imageUrl={result.combined_image_url}
        />
      )}
    </main>
  );
}
