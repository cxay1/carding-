'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useReducedMotion } from '../hooks/useReducedMotion';

export type TransitionVariant = 'fade' | 'slide' | 'scale' | 'curtain';

export interface PageTransitionCurtainProps {
  children: React.ReactNode;
  variant?: TransitionVariant;
  duration?: number;
  curtainColor?: string;
  sharedElements?: {
    enabled?: boolean;
    layoutIdPrefix?: string;
  };
  enabled?: boolean;
}

const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
  },
  scale: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.2, opacity: 0 },
  },
  curtain: {
    initial: { clipPath: 'inset(0 100% 0 0)' },
    animate: { clipPath: 'inset(0 0% 0 0)' },
    exit: { clipPath: 'inset(0 0 0 100%)' },
  },
};

export function PageTransitionCurtain({
  children,
  variant = 'fade',
  duration = 0.3,
  curtainColor = '#000',
  sharedElements = { enabled: false },
  enabled = true,
}: PageTransitionCurtainProps) {
  const pathname = usePathname();
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = () => {
      setIsExiting(true);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    if (isExiting) {
      const timer = setTimeout(() => setIsExiting(false), duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [isExiting, duration]);

  const transitionDuration = reducedMotion ? 0 : duration;

  const currentVariant = variants[variant];

  if (!enabled || reducedMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={currentVariant.initial}
        animate={currentVariant.animate}
        exit={currentVariant.exit}
        transition={{
          duration: transitionDuration,
          ease: variant === 'slide' ? [0.76, 0, 0.24, 1] : 'easeInOut',
        }}
        style={variant === 'curtain' ? { background: curtainColor } : undefined}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}