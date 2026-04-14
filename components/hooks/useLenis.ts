'use client';

import { useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import type { LenisOptions } from 'lenis';

export interface UseLenisOptions extends LenisOptions {
  enabled?: boolean;
}

export interface UseLenisReturn {
  lenis: Lenis | null;
  scrollTo: (target: string | number | HTMLElement, options?: { offset?: number; duration?: number }) => void;
}

export function useLenis(options: UseLenisOptions = {}): UseLenisReturn {
  const { enabled = true, ...lenisOptions } = options;
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  const scrollTo = useCallback((target: string | number | HTMLElement, scrollOptions?: { offset?: number; duration?: number }) => {
    if (!lenisRef.current) return;
    
    lenisRef.current.scrollTo(target, {
      offset: scrollOptions?.offset ?? 0,
      duration: scrollOptions?.duration ?? lenisOptions.duration ?? 1.2,
      easing: lenisOptions.easing ?? ((t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))),
    });
  }, [lenisOptions.duration, lenisOptions.easing]);

  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({
      duration: lenisOptions.duration ?? 1.2,
      easing: lenisOptions.easing ?? ((t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))),
      orientation: lenisOptions.orientation ?? 'vertical',
      gestureOrientation: lenisOptions.gestureOrientation ?? 'vertical',
      smoothWheel: lenisOptions.smoothWheel ?? true,
      wheelMultiplier: lenisOptions.wheelMultiplier ?? 1,
      touchMultiplier: lenisOptions.touchMultiplier ?? 2,
      infinite: lenisOptions.infinite ?? false,
    });

    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled]);

  return { lenis: lenisRef.current, scrollTo };
}