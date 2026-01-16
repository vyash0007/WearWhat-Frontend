import { Header } from "@/components/Header/header";
import { HeroSection } from "@/components/home/hero-section";
import { ScrollingLogos } from "@/components/home/scrolling-logos";
import { FeaturesSection } from "@/components/home/features-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { CTASection } from "@/components/home/cta-section";
import { Footer } from "@/components/Footer/footer";
import { HeroImageCarousel } from "@/components/home/HeroImageCarousel";

export default function Page() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 16% 38%, rgba(255, 183, 77, 0.18) 0%, transparent 55%),
            radial-gradient(circle at 30% 55%, rgba(255, 167, 38, 0.14) 0%, transparent 60%),
            radial-gradient(circle at 18% 25%, rgba(232, 244, 252, 0.9) 0%, transparent 45%),
            radial-gradient(circle at 75% 20%, rgba(248, 236, 234, 0.85) 0%, transparent 50%),
            radial-gradient(circle at 20% 75%, rgba(248, 236, 234, 0.7) 0%, transparent 45%),
            radial-gradient(circle at 82% 65%, rgba(232, 244, 252, 0.75) 0%, transparent 45%),
            radial-gradient(circle at 88% 48%, rgba(255, 152, 0, 0.1) 0%, transparent 40%),
            linear-gradient(180deg, #e8f4fc 0%, #eef5f9 30%, #f5f0f2 65%, #fce8e6 100%)
          `,
        }}
      ></div>
      <div className="relative z-10">
        <Header />
        <main className="min-h-screen overflow-x-hidden w-full pt-20">
          <div className="flex min-h-[calc(100vh-80px)] w-full">
            <div className="w-1/2 flex items-center justify-start px-20 lg:px-48">
              <HeroSection />
            </div>
            <div className="w-1/2 hidden lg:flex items-center justify-center px-8 lg:px-16 overflow-visible">
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
