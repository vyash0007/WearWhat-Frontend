"use client";
import React, { useState } from "react";
import UpgradeToProModal from "./UpgradeToProModal";

export default function TopBanner() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="mx-4 sm:mx-6 md:mx-8 mb-6 flex items-center bg-black px-6 py-3 text-sm font-medium text-white rounded-full">
        <div className="w-[120px] hidden sm:block" />
        <span className="flex-1 text-center">Get unlimited AI outfit suggestions and weather-based recommendations!</span>
        <button
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer rounded-md bg-white px-4 py-1.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100 flex-shrink-0 ml-4"
        >
          Upgrade to Pro
        </button>
      </div>
      <UpgradeToProModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}