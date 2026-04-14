'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useCallback } from 'react';
import { LayoutImage } from '../types';
import { shouldReduceMotion } from './animations/AnimatedImage';

interface CarouselFocusProps {
  images: LayoutImage[];
}

export function CarouselFocus({ images }: CarouselFocusProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = shouldReduceMotion();

  const handleSelect = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const slideAnimation = {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as any },
  };

  return (
    <div className="w-full">
      {/* Main Carousel */}
      <div className="w-full h-[60vh] md:h-[70vh] relative overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            className="absolute inset-0"
            initial={reducedMotion ? undefined : slideAnimation.initial}
            animate={reducedMotion ? undefined : slideAnimation.animate}
            exit={reducedMotion ? undefined : slideAnimation.exit}
            transition={reducedMotion ? undefined : slideAnimation.transition}
          >
            {images[activeIndex] && (
              <Image
                src={images[activeIndex].src}
                alt={images[activeIndex].alt || ''}
                fill
                className="object-cover w-full h-full"
                priority={images[activeIndex].priority}
                sizes="100vw"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors z-10"
          onClick={() => setActiveIndex((prev) => (prev - 1 + images.length) % images.length)}
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors z-10"
          onClick={() => setActiveIndex((prev) => (prev + 1) % images.length)}
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === activeIndex 
                  ? 'bg-white scale-110' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 mt-4 px-4 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <motion.button
            key={image.id || index}
            className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
              index === activeIndex 
                ? 'border-blue-500 scale-105' 
                : 'border-transparent hover:border-white/50'
            }`}
            onClick={() => handleSelect(index)}
            initial={reducedMotion ? undefined : { scale: 0.9 }}
            animate={reducedMotion ? undefined : { scale: index === activeIndex ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
            whileHover={!reducedMotion ? { scale: 1.03 } : undefined}
            whileTap={!reducedMotion ? { scale: 0.98 } : undefined}
          >
            <Image
              src={image.src}
              alt={image.alt || ''}
              width={96}
              height={96}
              className="object-cover w-full h-full"
              sizes="96px"
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default CarouselFocus;