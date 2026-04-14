'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { LayoutImage } from '../types';
import { shouldReduceMotion } from './animations/AnimatedImage';

interface OverlappingCardsProps {
  images: LayoutImage[];
}

const cardConfigs = [
  { 
    initial: { x: -100, opacity: 0, rotate: -8 },
    animate: { x: 0, opacity: 1, rotate: -6 },
    className: 'left-[5%] top-[5%] w-[85%] md:w-[70%]',
    zIndex: 4,
  },
  { 
    initial: { x: 100, opacity: 0, rotate: 8 },
    animate: { x: 0, opacity: 1, rotate: 4 },
    className: 'left-[10%] top-[15%] w-[85%] md:w-[70%]',
    zIndex: 3,
  },
  { 
    initial: { y: 100, opacity: 0, rotate: -4 },
    animate: { y: 0, opacity: 1, rotate: -2 },
    className: 'left-[7%] top-[25%] w-[85%] md:w-[70%]',
    zIndex: 2,
  },
  { 
    initial: { y: 100, opacity: 0, rotate: 6 },
    animate: { y: 0, opacity: 1, rotate: 3 },
    className: 'left-[12%] top-[35%] w-[85%] md:w-[70%]',
    zIndex: 1,
  },
];

export function OverlappingCards({ images }: OverlappingCardsProps) {
  const reducedMotion = shouldReduceMotion();
  const constraintsRef = useRef(null);

  return (
    <div 
      ref={constraintsRef}
      className="relative h-[80vh] md:h-[90vh] w-full max-w-6xl mx-auto px-4 py-12"
    >
      {images.slice(0, 4).map((image, index) => {
        const config = cardConfigs[index];
        
        return (
          <motion.div
            key={image.id || index}
            className={`absolute aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl ${config.className}`}
            style={{ zIndex: config.zIndex }}
            initial={reducedMotion ? undefined : config.initial}
            animate={reducedMotion ? undefined : config.animate}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            drag={!reducedMotion}
            dragConstraints={constraintsRef}
            dragElastic={0.2}
            whileHover={!reducedMotion ? { 
              zIndex: 50, 
              scale: 1.05, 
              rotate: 0,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
            } : undefined}
            whileTap={!reducedMotion ? { scale: 0.95 } : undefined}
            layoutId={`card-${index}`}
          >
            <Image
              src={image.src}
              alt={image.alt || ''}
              fill
              className="object-cover w-full h-full"
              sizes="(max-width: 768px) 85vw, 70vw"
              priority={index === 0 ? image.priority : undefined}
            />
            
            {/* Overlay with content */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        );
      })}
    </div>
  );
}

export default OverlappingCards;