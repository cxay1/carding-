'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

export interface Layer {
  id: string;
  depth: number;
  z: number;
  scale: number;
  blur?: number;
  opacity?: number;
  parallaxSpeed?: number;
  mouseParallax?: {
    strength: number;
    smooth: number;
  };
  content?: React.ReactNode;
  hotspots?: Array<{ x: number; y: number; content: string; tooltip?: boolean }>;
  overlay?: {
    type?: 'gradient';
    from?: string;
    to?: string;
  };
}

export interface ParallaxLayersDepthProps {
  className?: string;
  layers?: Layer[];
  depthMap?: {
    enabled?: boolean;
    source?: string;
  };
  fog?: {
    enabled?: boolean;
    near?: number;
    far?: number;
    color?: string;
  };
  enabled?: boolean;
}

export function ParallaxLayersDepth({
  className = '',
  layers: propLayers,
  depthMap = { enabled: true },
  fog = { enabled: true, near: 200, far: 500, color: '#0f172a' },
  enabled = true,
}: ParallaxLayersDepthProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const defaultLayers: Layer[] = [
    { id: 'layer-0', depth: 0.1, z: -100, scale: 1.2, blur: 2, opacity: 0.6, parallaxSpeed: 0.2, mouseParallax: { strength: 20, smooth: 0.1 } },
    { id: 'layer-1', depth: 0.3, z: -50, scale: 1.1, opacity: 0.8, parallaxSpeed: 0.5, mouseParallax: { strength: 40, smooth: 0.1 } },
    { id: 'layer-2', depth: 0.6, z: 0, scale: 1, opacity: 1, parallaxSpeed: 0.8, mouseParallax: { strength: 60, smooth: 0.1 }, hotspots: [{ x: 30, y: 40, content: 'Interactive point', tooltip: true }] },
    { id: 'layer-3', depth: 1, z: 50, scale: 1.05, opacity: 0.9, parallaxSpeed: 1.2, mouseParallax: { strength: 80, smooth: 0.1 }, overlay: { type: 'gradient', from: 'transparent', to: 'rgba(0,0,0,0.3)' } },
  ];

  const layers = propLayers || defaultLayers;

  if (!enabled || reducedMotion) {
    return (
      <div ref={containerRef} className={`relative h-[300vh] ${className}`}>
        {layers.map((layer) => (
          <div
            key={layer.id}
            className="absolute inset-0 flex items-center justify-center"
            style={{ zIndex: layer.depth }}
          >
            {layer.content || <div className="text-2xl font-bold">Layer {layer.depth}</div>}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative h-[300vh] overflow-hidden ${className}`} style={{ perspective: '1000px' }}>
      {layers.map((layer, index) => {
        const y = useTransform(scrollYProgress, [0, 1], [0, -(layer.parallaxSpeed || 0.5) * 100]);
        const mouseX = useTransform(
          () => mousePosition.x * (layer.mouseParallax?.strength || 0)
        );
        const mouseY = useTransform(
          () => mousePosition.y * (layer.mouseParallax?.strength || 0)
        );

        return (
          <motion.div
            key={layer.id}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              zIndex: layer.depth,
              y,
              x: mouseX,
              scale: layer.scale,
              opacity: layer.opacity,
              filter: layer.blur ? `blur(${layer.blur}px)` : undefined,
            }}
          >
            {layer.content || (
              <div className="text-6xl font-bold text-white/20">
                Layer {index + 1}
              </div>
            )}

            {layer.overlay?.type === 'gradient' && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(${layer.overlay.from || 'transparent'}, ${layer.overlay.to || 'rgba(0,0,0,0.3)'})`,
                }}
              />
            )}

            {layer.hotspots?.map((hotspot, hIndex) => (
              <div
                key={hIndex}
                className="absolute cursor-pointer"
                style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
              >
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
                {hotspot.tooltip && (
                  <div className="absolute left-6 top-0 px-3 py-1 bg-black/80 text-white text-sm rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                    {hotspot.content}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        );
      })}

      {fog.enabled && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, transparent, ${fog.color})`,
            opacity: 0.5,
          }}
        />
      )}
    </div>
  );
}