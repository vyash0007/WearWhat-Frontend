"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { Header } from "@/components/Header/header";
import { HeroSection } from "@/components/home/hero-section";
import { ScrollingLogos } from "@/components/home/scrolling-logos";
import { FeaturesSection } from "@/components/home/features-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { CTASection } from "@/components/home/cta-section";
import { Footer } from "@/components/Footer/footer";
import { HeroImageCarousel } from "@/components/home/HeroImageCarousel";

export default function Page() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard/wardrobe");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show nothing while checking auth to prevent flash
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If authenticated, don't render (redirect will happen)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg, #f8f8f8 0%, #eeeeee 30%, #e5ddd3 70%, #d9c9b5 100%)
          `,
        }}
      ></div>
      <div className="relative z-10">
        <Header />
        <main className="min-h-screen w-full pt-16 sm:pt-20">
          <div className="flex min-h-[calc(100vh-80px)] sm:min-h-[calc(100vh-80px)] w-full relative">
            <div className="w-full sm:w-1/2 flex items-start sm:items-center justify-start px-6 sm:pl-8 lg:pl-12 sm:pr-0 relative z-30 pt-2 sm:pt-0">
              <HeroSection />
            </div>
            <div className="w-1/2 hidden lg:flex items-center justify-center px-8 lg:px-16 overflow-visible relative z-10">
              <HeroImageCarousel />
            </div>
          </div>
        </main>
        <ScrollingLogos />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
}
