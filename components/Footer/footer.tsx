import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-[#1C1C1C] text-white">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid lg:grid-cols-2">
          <div className="px-12 py-16 flex flex-col justify-between bg-cover bg-center" style={{ backgroundImage: "url('/clothes-hanging.jpeg')" }}>
            <div>
              <h2 className="text-5xl font-light leading-tight max-w-sm">
                Start organizing your wardrobe today
              </h2>
            </div>
            <Button variant="outline" className="mt-8 w-fit bg-transparent border-white text-white hover:bg-white hover:text-black rounded-none">
              GET STARTED FREE
            </Button>
          </div>
          <div className="px-12 py-16">
            <div className="grid grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold tracking-widest mb-6">FEATURES</h3>
                <ul className="space-y-3 text-gray-400 font-light">
                  <li><a href="#" className="hover:text-white transition-colors">Digital Wardrobe</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">AI Styling</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Weather Sync</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Outfit Planning</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Style Chat</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold tracking-widest mb-6">COMPANY</h3>
                <ul className="space-y-3 text-gray-400 font-light">
                  <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold tracking-widest mb-6">SUPPORT</h3>
                <ul className="space-y-3 text-gray-400 font-light">
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-16 flex justify-end space-x-6">
              <a href="#" className="text-gray-400 hover:text-white"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Youtube size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Instagram size={20} /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

