"use client";
import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Check, ArrowUp, X } from "lucide-react";

interface UpgradeToProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpgradeToProModal: React.FC<UpgradeToProModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-transparent border-none shadow-none max-w-[85vw] w-full p-0 sm:max-w-sm">
        <div className="relative">
          {/* Tilted creme/off-white background */}
          <div className="absolute top-[-15px] left-[-15px] w-[105%] h-[105%] bg-[#FAF9F6] rounded-3xl transform -rotate-6"></div>

          {/* Main dark card */}
          <div className="relative bg-[#1C1C1C] rounded-2xl shadow-xl p-8 text-white">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full h-8 w-8 text-white hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>

            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-medium tracking-wide text-center text-white pt-6">
                Get More Tokens
              </AlertDialogTitle>
              <div className="text-center mt-3">
                <div className="font-medium tracking-wide text-lg text-white">
                  $1 = 5 tokens
                </div>
                <AlertDialogDescription className="text-sm text-gray-300">
                  Purchase tokens to generate studio images
                </AlertDialogDescription>
              </div>
            </AlertDialogHeader>

            <div className="my-6">
              <ul className="space-y-3 text-white text-sm">
                <li className="flex items-center">
                  <div className="mr-3 flex-shrink-0">
                    <div className="w-5 h-5 border border-white rounded-sm flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 text-white stroke-[2.5]" />
                    </div>
                  </div>
                  <span>AI-powered studio image generation</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 flex-shrink-0">
                    <div className="w-5 h-5 border border-white rounded-sm flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 text-white stroke-[2.5]" />
                    </div>
                  </div>
                  <span>Professional background removal</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 flex-shrink-0">
                    <div className="w-5 h-5 border border-white rounded-sm flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 text-white stroke-[2.5]" />
                    </div>
                  </div>
                  <span>High-quality image enhancement</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 flex-shrink-0">
                    <div className="w-5 h-5 border border-white rounded-sm flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 text-white stroke-[2.5]" />
                    </div>
                  </div>
                  <span>Instant processing</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 flex-shrink-0">
                    <div className="w-5 h-5 border border-white rounded-sm flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 text-white stroke-[2.5]" />
                    </div>
                  </div>
                  <span>Tokens never expire</span>
                </li>
              </ul>
            </div>

            <AlertDialogFooter>
              <Button
                title="Coming Soon!"
                className="w-full bg-[#2A2A2A] hover:bg-[#333333] text-white font-medium py-5 text-md rounded-lg border-0 cursor-not-allowed opacity-80"
              >
                <ArrowUp className="mr-2 h-5 w-5" />
                Buy Tokens
              </Button>
            </AlertDialogFooter>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpgradeToProModal;
