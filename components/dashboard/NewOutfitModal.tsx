"use client";

import React, { useRef, useState, useCallback } from "react";
import { wardrobeService } from "@/lib/api/wardrobe";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, X, Check } from "lucide-react";
import ShirtLoader from "@/components/ui/ShirtLoader";

export default function NewOutfitModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess?: () => void }) {
  const [image, setImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setImage(e.target.files[0]);
    setUploadError("");
    setUploadSuccess(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length > 0) {
      setImage(files[0]);
      setUploadError("");
      setUploadSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    setIsUploading(true);
    setUploadError("");
    setUploadSuccess(false);

    try {
      const response = await wardrobeService.uploadImage(image);
      if (response.success) {
        setUploadSuccess(true);
        setTimeout(() => {
          setImage(null);
          setUploadSuccess(false);
          onSuccess?.();
          onClose();
        }, 1000);
      } else {
        setUploadError("Failed to upload image. Please try again.");
      }
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = useCallback(() => {
    if (!isUploading) {
      setImage(null);
      setUploadError("");
      setUploadSuccess(false);
      onClose();
    }
  }, [isUploading, onClose]);

  const removeImage = () => {
    setImage(null);
    setUploadError("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative m-4 w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute -top-2 -right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="p-6 space-y-5">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Add New Item
          </h2>

          {uploadError && (
            <Alert variant="destructive">
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}

          {/* Image Preview or Drop Zone */}
          {image ? (
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-muted">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="h-full w-full object-cover"
              />
              {/* Success overlay */}
              {uploadSuccess && (
                <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Check className="w-16 h-16 mx-auto mb-2" />
                    <p className="font-semibold">Uploaded!</p>
                  </div>
                </div>
              )}
              {/* Uploading overlay */}
              {isUploading && !uploadSuccess && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <ShirtLoader size="lg" />
                    <p className="mt-2 font-medium">Analyzing...</p>
                  </div>
                </div>
              )}
              {/* Remove button */}
              {!isUploading && !uploadSuccess && (
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                  aria-label="Remove image"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          ) : (
            <div
              className="relative w-full cursor-pointer rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 p-8 text-center transition-colors hover:border-blue-500 dark:hover:border-blue-400"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center gap-3 text-gray-500 dark:text-gray-400">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <Upload size={28} className="text-gray-400" />
                </div>
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Drop your image here
                  </span>
                  <p className="text-sm mt-1">or click to browse</p>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  PNG, JPG or WebP
                </p>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={isUploading || !image || uploadSuccess}
            className="w-full"
            size="lg"
          >
            {isUploading ? (
              <>
                <ShirtLoader size="sm" />
                <span className="ml-2">Uploading...</span>
              </>
            ) : uploadSuccess ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Added to Wardrobe
              </>
            ) : (
              "Add to Wardrobe"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
