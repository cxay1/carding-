'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { LayoutImage, AnimationConfig } from '../types';
import { animationPresets, shouldReduceMotion, reducedMotionVariants } from './animations/AnimatedImage';

interface HeroThreeColProps {
  images: LayoutImage[];
  overlayText?: {
    title: string;
    subtitle?: string;
  };
}

export function HeroThreeCol({ images, overlayText }: HeroThreeColProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const reducedMotion = shouldReduceMotion();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="w-full h-[50vh] md:h-[60vh] lg:h-[70vh] relative overflow-hidden"
      >
        {images[0] && (
          <motion.div
            style={!reducedMotion ? { scale } : undefined}
            className="absolute inset-0"
          >
            <Image
              src={images[0].src}
              alt={images[0].alt || ''}
              fill
              className="object-cover w-full h-full"
              priority={images[0].priority}
              sizes="100vw"
            />
          </motion.div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {overlayText && (
          <motion.div 
            className="absolute bottom-0 left-0 right-0 p-8 md:p-12"
            {...(reducedMotion ? reducedMotionVariants.fadeIn : animationPresets.fadeInUp)}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
              {overlayText.title}
            </h1>
            {overlayText.subtitle && (
              <p className="text-lg text-gray-200">{overlayText.subtitle}</p>
            )}
          </motion.div>
        )}
      </section>

      {/* 3 Column Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 px-4 md:px-8 lg:px-12 py-8 md:py-12">
        {[1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className="aspect-[4/3] relative overflow-hidden rounded-lg md:rounded-xl lg:rounded-2xl shadow-md group"
            initial={reducedMotion ? undefined : { opacity: 0, y: 30 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: (index - 1) * 0.1 }}
            whileHover={!reducedMotion ? { scale: 1.03 } : undefined}
            whileTap={!reducedMotion ? { scale: 0.98 } : undefined}
          >
            {images[index] && (
              <Image
                src={images[index].src}
                alt={images[index].alt || ''}
                fill
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            )}
          </motion.div>
        ))}
      </section>
    </div>
  );
}

export default HeroThreeCol;