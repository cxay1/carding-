'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface WebGLState {
  isSupported: boolean;
  contextLost: boolean;
  fps: number;
}

export interface UseWebGLOptions {
  dpr?: [number, number];
  powerPreference?: 'high-performance' | 'low-power' | 'default';
  antialias?: boolean;
  onContextLost?: () => void;
  onContextRestored?: () => void;
}

export function useWebGL(options: UseWebGLOptions = {}): {
  state: WebGLState;
  mouse: { x: number; y: number };
  normalizedMouse: { x: number; y: number };
} {
  const { dpr = [1, 2], onContextLost, onContextRestored } = options;
  const [state, setState] = useState<WebGLState>({
    isSupported: true,
    contextLost: false,
    fps: 60,
  });

  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const mouseRef = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    canvasRef.current = canvas;

    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) {
      setState((prev) => ({ ...prev, isSupported: false }));
      return;
    }

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setState((prev) => ({ ...prev, contextLost: true }));
      onContextLost?.();
    };

    const handleContextRestored = () => {
      setState((prev) => ({ ...prev, contextLost: false }));
      onContextRestored?.();
    };

    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [onContextLost, onContextRestored]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      setMouse({ x, y });
      mouseRef.current = {
        x: (x / window.innerWidth) * 2 - 1,
        y: -(y / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const measureFPS = () => {
      frameCountRef.current++;
      const now = performance.now();
      if (now - lastTimeRef.current >= 1000) {
        setState((prev) => ({ ...prev, fps: frameCountRef.current }));
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
      requestAnimationFrame(measureFPS);
    };

    const rafId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return {
    state,
    mouse,
    normalizedMouse: mouseRef.current,
  };
}