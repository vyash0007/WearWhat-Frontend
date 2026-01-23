"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  return (
    <div className="flex flex-col relative z-20 w-full sm:min-w-[200%] justify-start sm:justify-center sm:min-h-0 pt-0 sm:pt-0 pb-8 sm:pb-0">
      <div className="flex flex-col font-sans font-black tracking-[-0.05em] sm:tracking-[-0.02em] leading-[0.85] text-[18vw] sm:text-[5rem] md:text-[7rem] lg:text-[10rem] select-none space-y-2 sm:space-y-0">
        <h1 className="text-black uppercase">
          Get
        </h1>
        <h1 className="text-black uppercase">
          Yourself
        </h1>
        <h1 
          className="uppercase break-words w-full" 
          style={{ 
            color: 'rgba(255,255,255,0.85)', 
            WebkitTextStroke: 'clamp(1.5px, 0.3vw, 2px) rgba(255,255,255,0.4)', 
            textShadow: '0 2px 15px rgba(0,0,0,0.2)' 
          }}
        >
          Into The
        </h1>
        <h1 
          className="uppercase break-words w-full" 
          style={{ 
            color: 'rgba(255,255,255,0.85)', 
            WebkitTextStroke: 'clamp(1.5px, 0.3vw, 2px) rgba(255,255,255,0.4)', 
            textShadow: '0 2px 15px rgba(0,0,0,0.2)' 
          }}
        >
          Right Gear
        </h1>
      </div>

      <div className="mt-2 sm:mt-12 flex items-center gap-2 sm:absolute sm:bottom-0 sm:left-0">
        <button className="text-base sm:text-xs md:text-sm font-bold tracking-[0.1em] uppercase flex items-center gap-1.5 hover:gap-2 transition-all text-black hover:text-gray-800">
          Start Styling for Free
          <ArrowUpRight className="w-5 h-5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
        </button>
      </div>

      {/* Mobile-only content to fill empty space */}
      <div className="sm:hidden mt-4 w-full">
        <div className="w-full relative aspect-[4/3] rounded-lg overflow-hidden">
          <Image
            src="/image copy.png"
            alt="Clothing collection"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 opacity-0 h-0 overflow-hidden">
        {/* Hidden original buttons to preserve structure if needed later, or removed. 
            I'll hide them for now to match the design requested. 
        */}
      </div>
    </div>
  )
}