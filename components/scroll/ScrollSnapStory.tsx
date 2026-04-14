'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useLenis } from '../hooks/useLenis';
import { useReducedMotion } from '../hooks/useReducedMotion';

export interface Section {
  id: string;
  content?: React.ReactNode;
  pin?: boolean;
  pinDuration?: string;
  animation?: {
    effects?: Array<{ property: string; from: number; to: number; start?: string }>;
    parallax?: { speed: number; direction: 'vertical' | 'horizontal' };
  };
  transition?: {
    toNext?: { type: string; direction: string; duration: number };
  };
}

export interface ScrollSnapStoryProps {
  className?: string;
  sections?: Section[];
  progressIndicator?: {
    type?: 'dots' | 'line';
    position?: 'left' | 'right' | 'center';
  };
  navigation?: {
    keyboard?: boolean;
    wheel?: boolean;
    touch?: boolean;
  };
  enabled?: boolean;
}

export function ScrollSnapStory({
  className = '',
  sections: propSections,
  progressIndicator = { type: 'dots', position: 'right' },
  navigation = { keyboard: true, wheel: true, touch: true },
  enabled = true,
}: ScrollSnapStoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [activeSection, setActiveSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useLenis({
    duration: 1.2,
    smoothWheel: true,
    enabled: enabled && !reducedMotion,
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const defaultSections: Section[] = [
    { id: 'section-0', pin: true, pinDuration: '200%', animation: { effects: [{ property: 'scale', from: 1, to: 1.2 }, { property: 'opacity', from: 1, to: 0, start: '80%' }] } },
    { id: 'section-1', pin: true, animation: { effects: [{ property: 'rotate', from: -5, to: 0 }, { property: 'scale', from: 0.8, to: 1 }] } },
    { id: 'section-2', animation: { parallax: { speed: 0.5, direction: 'vertical' } } },
    { id: 'section-3', pin: true, animation: { effects: [{ property: 'filter', from: 10, to: 0 }] } },
  ];

  const sections = propSections || defaultSections;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!navigation.keyboard) return;
    
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      setActiveSection((prev) => Math.min(prev + 1, sections.length - 1));
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      setActiveSection((prev) => Math.max(prev - 1, 0));
    }
  }, [navigation.keyboard, sections.length]);

  useEffect(() => {
    if (!navigation.keyboard) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, navigation.keyboard]);

  const indicatorPosition = progressIndicator.position || 'right';
  const isDotIndicator = progressIndicator.type === 'dots';

  if (!enabled || reducedMotion) {
    return (
      <div className={`h-screen overflow-y-scroll snap-y snap-mandatory ${className}`}>
        {sections.map((section) => (
          <section key={section.id} className="h-screen w-full snap-start flex items-center justify-center">
            {section.content}
          </section>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth ${className}`}>
      <AnimatePresence mode="wait">
        {sections.map((section, index) => (
          <motion.section
            key={section.id}
            className="h-screen w-full snap-start snap-always relative flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {section.content || (
              <div className="text-4xl font-bold text-white">
                Section {index + 1}
              </div>
            )}
          </motion.section>
        ))}
      </AnimatePresence>

      {isDotIndicator && (
        <div className={`fixed top-1/2 -translate-y-1/2 ${indicatorPosition === 'left' ? 'left-8' : indicatorPosition === 'right' ? 'right-8' : 'left-1/2 -translate-x-1/2'} flex flex-col gap-3 z-10`}>
          {sections.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveSection(index);
                sections[index]?.content && containerRef.current?.scrollTo({ top: index * window.innerHeight, behavior: 'smooth' });
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeSection ? 'bg-blue-500 scale-150' : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to section ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}