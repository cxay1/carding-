'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { LayoutImage } from '../types';
import { shouldReduceMotion } from './animations/AnimatedImage';

interface MasonryStaggerProps {
  images: LayoutImage[];
}

export function MasonryStagger({ images }: MasonryStaggerProps) {
  const reducedMotion = shouldReduceMotion();

  const itemAnimations = [
    { initial: { opacity: 0, y: 50, rotate: reducedMotion ? 0 : -3 }, delay: 0 },
    { initial: { opacity: 0, y: 50, rotate: reducedMotion ? 0 : 2 }, delay: 0.15 },
    { initial: { opacity: 0, y: 50, rotate: reducedMotion ? 0 : -2 }, delay: 0.3 },
    { initial: { opacity: 0, y: 50, rotate: reducedMotion ? 0 : 3 }, delay: 0.45 },
  ];

  return (
    <div className="columns-1 md:columns-2 gap-4 md:gap-6 space-y-4 md:space-y-6 px-4 md:px-8 py-8 md:py-12 max-w-6xl mx-auto">
      {images.slice(0, 4).map((image, index) => (
        <motion.div
          key={image.id || index}
          className={`break-inside-avoid relative rounded-xl md:rounded-2xl overflow-hidden shadow-md group ${
            index % 2 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'
          }`}
          initial={reducedMotion ? undefined : itemAnimations[index].initial}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: itemAnimations[index].delay 
          }}
          whileHover={!reducedMotion ? { y: -5, scale: 1.02, zIndex: 10 } : undefined}
          whileTap={!reducedMotion ? { scale: 0.98 } : undefined}
        >
          <Image
            src={image.src}
            alt={image.alt || ''}
            fill
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={image.priority}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default MasonryStagger;