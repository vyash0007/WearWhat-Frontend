"use client";

import React, { useRef, useState, useCallback } from "react";
import { wardrobeService } from "@/lib/api/wardrobe";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, X, FileImage, CheckCircle } from "lucide-react";
import ShirtLoader from "@/components/ui/ShirtLoader";

export default function NewOutfitModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [images, setImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number; completed: number[] }>({ current: 0, total: 0, completed: [] });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    setImages((prev) => [...prev, ...selected].slice(0, 9));
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (images.length >= 9) return;
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length) {
      setImages((prev) => [...prev, ...files].slice(0, 9));
    }
  };

  const handleUpload = async () => {
    if (images.length === 0) return;

    setIsUploading(true);
    setUploadError("");
    setUploadProgress({ current: 0, total: images.length, completed: [] });

    let successCount = 0;
    const failedIndexes: number[] = [];

    for (let i = 0; i < images.length; i++) {
      setUploadProgress(prev => ({ ...prev, current: i + 1 }));

      try {
        const response = await wardrobeService.uploadImage(images[i]);
        if (response.success) {
          successCount++;
          setUploadProgress(prev => ({ ...prev, completed: [...prev.completed, i] }));
        } else {
          failedIndexes.push(i);
        }
      } catch {
        failedIndexes.push(i);
      }
    }

    if (failedIndexes.length > 0) {
      setUploadError(`${failedIndexes.length} image(s) failed to upload.`);
      // Keep only failed images for retry
      setImages(failedIndexes.map(i => images[i]));
      setUploadProgress({ current: 0, total: 0, completed: [] });
    } else {
      setImages([]);
      setUploadProgress({ current: 0, total: 0, completed: [] });
      onClose();
    }

    setIsUploading(false);
  };

  const handleClose = useCallback(() => {
    if (!isUploading) {
      setImages([]);
      setUploadError("");
      setUploadProgress({ current: 0, total: 0, completed: [] });
      onClose();
    }
  }, [isUploading, onClose]);

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative m-4 w-full max-w-4xl rounded-2xl bg-white dark:bg-gray-900 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute -top-2 -right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Left: Upload UI */}
          <div className="flex flex-1 flex-col items-start justify-center gap-6 p-8 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Add New Items
            </h2>

            {uploadError && (
              <Alert variant="destructive">
                <AlertDescription>{uploadError}</AlertDescription>
              </Alert>
            )}

            <div
              className={`relative w-full cursor-pointer rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 p-8 text-center transition-colors hover:border-blue-500 dark:hover:border-blue-400 ${
                isUploading ? "cursor-not-allowed opacity-60" : ""
              }`}
              onClick={() => !isUploading && inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
                <Upload size={40} />
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Drag & drop files here
                </span>
                <span className="text-sm">or click to browse</span>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  Up to 9 images, PNG or JPG
                </p>
              </div>
              <input
                ref={inputRef}
                type="file"
                multiple
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading || images.length >= 9}
              />
            </div>

            <div className="w-full space-y-2">
              {isUploading && uploadProgress.total > 0 && (
                <div className="w-full">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>Uploading {uploadProgress.current} of {uploadProgress.total}</span>
                    <span>{Math.round((uploadProgress.completed.length / uploadProgress.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(uploadProgress.completed.length / uploadProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              <Button
                onClick={handleUpload}
                disabled={isUploading || images.length === 0}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <ShirtLoader size="sm" />
                    <span className="ml-2">Uploading {uploadProgress.current}/{uploadProgress.total}...</span>
                  </>
                ) : (
                  `Upload ${images.length} Item${images.length === 1 ? "" : "s"}`
                )}
              </Button>
            </div>
          </div>

          {/* Right: Image Preview */}
          <div className="flex flex-col flex-1 p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Selected Files ({images.length}/9)
            </h3>
            <div className="flex-grow">
              {images.length > 0 ? (
                <div className="grid grid-cols-3 gap-4 overflow-y-auto max-h-[450px] pr-2">
                  {images.map((file, index) => (
                    <div key={index} className="group relative aspect-square">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preview ${index}`}
                        className="h-full w-full rounded-lg object-cover"
                      />
                      {/* Upload status overlay */}
                      {isUploading && (
                        <div className={`absolute inset-0 rounded-lg flex items-center justify-center ${
                          uploadProgress.completed.includes(index)
                            ? 'bg-green-500/70'
                            : uploadProgress.current === index + 1
                              ? 'bg-blue-500/50'
                              : 'bg-gray-500/30'
                        }`}>
                          {uploadProgress.completed.includes(index) ? (
                            <CheckCircle className="w-8 h-8 text-white" />
                          ) : uploadProgress.current === index + 1 ? (
                            <ShirtLoader size="sm" className="text-white" />
                          ) : null}
                        </div>
                      )}
                      {/* Hover overlay for removal (only when not uploading) */}
                      {!isUploading && (
                        <div className="absolute inset-0 rounded-lg bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => removeImage(index)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40"
                            aria-label="Remove image"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <div className="text-center text-gray-400 dark:text-gray-500">
                    <FileImage size={48} className="mx-auto" />
                    <p className="mt-2 font-medium">No files selected</p>
                    <p className="text-sm">Your images will appear here.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
