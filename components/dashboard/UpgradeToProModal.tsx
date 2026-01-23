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
      <AlertDialogContent className="bg-transparent border-none shadow-none max-w-[280px] w-full p-0">
        <div className="relative">
          <div className="absolute top-[-15px] left-[-15px] w-[105%] h-[105%] bg-black rounded-3xl transform -rotate-6"></div>
          <div className="relative bg-white rounded-2xl shadow-xl p-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold text-center text-gray-900 pt-6">
                Unlock all Features
              </AlertDialogTitle>
              <div className="text-center mt-3">
                <div className="font-bold text-lg text-gray-800">
                  Pro Personal
                </div>
                <AlertDialogDescription className="text-sm text-gray-600">
                  Enjoy all exclusive features
                </AlertDialogDescription>
              </div>
            </AlertDialogHeader>
            <div className="my-6">
              <ul className="space-y-3 text-gray-700 text-sm">
                <li className="flex items-center">
                  <Check className="text-green-500 mr-3 h-5 w-5" />
                  <span>Onboarding and training options</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-green-500 mr-3 h-5 w-5" />
                  <span>Reporting</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-green-500 mr-3 h-5 w-5" />
                  <span>Advance Search</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-green-500 mr-3 h-5 w-5" />
                  <span>Private Projects</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-green-500 mr-3 h-5 w-5" />
                  <span>Lifetime Updates</span>
                </li>
              </ul>
            </div>
            <AlertDialogFooter>
              <Button className="w-full bg-black text-white hover:bg-gray-800 py-5 text-md">
                <ArrowUp className="mr-2 h-5 w-5" />
                Upgrade to Pro Personal
              </Button>
            </AlertDialogFooter>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpgradeToProModal;