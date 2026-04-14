'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { LayoutImage } from '../types';
import { shouldReduceMotion } from './animations/AnimatedImage';

const reducedMotion = shouldReduceMotion();

interface BentoGridProps {
  images: LayoutImage[];
}

const bentoAnimation = {
  large: {
    initial: { opacity: 0, scale: 0.8, rotate: reducedMotion ? 0 : -5 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    transition: { duration: 0.7, type: 'spring' as const, bounce: 0.3 },
  },
  topRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] as any },
  },
  bottomLeft: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 0.2 },
  },
  bottomRight: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 0.3 },
  },
};

export function BentoGrid({ images }: BentoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Large square - spans 2x2 on md */}
      <motion.div
        className="md:col-span-2 md:row-span-2 aspect-square md:aspect-auto relative rounded-2xl overflow-hidden group"
        initial={reducedMotion ? undefined : bentoAnimation.large.initial}
        animate={reducedMotion ? undefined : bentoAnimation.large.animate}
        transition={reducedMotion ? undefined : bentoAnimation.large.transition}
        whileHover={!reducedMotion ? { scale: 1.02, rotate: 1 } : undefined}
        whileTap={!reducedMotion ? { scale: 0.98 } : undefined}
      >
        {images[0] && (
          <Image
            src={images[0].src}
            alt={images[0].alt || ''}
            fill
            className="object-cover w-full h-full"
            priority={images[0].priority}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
      </motion.div>

      {/* Top right - spans 2 columns */}
      <motion.div
        className="md:col-span-2 aspect-video md:aspect-auto relative rounded-2xl overflow-hidden group"
        initial={reducedMotion ? undefined : bentoAnimation.topRight.initial}
        animate={reducedMotion ? undefined : bentoAnimation.topRight.animate}
        transition={reducedMotion ? undefined : bentoAnimation.topRight.transition}
        whileHover={!reducedMotion ? { y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' } : undefined}
        whileTap={!reducedMotion ? { scale: 0.98 } : undefined}
      >
        {images[1] && (
          <Image
            src={images[1].src}
            alt={images[1].alt || ''}
            fill
            className="object-cover w-full h-full"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
      </motion.div>

      {/* Bottom left */}
      <motion.div
        className="aspect-video md:aspect-auto relative rounded-2xl overflow-hidden group"
        initial={reducedMotion ? undefined : bentoAnimation.bottomLeft.initial}
        animate={reducedMotion ? undefined : bentoAnimation.bottomLeft.animate}
        transition={reducedMotion ? undefined : bentoAnimation.bottomLeft.transition}
        whileHover={!reducedMotion ? { scale: 1.03 } : undefined}
        whileTap={!reducedMotion ? { scale: 0.98 } : undefined}
      >
        {images[2] && (
          <Image
            src={images[2].src}
            alt={images[2].alt || ''}
            fill
            className="object-cover w-full h-full"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        )}
      </motion.div>

      {/* Bottom right */}
      <motion.div
        className="aspect-video md:aspect-auto relative rounded-2xl overflow-hidden group"
        initial={reducedMotion ? undefined : bentoAnimation.bottomRight.initial}
        animate={reducedMotion ? undefined : bentoAnimation.bottomRight.animate}
        transition={reducedMotion ? undefined : bentoAnimation.bottomRight.transition}
        whileHover={!reducedMotion ? { scale: 1.03 } : undefined}
        whileTap={!reducedMotion ? { scale: 0.98 } : undefined}
      >
        {images[3] && (
          <Image
            src={images[3].src}
            alt={images[3].alt || ''}
            fill
            className="object-cover w-full h-full"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        )}
      </motion.div>
    </div>
  );
}

export default BentoGrid;