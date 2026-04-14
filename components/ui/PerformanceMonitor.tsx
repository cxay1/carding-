'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export interface PerformanceMetrics {
  fps: number;
  memory?: number;
  frameTime: number;
}

interface PerformanceMonitorProps {
  className?: string;
  enabled?: boolean;
  showFPS?: boolean;
  showMemory?: boolean;
  showFrameTime?: boolean;
  updateInterval?: number;
  onPerformanceChange?: (metrics: PerformanceMetrics) => void;
}

export function PerformanceMonitor({
  className = '',
  enabled = true,
  showFPS = true,
  showMemory = false,
  showFrameTime = false,
  updateInterval = 1000,
  onPerformanceChange,
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({ fps: 60, frameTime: 16.67 });
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const rafRef = useRef<number | null>(null);

  const measurePerformance = useCallback(() => {
    frameCountRef.current++;
    const now = performance.now();
    const delta = now - lastTimeRef.current;

    if (delta >= updateInterval) {
      const fps = Math.round((frameCountRef.current / delta) * 1000);
      const frameTime = delta / frameCountRef.current;
      
      const newMetrics: PerformanceMetrics = {
        fps,
        frameTime: Math.round(frameTime * 100) / 100,
      };

      if (showMemory) {
        const memory = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory;
        if (memory) {
          newMetrics.memory = Math.round(memory.usedJSHeapSize / 1048576);
        }
      }

      setMetrics(newMetrics);
      onPerformanceChange?.(newMetrics);

      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }

    rafRef.current = requestAnimationFrame(measurePerformance);
  }, [updateInterval, showMemory, onPerformanceChange]);

  useEffect(() => {
    if (!enabled) return;

    rafRef.current = requestAnimationFrame(measurePerformance);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled, measurePerformance]);

  if (!enabled) return null;

  return (
    <div className={`fixed top-4 left-4 z-50 bg-black/80 text-white px-3 py-2 rounded text-xs font-mono ${className}`}>
      {showFPS && <div>FPS: {metrics.fps}</div>}
      {showFrameTime && <div>Frame: {metrics.frameTime}ms</div>}
      {showMemory && metrics.memory !== undefined && <div>Memory: {metrics.memory}MB</div>}
    </div>
  );
}

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({ fps: 60, frameTime: 16.67 });
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const measurePerformance = () => {
      frameCountRef.current++;
      const now = performance.now();
      const delta = now - lastTimeRef.current;

      if (delta >= 1000) {
        const fps = Math.round((frameCountRef.current / delta) * 1000);
        const frameTime = delta / frameCountRef.current;
        
        setMetrics({ fps, frameTime: Math.round(frameTime * 100) / 100 });
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      rafRef.current = requestAnimationFrame(measurePerformance);
    };

    rafRef.current = requestAnimationFrame(measurePerformance);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return metrics;
}