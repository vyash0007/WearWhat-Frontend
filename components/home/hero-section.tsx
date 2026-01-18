"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"

export function HeroSection() {
  return (
    <div className="flex flex-col relative z-20 min-w-[200%]">
      <div className="flex flex-col font-sans font-black tracking-[-0.02em] leading-[0.85] text-[5rem] md:text-[7rem] lg:text-[10rem] select-none">
        <h1 className="text-black uppercase">
          Get
        </h1>
        <h1 className="text-black uppercase">
          Yourself
        </h1>
        <h1 className="uppercase break-words w-full" style={{ color: 'rgba(255,255,255,0.85)', WebkitTextStroke: '2px rgba(255,255,255,0.4)', textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          Into The
        </h1>
        <h1 className="uppercase break-words w-full" style={{ color: 'rgba(255,255,255,0.85)', WebkitTextStroke: '2px rgba(255,255,255,0.4)', textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          Right Gear
        </h1>
      </div>
      
      <div className="mt-12 flex items-center gap-2 absolute bottom-0 left-0">
        <button className="text-xs md:text-sm font-bold tracking-[0.1em] uppercase flex items-center gap-1 hover:gap-2 transition-all text-black hover:text-gray-800">
          Start Styling for Free
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 opacity-0 h-0 overflow-hidden">
        {/* Hidden original buttons to preserve structure if needed later, or removed. 
            I'll hide them for now to match the design requested. 
        */}
      </div>
    </div>
  )
}