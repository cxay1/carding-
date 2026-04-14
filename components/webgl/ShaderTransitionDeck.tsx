'use client';

import { useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '../hooks/useReducedMotion';

export type TransitionType = 'wave' | 'pixel-sort' | 'rgb-split' | 'liquid';

export interface CardData {
  textureUrl?: string;
  transition?: {
    type?: TransitionType;
    amplitude?: number;
    frequency?: number;
    speed?: number;
    threshold?: number;
    direction?: 'vertical' | 'horizontal';
    distance?: number;
    angle?: number;
    viscosity?: number;
    turbulence?: number;
  };
}

interface ShaderTransitionProps {
  currentIndex: number;
  cards: CardData[];
  progress: number;
}

const TransitionPlane = ({ 
  textureUrl, 
  transitionType, 
  progress,
  amplitude = 0.5,
  frequency = 10,
  speed = 2,
}: { 
  textureUrl?: string; 
  transitionType?: TransitionType;
  progress: number;
  amplitude?: number;
  frequency?: number;
  speed?: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const texture = useMemo(() => {
    if (!textureUrl) {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = `hsl(${Math.random() * 360}, 50%, 50%)`;
        ctx.fillRect(0, 0, 800, 600);
      }
      return new THREE.CanvasTexture(canvas);
    }
    const loader = new THREE.TextureLoader();
    return loader.load(textureUrl);
  }, [textureUrl]);

  const uniforms = useMemo(() => ({
    uTexture: { value: texture },
    uProgress: { value: progress },
    uAmplitude: { value: amplitude },
    uFrequency: { value: frequency },
    uSpeed: { value: speed },
  }), [texture, progress, amplitude, frequency, speed]);

  const getFragmentShader = (type?: TransitionType) => {
    const shaders: Record<string, string> = {
      'wave': `
        uniform float uProgress;
        uniform float uAmplitude;
        uniform float uFrequency;
        varying vec2 vUv;
        
        void main() {
          vec2 uv = vUv;
          float wave = sin(uv.y * uFrequency + uProgress * 6.28) * uAmplitude;
          uv.x += wave * (1.0 - uProgress);
          gl_FragColor = texture2D(uTexture, uv);
        }
      `,
      'pixel-sort': `
        uniform float uProgress;
        uniform float uAmplitude;
        varying vec2 vUv;
        
        void main() {
          vec2 uv = vUv;
          float threshold = uAmplitude;
          float pixelY = floor(uv.y * 100.0);
          float sortValue = sin(pixelY * 0.1 + uProgress * 10.0);
          
          if (sortValue > threshold) {
            uv.x = 1.0 - uv.x;
          }
          gl_FragColor = texture2D(uTexture, uv);
        }
      `,
      'rgb-split': `
        uniform float uProgress;
        uniform float uAmplitude;
        varying vec2 vUv;
        
        void main() {
          vec2 uv = vUv;
          float dist = uAmplitude * (1.0 - uProgress);
          
          float r = texture2D(uTexture, uv + vec2(dist, 0.0)).r;
          float g = texture2D(uTexture, uv).g;
          float b = texture2D(uTexture, uv - vec2(dist, 0.0)).b;
          
          gl_FragColor = vec4(r, g, b, 1.0);
        }
      `,
      'liquid': `
        uniform float uProgress;
        uniform float uAmplitude;
        uniform float uFrequency;
        varying vec2 vUv;
        
        void main() {
          vec2 uv = vUv;
          float noise = sin(uv.x * 10.0 + uProgress * 5.0) * sin(uv.y * 10.0 + uProgress * 5.0);
          uv += noise * uAmplitude * 0.1 * (1.0 - uProgress);
          gl_FragColor = texture2D(uTexture, uv);
        }
      `,
    };
    
    return shaders[transitionType || 'wave'];
  };

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uProgress.value = progress;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[1920 / 200, 1080 / 200]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={getFragmentShader(transitionType)}
      />
    </mesh>
  );
};

const Deck = ({ currentIndex, cards, progress }: ShaderTransitionProps) => {
  return (
    <>
      {cards.map((card, index) => (
        <TransitionPlane
          key={index}
          textureUrl={card.textureUrl}
          transitionType={card.transition?.type}
          progress={index === currentIndex ? progress : 0}
          amplitude={card.transition?.amplitude || 0.5}
          frequency={card.transition?.frequency || 10}
          speed={card.transition?.speed || 2}
        />
      ))}
    </>
  );
};

export interface ShaderTransitionDeckProps {
  className?: string;
  cards?: CardData[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  enabled?: boolean;
  onIndexChange?: (index: number) => void;
}

export function ShaderTransitionDeck({
  className = '',
  cards,
  autoPlay = false,
  autoPlayInterval = 5000,
  enabled = true,
  onIndexChange,
}: ShaderTransitionDeckProps) {
  const reducedMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const progressRef = useRef<number>(0);

  const defaultCards: CardData[] = [
    { textureUrl: 'https://picsum.photos/800/600?random=1', transition: { type: 'wave', amplitude: 0.5, frequency: 10, speed: 2 } },
    { textureUrl: 'https://picsum.photos/800/600?random=2', transition: { type: 'pixel-sort', threshold: 0.5 } },
    { textureUrl: 'https://picsum.photos/800/600?random=3', transition: { type: 'rgb-split', distance: 0.1 } },
    { textureUrl: 'https://picsum.photos/800/600?random=4', transition: { type: 'liquid', viscosity: 0.8, turbulence: 0.5 } },
  ];

  const deckCards = cards || defaultCards;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = (prev + 1) % deckCards.length;
      onIndexChange?.(next);
      return next;
    });
    setProgress(0);
  }, [deckCards.length, onIndexChange]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = (prev - 1 + deckCards.length) % deckCards.length;
      onIndexChange?.(next);
      return next;
    });
    setProgress(0);
  }, [deckCards.length, onIndexChange]);

  useFrame((state, delta) => {
    if (autoPlay && progress < 1) {
      progressRef.current += delta / (autoPlayInterval / 1000);
      setProgress(Math.min(1, progressRef.current));
      
      if (progressRef.current >= 1) {
        goToNext();
        progressRef.current = 0;
      }
    }
  });

  if (!enabled || reducedMotion) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-50 pointer-events-none ${className}`}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Deck 
          currentIndex={currentIndex} 
          cards={deckCards} 
          progress={progress} 
        />
      </Canvas>
    </div>
  );
}