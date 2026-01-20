"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, SquarePen, X } from "lucide-react";
import { savedImagesService } from "@/lib/api";
import type { SavedImage } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import ShirtLoader from "@/components/ui/ShirtLoader";

export default function SavedPage() {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const [noteLoading, setNoteLoading] = useState(false);
  const [noteError, setNoteError] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["savedImages"],
    queryFn: async () => {
      const data = await savedImagesService.getAll();
      return Array.isArray(data) ? data : [];
    },
  });

  const savedImages = data ?? [];

  const handleNoteSubmit = async (e: React.FormEvent, imgId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!noteInput.trim()) return;

    setNoteLoading(true);
    setNoteError("");
    try {
      await savedImagesService.updateNote({ saved_image_id: imgId, note: noteInput });
      queryClient.setQueryData<SavedImage[]>(["savedImages"], (oldData) =>
        oldData ? oldData.map((s) => s.id === imgId ? { ...s, note: noteInput } : s) : []
      );
      setEditingNoteId(null);
      setNoteInput("");
    } catch {
      setNoteError("Failed to save note");
    } finally {
      setNoteLoading(false);
    }
  };

  const handleRemoveSaved = async (e: React.MouseEvent, imgId: string) => {
    e.stopPropagation();
    try {
      await savedImagesService.delete(imgId);
      queryClient.setQueryData<SavedImage[]>(["savedImages"], (oldData) =>
        oldData ? oldData.filter((s) => s.id !== imgId) : []
      );
    } catch {
      alert("Failed to remove saved image");
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Saved Outfits
      </h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Your collection of favorite outfits and style inspirations.
      </p>
      <div className="mt-8 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[20vh] pt-20">
            <ShirtLoader size="lg" />
          </div>
        ) : error ? (
          <Alert variant="destructive">{error instanceof Error ? error.message : "Failed to load saved images"}</Alert>
        ) : savedImages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-center text-gray-500 dark:text-gray-400">
            <div>
              <Bookmark className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No saved outfits</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by saving outfits you like.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {savedImages.map((img) => (
              <div
                key={img.id}
                className="group relative w-full cursor-pointer"
              >
                <div className="aspect-square w-full overflow-hidden rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 relative">
                  <img
                    src={img.image_url || (img.image_id.startsWith("http") ? img.image_id : `/outfits/${img.image_id}`)}
                    alt="saved outfit"
                    className="h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
                    onError={e => { e.currentTarget.src = '/placeholder.png'; }}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-white">
                    {editingNoteId === img.id ? (
                      <form
                        className="flex flex-col items-center gap-2 w-full"
                        onSubmit={(e) => handleNoteSubmit(e, img.id)}
                      >
                        <Input
                          className="h-8 text-black dark:text-white bg-gray-800/50 border-gray-600"
                          value={noteInput}
                          onChange={(e) => setNoteInput(e.target.value)}
                          placeholder="Add a note..."
                          autoFocus
                          maxLength={100}
                          disabled={noteLoading}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex gap-2">
                          <Button
                            type="submit"
                            size="sm"
                            className="h-7"
                            disabled={noteLoading || !noteInput.trim()}
                          >
                            {noteLoading ? <ShirtLoader size="sm" /> : "Save"}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-7"
                            onClick={(e) => { e.stopPropagation(); setEditingNoteId(null); setNoteInput(""); }}
                            disabled={noteLoading}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        {noteError && <p className="text-xs text-red-400 mt-1">{noteError}</p>}
                      </form>
                    ) : (
                      <>
                        {img.note && <p className="text-sm font-medium text-center mb-2" title={img.note}>{img.note}</p>}
                        <Button
                          variant="outline"
                          className="bg-transparent text-white border-white/50 hover:bg-white/10 hover:text-white"
                          onClick={(e) => { e.stopPropagation(); setEditingNoteId(img.id); setNoteInput(img.note || ""); }}
                        >
                          <SquarePen className="w-4 h-4 mr-2" />
                          {img.note ? "Edit Note" : "Add Note"}
                        </Button>
                      </>
                    )}
                  </div>
                  {/* Save icon in top right */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-1 right-1 text-white bg-black/30 hover:bg-black/50 h-8 w-8"
                    title="Remove from saved"
                    onClick={(e) => handleRemoveSaved(e, img.id)}
                  >
                    <Bookmark className="w-5 h-5" fill="white" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
