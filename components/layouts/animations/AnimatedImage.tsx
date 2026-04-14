'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { forwardRef, useRef } from 'react';

export interface AnimatedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  animation?: {
    initial?: Record<string, unknown>;
    animate?: Record<string, unknown>;
    transition?: Record<string, unknown>;
    whileHover?: Record<string, unknown>;
    whileTap?: Record<string, unknown>;
  };
}

export const AnimatedImage = forwardRef<HTMLImageElement, AnimatedImageProps>(
  ({ animation, fill = true, className, priority = false, src, alt, ...props }, ref) => {
    return (
      <Image
        ref={ref}
        src={src}
        alt={alt}
        fill={fill}
        className={className}
        priority={priority}
        {...props}
      />
    );
  }
);

AnimatedImage.displayName = 'AnimatedImage';

export function useScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  return { ref, scrollYProgress };
}

export const animationPresets = {
  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
  fadeInScale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: 'circOut' as const },
  },
  slideInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: 'circOut' as const },
  },
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  hoverScale: {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
  },
  hoverLift: {
    whileHover: { y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' },
    transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
  },
  parallaxSlow: {
    scrollYProgress: [0, 1],
    y: [0, -50],
    scale: [1, 1.1],
  },
};

export function createStaggerVariants(delayOffset: number = 0) {
  return {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: delayOffset + i * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };
}

export function shouldReduceMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export const reducedMotionVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },
  slideIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },
};