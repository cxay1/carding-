'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { LayoutImage } from '../types';
import { shouldReduceMotion } from './animations/AnimatedImage';

interface AsymmetricFeatureProps {
  images: LayoutImage[];
}

export function AsymmetricFeature({ images }: AsymmetricFeatureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const reducedMotion = shouldReduceMotion();

  const leftY = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [-20, 20]);
  const rightY = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [20, -20]);

  return (
    <div ref={containerRef} className="w-full">
      {/* Top Section - 60/40 split */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8 px-4 md:px-8 lg:px-12 py-6 md:py-10">
        {/* Left - 60% */}
        <motion.div
          className="w-full md:w-3/5 aspect-[16/9] md:aspect-[4/3] relative rounded-xl md:rounded-2xl overflow-hidden shadow-lg group"
          initial={reducedMotion ? undefined : { opacity: 0, x: -50 }}
          animate={reducedMotion ? undefined : { opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'circOut' }}
          style={!reducedMotion ? { y: leftY } : undefined}
        >
          {images[0] && (
            <Image
              src={images[0].src}
              alt={images[0].alt || ''}
              fill
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              priority={images[0].priority}
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          )}
        </motion.div>

        {/* Right - 40% */}
        <motion.div
          className="w-full md:w-2/5 aspect-[16/9] md:aspect-[3/4] relative rounded-xl md:rounded-2xl overflow-hidden shadow-lg group"
          initial={reducedMotion ? undefined : { opacity: 0, x: 50 }}
          animate={reducedMotion ? undefined : { opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'circOut' }}
          style={!reducedMotion ? { y: rightY } : undefined}
        >
          {images[1] && (
            <Image
              src={images[1].src}
              alt={images[1].alt || ''}
              fill
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          )}
        </motion.div>
      </div>

      {/* Bottom Section - 40/60 split (reversed) */}
      <div className="flex flex-col md:flex-row-reverse gap-4 md:gap-6 lg:gap-8 px-4 md:px-8 lg:px-12 pb-6 md:pb-10">
        {/* Left - 40% */}
        <motion.div
          className="w-full md:w-2/5 aspect-[16/9] md:aspect-[3/4] relative rounded-xl md:rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
          initial={reducedMotion ? undefined : { opacity: 0, y: 30 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={!reducedMotion ? { x: 10, rotate: 2 } : undefined}
          whileTap={!reducedMotion ? { scale: 0.98 } : undefined}
        >
          {images[2] && (
            <Image
              src={images[2].src}
              alt={images[2].alt || ''}
              fill
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          )}
        </motion.div>

        {/* Right - 60% */}
        <motion.div
          className="w-full md:w-3/5 aspect-[16/9] md:aspect-[4/3] relative rounded-xl md:rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
          initial={reducedMotion ? undefined : { opacity: 0, y: 30 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={!reducedMotion ? { x: -10, rotate: -2 } : undefined}
          whileTap={!reducedMotion ? { scale: 0.98 } : undefined}
        >
          {images[3] && (
            <Image
              src={images[3].src}
              alt={images[3].alt || ''}
              fill
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default AsymmetricFeature;