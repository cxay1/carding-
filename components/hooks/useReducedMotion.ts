'use client';

import { useEffect, useState, useCallback } from 'react';

export interface UseReducedMotionOptions {
  respectSystemPreference?: boolean;
}

export function useReducedMotion(options: UseReducedMotionOptions = {}): boolean {
  const { respectSystemPreference = true } = options;
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const getReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return false;
    
    if (respectSystemPreference) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  }, [respectSystemPreference]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    setPrefersReducedMotion(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [getReducedMotion]);

  return prefersReducedMotion;
}