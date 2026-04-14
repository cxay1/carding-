'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { LayoutImage } from '../types';
import { shouldReduceMotion } from './animations/AnimatedImage';

interface ParallaxRevealProps {
  images: LayoutImage[];
  captions?: string[];
}

export function ParallaxReveal({ images, captions = [] }: ParallaxRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = shouldReduceMotion();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // First section - fade out with scale
  const opacity1 = useTransform(scrollYProgress, [0, 0.25], reducedMotion ? [1, 1] : [1, 0]);
  const scale1 = useTransform(scrollYProgress, [0, 0.25], reducedMotion ? [1, 1] : [1, 1.2]);
  const y1 = useTransform(scrollYProgress, [0, 0.25], reducedMotion ? [0, 0] : [0, -100]);

  // Second section - rotate transition
  const opacity2 = useTransform(scrollYProgress, [0.2, 0.35, 0.5], reducedMotion ? [0, 1, 0] : [0, 1, 0]);
  const scale2 = useTransform(scrollYProgress, [0.25, 0.5], reducedMotion ? [1, 1] : [1.2, 1, 1.2]);
  const rotate2 = useTransform(scrollYProgress, [0.25, 0.5], reducedMotion ? [0, 0] : [5, 0, -5]);

  // Third section - horizontal slide
  const opacity3 = useTransform(scrollYProgress, [0.45, 0.6, 0.75], reducedMotion ? [0, 1, 0] : [0, 1, 0]);
  const x3 = useTransform(scrollYProgress, [0.5, 0.75], reducedMotion ? ['0%', '0%'] : ['100%', '0%', '-100%']);

  // Fourth section - blur reveal
  const opacity4 = useTransform(scrollYProgress, [0.7, 0.85], reducedMotion ? [0, 1] : [0, 1]);
  const scale4 = useTransform(scrollYProgress, [0.75, 1], reducedMotion ? [0.8, 1] : [0.8, 1]);
  const blur4 = useTransform(scrollYProgress, [0.75, 1], reducedMotion ? ['0px', '0px'] : ['20px', '0px']);

  return (
    <div ref={containerRef} className="relative min-h-[200vh] w-full">
      {/* Section 1 - Hero */}
      <motion.div 
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden"
        style={{ opacity: opacity1, scale: scale1, y: y1 }}
      >
        {images[0] && (
          <div className="absolute inset-0">
            <Image
              src={images[0].src}
              alt={images[0].alt || ''}
              fill
              className="object-cover w-full h-full"
              priority={images[0].priority}
              sizes="100vw"
            />
          </div>
        )}
        {captions[0] && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <motion.h2 
              className="text-4xl md:text-6xl font-bold text-white text-center px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {captions[0]}
            </motion.h2>
          </div>
        )}
      </motion.div>

      {/* Section 2 - Rotate */}
      <motion.div 
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden"
        style={{ opacity: opacity2, scale: scale2, rotate: rotate2 }}
      >
        {images[1] && (
          <div className="absolute inset-0">
            <Image
              src={images[1].src}
              alt={images[1].alt || ''}
              fill
              className="object-cover w-full h-full"
              sizes="100vw"
            />
          </div>
        )}
        {captions[1] && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <motion.h2 
              className="text-4xl md:text-6xl font-bold text-white text-center px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {captions[1]}
            </motion.h2>
          </div>
        )}
      </motion.div>

      {/* Section 3 - Horizontal slide */}
      <motion.div 
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden"
        style={{ opacity: opacity3, x: x3 }}
      >
        {images[2] && (
          <div className="absolute inset-0">
            <Image
              src={images[2].src}
              alt={images[2].alt || ''}
              fill
              className="object-cover w-full h-full"
              sizes="100vw"
            />
          </div>
        )}
        {captions[2] && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <motion.h2 
              className="text-4xl md:text-6xl font-bold text-white text-center px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {captions[2]}
            </motion.h2>
          </div>
        )}
      </motion.div>

      {/* Section 4 - Blur reveal */}
      <motion.div 
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden"
        style={{ opacity: opacity4, scale: scale4 }}
      >
        {images[3] && (
          <div className="absolute inset-0" style={{ filter: reducedMotion ? 'none' : `blur(${blur4})` }}>
            <Image
              src={images[3].src}
              alt={images[3].alt || ''}
              fill
              className="object-cover w-full h-full"
              sizes="100vw"
            />
          </div>
        )}
        {captions[3] && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <motion.h2 
              className="text-4xl md:text-6xl font-bold text-white text-center px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {captions[3]}
            </motion.h2>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default ParallaxReveal;