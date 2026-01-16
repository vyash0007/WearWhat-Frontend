"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronDown, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false)
  const featuresDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (featuresDropdownRef.current && !featuresDropdownRef.current.contains(event.target as Node)) {
        setShowFeaturesDropdown(false)
      }
    }
    if (showFeaturesDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showFeaturesDropdown])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
        setShowFeaturesDropdown(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const features = [
    { name: 'AI Style Assistant', href: '#features' },
    { name: 'Wardrobe Manager', href: '#features' },
    { name: 'Weather Integration', href: '#features' },
    { name: 'Outfit Planner', href: '#features' },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
      isScrolled ? "bg-white shadow-md" : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4 lg:px-8 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-8 lg:gap-12">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
              <Image 
                src="/logo.png" 
                alt="WearWhat Logo" 
                width={32} 
                height={32} 
                className="object-contain"
              />
              <span className="text-xl sm:text-2xl font-bold text-gray-900">
                WearWhat
              </span>
            </a>

            {/* Nav Links - Desktop */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <div className="relative" ref={featuresDropdownRef}>
                <button 
                  onClick={() => setShowFeaturesDropdown(!showFeaturesDropdown)}
                  onMouseEnter={() => setShowFeaturesDropdown(true)}
                  className="flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0095da] focus:ring-offset-2 rounded px-2 py-1"
                  aria-expanded={showFeaturesDropdown}
                  aria-haspopup="true"
                >
                  Features
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFeaturesDropdown ? 'rotate-180' : ''}`} />
                </button>
                {/* Features Dropdown */}
                {showFeaturesDropdown && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200"
                    onMouseLeave={() => setShowFeaturesDropdown(false)}
                  >
                    {features.map((feature) => (
                      <a
                        key={feature.name}
                        href={feature.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0095da] transition-colors duration-200"
                        onClick={() => setShowFeaturesDropdown(false)}
                      >
                        {feature.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <a 
                href="/how-it-works" 
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0095da] focus:ring-offset-2 rounded px-2 py-1"
              >
                How it Works
              </a>
              <a 
                href="#pricing" 
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0095da] focus:ring-offset-2 rounded px-2 py-1"
              >
                Pricing
              </a>
              <a 
                href="#about" 
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0095da] focus:ring-offset-2 rounded px-2 py-1"
              >
                About
              </a>
            </div>
          </div>
          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <a 
              href="/login" 
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0095da] focus:ring-offset-2 rounded px-2 py-1"
            >
              Sign in
            </a>
            <a href="/signup">
              <Button className="bg-[#0095da] hover:bg-[#007ab8] text-white px-6 py-2.5 rounded-full font-semibold shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200 focus:ring-[#0095da]">
                Start free
              </Button>
            </a>
          </div>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0095da] focus:ring-offset-2"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-2 pt-4">
              <button
                onClick={() => setShowFeaturesDropdown(!showFeaturesDropdown)}
                className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <span>Features</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFeaturesDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showFeaturesDropdown && (
                <div className="pl-4 space-y-1">
                  {features.map((feature) => (
                    <a
                      key={feature.name}
                      href={feature.href}
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        setShowFeaturesDropdown(false)
                      }}
                    >
                      {feature.name}
                    </a>
                  ))}
                </div>
              )}
              <a 
                href="/how-it-works" 
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How it Works
              </a>
              <a 
                href="#pricing" 
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a 
                href="#about" 
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </a>
              <div className="pt-2 border-t border-gray-200 mt-2 space-y-2">
                <a 
                  href="/login" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign in
                </a>
                <a 
                  href="/signup"
                  className="block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button className="w-full bg-[#0095da] hover:bg-[#007ab8] text-white px-6 py-2.5 rounded-full font-semibold shadow-sm hover:shadow-md transition-all duration-200">
                    Start free
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

