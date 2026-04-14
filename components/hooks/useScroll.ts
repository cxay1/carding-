'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useLenis } from './useLenis';

export interface ScrollState {
  scroll: number;
  progress: number;
  velocity: number;
  direction: 'up' | 'down' | 'none';
}

export interface UseScrollOptions {
  containerRef?: React.RefObject<HTMLElement>;
  smooth?: boolean;
  onScroll?: (state: ScrollState) => void;
}

export function useScroll(options: UseScrollOptions = {}): ScrollState {
  const { onScroll } = options;
  const [scrollState, setScrollState] = useState<ScrollState>({
    scroll: 0,
    progress: 0,
    velocity: 0,
    direction: 'none',
  });

  const lastScrollRef = useRef(0);
  const lastTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    const scrollElement = document.documentElement;
    const currentScroll = scrollElement.scrollTop;
    const maxScroll = scrollElement.scrollHeight - scrollElement.clientHeight;
    const currentTime = performance.now();

    const deltaTime = currentTime - lastTimeRef.current;
    const deltaScroll = currentScroll - lastScrollRef.current;
    const velocity = deltaTime > 0 ? deltaScroll / deltaTime : 0;
    const direction = deltaScroll > 0 ? 'down' : deltaScroll < 0 ? 'up' : 'none';
    const progress = maxScroll > 0 ? currentScroll / maxScroll : 0;

    const newState: ScrollState = {
      scroll: currentScroll,
      progress: Math.max(0, Math.min(1, progress)),
      velocity,
      direction,
    };

    setScrollState(newState);
    onScroll?.(newState);

    lastScrollRef.current = currentScroll;
    lastTimeRef.current = currentTime;
  }, [onScroll]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  return scrollState;
}