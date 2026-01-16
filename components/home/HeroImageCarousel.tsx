"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const images = [
  "/heroimgbgremove.png",
  "/heroimg2.png",
  "/heroimg3.png",
  "/heroimg4.png"
];

export function HeroImageCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(-1); // left swipe
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);
  return (
    <div style={{ position: 'relative', width: '100%', height: '70vh' }}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={images[current]}
          src={images[current]}
          alt="Hero preview"
          className="rounded-2xl absolute left-0 top-0"
          style={{
            height: '70vh',
            width: 'auto',
            objectFit: 'contain',
            maxWidth: '100%'
          }}
          initial={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        />
      </AnimatePresence>
    </div>
  );
}
