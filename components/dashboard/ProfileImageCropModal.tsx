"use client";

import React, { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import ShirtLoader from "@/components/ui/ShirtLoader";

interface ProfileImageCropModalProps {
  imageFile: File | null;
  onClose: () => void;
  onCropComplete: (croppedFile: File) => void;
  isUploading?: boolean;
}

// Helper function to create cropped image
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  fileName: string
): Promise<File> {
  const image = new Image();
  image.src = imageSrc;

  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  // Set canvas size to the cropped area size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the cropped image
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Convert canvas to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        const file = new File([blob], fileName, { type: "image/jpeg" });
        resolve(file);
      },
      "image/jpeg",
      0.95
    );
  });
}

export default function ProfileImageCropModal({
  imageFile,
  onClose,
  onCropComplete,
  isUploading = false,
}: ProfileImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const imageUrl = imageFile ? URL.createObjectURL(imageFile) : "";

  const onCropChange = useCallback((location: { x: number; y: number }) => {
    setCrop(location);
  }, []);

  const onZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const onCropCompleteCallback = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleSave = async () => {
    if (!croppedAreaPixels || !imageFile) return;

    try {
      const croppedFile = await getCroppedImg(
        imageUrl,
        croppedAreaPixels,
        imageFile.name.replace(/\.[^/.]+$/, "") + "_cropped.jpg"
      );
      onCropComplete(croppedFile);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  if (!imageFile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative m-4 w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isUploading}
          className="absolute -top-2 -right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Crop Profile Picture
          </h2>
          <p className="text-sm text-muted-foreground">
            Drag to reposition, scroll or use slider to zoom
          </p>

          {/* Cropper container */}
          <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={onCropCompleteCallback}
            />
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-3">
            <ZoomOut className="h-4 w-4 text-muted-foreground" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary"
            />
            <ZoomIn className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isUploading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isUploading}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <ShirtLoader size="sm" />
                  <span className="ml-2">Uploading...</span>
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
