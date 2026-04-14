'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLenis } from '../hooks/useLenis';
import { useReducedMotion } from '../hooks/useReducedMotion';

export interface HorizontalSection {
  id: string;
  content?: React.ReactNode;
  skewEffect?: {
    velocityRange?: [number, number];
    skewRange?: [number, number];
    lerp?: number;
  };
  scaleEffect?: {
    centerScale?: number;
    edgeScale?: number;
  };
}

export interface HorizontalScrollGalleryProps {
  className?: string;
  sections?: HorizontalSection[];
  progressBar?: {
    type?: 'horizontal' | 'vertical';
    position?: 'top' | 'bottom' | 'left' | 'right';
  };
  navigation?: {
    arrows?: boolean;
    dots?: boolean;
    wheelConversion?: boolean;
    drag?: boolean;
  };
  enabled?: boolean;
}

export function HorizontalScrollGallery({
  className = '',
  sections: propSections,
  progressBar = { type: 'horizontal', position: 'bottom' },
  navigation = { arrows: true, dots: true, wheelConversion: true, drag: true },
  enabled = true,
}: HorizontalScrollGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const lastScrollRef = useRef(0);

  useLenis({
    orientation: 'horizontal',
    smoothWheel: true,
    enabled: enabled && !reducedMotion,
  });

  const { scrollXProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const skew = useTransform(scrollXProgress, [0, 1], [-10, 10]);

  const defaultSections: HorizontalSection[] = [
    { id: 'slide-0', skewEffect: { velocityRange: [-0.2, 0.2], skewRange: [-10, 10], lerp: 0.1 }, scaleEffect: { centerScale: 1.1, edgeScale: 0.9 } },
    { id: 'slide-1', skewEffect: { velocityRange: [-0.2, 0.2], skewRange: [-10, 10] } },
    { id: 'slide-2', skewEffect: { velocityRange: [-0.2, 0.2], skewRange: [-10, 10] } },
    { id: 'slide-3', skewEffect: { velocityRange: [-0.2, 0.2], skewRange: [-10, 10] } },
  ];

  const sections = propSections || defaultSections;

  const handleWheel = useCallback((e: WheelEvent) => {
    if (!navigation.wheelConversion) return;
    if (containerRef.current) {
      e.preventDefault();
      containerRef.current.scrollLeft += e.deltaY;
    }
  }, [navigation.wheelConversion]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !navigation.wheelConversion) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleWheel, navigation.wheelConversion]);

  const goToSlide = useCallback((index: number) => {
    if (!containerRef.current) return;
    const targetScroll = index * window.innerWidth;
    containerRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
    setActiveIndex(index);
  }, []);

  if (!enabled || reducedMotion) {
    return (
      <div ref={containerRef} className={`h-screen overflow-x-auto overflow-y-hidden flex ${className}`}>
        {sections.map((section) => (
          <section key={section.id} className="h-screen w-screen flex-shrink-0 flex items-center justify-center">
            {section.content || <div className="text-4xl font-bold">Slide</div>}
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className={`h-screen overflow-x-auto overflow-y-hidden flex scroll-smooth ${className}`}
        style={{ width: `${sections.length * 100}vw` }}
      >
        {sections.map((section, index) => (
          <motion.section
            key={section.id}
            className="h-screen w-screen flex-shrink-0 relative flex items-center justify-center"
            style={{
              transform: `skewX(${skew.get()}deg)`,
              transformOrigin: 'center',
            }}
          >
            {section.content || (
              <div className="text-4xl font-bold text-white">
                Slide {index + 1}
              </div>
            )}
          </motion.section>
        ))}
      </div>

      {progressBar?.type === 'horizontal' && (
        <motion.div
          className={`fixed ${progressBar.position === 'bottom' ? 'bottom-0 left-0 h-1 bg-blue-500' : 'top-0 left-0 w-1 bg-blue-500'}`}
          style={{
            scaleX: scrollXProgress,
            transformOrigin: 'left',
            width: progressBar.position === 'bottom' || progressBar.position === 'top' ? '100%' : undefined,
            height: progressBar.position === 'bottom' || progressBar.position === 'top' ? '4px' : undefined,
          }}
        />
      )}

      {navigation.dots && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {sections.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === activeIndex ? 'bg-blue-500 scale-125' : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {navigation.arrows && (
        <>
          <button
            onClick={() => goToSlide(Math.max(0, activeIndex - 1))}
            className="fixed left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/40 rounded-full z-10"
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            onClick={() => goToSlide(Math.min(sections.length - 1, activeIndex + 1))}
            className="fixed right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/40 rounded-full z-10"
            aria-label="Next slide"
          >
            →
          </button>
        </>
      )}
    </div>
  );
}