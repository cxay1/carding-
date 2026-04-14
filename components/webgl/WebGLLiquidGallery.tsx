'use client';

import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useAnimationStore } from '../store/useAnimationStore';

interface LiquidDistortionProps {
  imageUrl?: string;
  distortionStrength?: number;
  rgbShift?: number;
  noiseScale?: number;
}

const LiquidDistortionMaterial = ({
  uTime,
  uMouse,
  uDistortionStrength,
  uRGBShift,
  uNoiseScale,
  uTexture,
}: {
  uTime: number;
  uMouse: THREE.Vector2;
  uDistortionStrength: number;
  uRGBShift: number;
  uNoiseScale: number;
  uTexture: THREE.Texture;
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: uTime },
      uMouse: { value: uMouse },
      uDistortionStrength: { value: uDistortionStrength },
      uRGBShift: { value: uRGBShift },
      uNoiseScale: { value: uNoiseScale },
      uTexture: { value: uTexture },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uMouse.value = uMouse;
    }
  });

  return (
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
      fragmentShader={`
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uDistortionStrength;
        uniform float uRGBShift;
        uniform float uNoiseScale;
        uniform sampler2D uTexture;
        varying vec2 vUv;

        float noise(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        float smoothNoise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          
          float a = noise(i);
          float b = noise(i + vec2(1.0, 0.0));
          float c = noise(i + vec2(0.0, 1.0));
          float d = noise(i + vec2(1.0, 1.0));
          
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        void main() {
          vec2 uv = vUv;
          float dist = distance(uv, uMouse);
          float wave = sin(dist * 20.0 - uTime * 2.0) * 0.02 * uDistortionStrength;
          wave *= smoothstep(0.5, 0.0, dist);
          
          vec2 distortedUV = uv + wave;
          
          float r = texture2D(uTexture, distortedUV + vec2(uRGBShift, 0.0)).r;
          float g = texture2D(uTexture, distortedUV).g;
          float b = texture2D(uTexture, distortedUV - vec2(uRGBShift, 0.0)).b;
          
          gl_FragColor = vec4(r, g, b, 1.0);
        }
      `}
    />
  );
};

const ImagePlane = ({
  position,
  rotation,
  geometry,
  imageUrl,
  distortionStrength,
  rgbShift,
  noiseScale,
  index,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  geometry: [number, number, number, number];
  imageUrl?: string;
  distortionStrength?: number;
  rgbShift?: number;
  noiseScale?: number;
  index: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();
  const progress = useAnimationStore((state) => state.scroll.progress);

  const texture = useTexture(imageUrl || 'https://picsum.photos/800/600');

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <planeGeometry args={geometry} />
      <LiquidDistortionMaterial
        uTime={0}
        uMouse={mouse}
        uDistortionStrength={distortionStrength || 0.5}
        uRGBShift={rgbShift || 0.02}
        uNoiseScale={noiseScale || 1.5}
        uTexture={texture}
      />
    </mesh>
  );
};

const Scene = ({ images }: { images: Array<{ url?: string; position?: [number, number, number]; rotation?: [number, number, number]; geometry?: [number, number, number, number]; distortion?: number; rgbShift?: number }> }) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <fog attach="fog" args={['#000000', 10, 50]} />
      
      {images.map((img, i) => (
        <ImagePlane
          key={i}
          index={i}
          position={img.position || [0, 0, 0]}
          rotation={img.rotation || [0, 0, 0]}
          geometry={img.geometry || [3.2, 1.8, 32, 32]}
          imageUrl={img.url}
          distortionStrength={img.distortion}
          rgbShift={img.rgbShift}
          noiseScale={1.5}
        />
      ))}
    </>
  );
};

export interface WebGLLiquidGalleryProps {
  className?: string;
  images?: Array<{
    url?: string;
    position?: [number, number, number];
    rotation?: [number, number, number];
    geometry?: [number, number, number, number];
    distortion?: number;
    rgbShift?: number;
  }>;
  enabled?: boolean;
}

export function WebGLLiquidGallery({
  className = '',
  images,
  enabled = true,
}: WebGLLiquidGalleryProps) {
  const reducedMotion = useReducedMotion();

  if (!enabled || reducedMotion) {
    return null;
  }

  const defaultImages = [
    { position: [0, 0, 0] as [number, number, number], rotation: [0, 0, 0] as [number, number, number], geometry: [3.2, 1.8, 32, 32] as [number, number, number, number], distortion: 0.5, rgbShift: 0.02 },
    { position: [-4, -2, -2] as [number, number, number], rotation: [0, 0.3, 0] as [number, number, number], geometry: [1.5, 1.5, 32, 32] as [number, number, number, number], distortion: 0.3, rgbShift: 0.01 },
    { position: [4, 2, -3] as [number, number, number], rotation: [0, -0.3, 0] as [number, number, number], geometry: [1.5, 1.5, 32, 32] as [number, number, number, number], distortion: 0.3, rgbShift: 0.01 },
    { position: [0, -3, -1] as [number, number, number], rotation: [0.1, 0, 0] as [number, number, number], geometry: [2, 1.2, 32, 32] as [number, number, number, number], distortion: 0.4, rgbShift: 0.015 },
  ];

  const galleryImages = images || defaultImages;

  return (
    <div className={`fixed inset-0 z-0 pointer-events-none ${className}`}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Scene images={galleryImages} />
        </Suspense>
      </Canvas>
    </div>
  );
}