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
    <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${isScrolled
      ? "bg-white shadow-md"
      : isMobileMenuOpen
        ? "bg-white shadow-md md:bg-transparent md:shadow-none"
        : "bg-transparent"
      }`}>
      <div className="w-full px-8 lg:px-12 py-3">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-8 lg:gap-12">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
              <Image
                src="/blacklogo.png"
                alt="WearWhat Logo"
                width={20}
                height={20}
                className="object-contain h-10 w-10"
              />
              <span className="text-xl sm:text-2xl font-lg tracking-wide text-gray-900" style={{ fontFamily: 'var(--font-poppins)' }}>
                WearWhat
              </span>
            </a>

            {/* Nav Links - Desktop */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {/* This space is now empty as Features has been moved */}
            </div>
          </div>
          {/* Auth Buttons & Features - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="/login"
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0095da] focus:ring-offset-2 rounded px-2 py-1"
            >
              Sign in
            </a>
            <a href="/signup">
              <Button className="rounded-none bg-[#1C1C1C] hover:bg-black text-white px-8">
                Start free
              </Button>
            </a>
            <div className="relative" ref={featuresDropdownRef}>
              <button
                onClick={() => setShowFeaturesDropdown(!showFeaturesDropdown)}
                onMouseEnter={() => setShowFeaturesDropdown(true)}
                className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0095da] focus:ring-offset-2"
                aria-expanded={showFeaturesDropdown}
                aria-haspopup="true"
                aria-label="Features menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              {/* Features Dropdown */}
              {showFeaturesDropdown && (
                <div
                  className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200"
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
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 bg-white animate-in slide-in-from-top-2 duration-200 -mx-8 lg:-mx-12 px-8 lg:px-12">
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
                  <Button className="w-full rounded-none bg-[#1C1C1C] hover:bg-black text-white">
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

