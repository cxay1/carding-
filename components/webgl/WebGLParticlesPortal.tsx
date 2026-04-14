'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ParticleProps {
  count: number;
  mouseRef: React.MutableRefObject<THREE.Vector2>;
}

const Particles = ({ count, mouseRef }: ParticleProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = count || 50000;

  const { positions, velocities, sizes, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);

    const colorStart = new THREE.Color('#4f46e5');
    const colorEnd = new THREE.Color('#ec4899');

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 2 + Math.random() * 2;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      velocities[i3] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;

      sizes[i] = 0.5 + Math.random() * 2.5;

      const t = Math.random();
      const color = colorStart.clone().lerp(colorEnd, t);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    return { positions, velocities, sizes, colors };
  }, [particleCount]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, sizes, colors]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float uPixelRatio;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const positionAttribute = pointsRef.current.geometry.attributes.position;
    const posArray = positionAttribute.array as Float32Array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      const dx = mouseRef.current.x - posArray[i3];
      const dy = mouseRef.current.y - posArray[i3 + 1];
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 2) {
        const force = 0.5 * (1 - dist / 2);
        velocities[i3] += dx * force * 0.01;
        velocities[i3 + 1] += dy * force * 0.01;
      }

      velocities[i3] *= 0.98;
      velocities[i3 + 1] *= 0.98;
      velocities[i3 + 2] *= 0.98;

      velocities[i3] += (Math.random() - 0.5) * 0.001;
      velocities[i3 + 1] += (Math.random() - 0.5) * 0.001;
      velocities[i3 + 2] += (Math.random() - 0.5) * 0.001;

      posArray[i3] += velocities[i3];
      posArray[i3 + 1] += velocities[i3 + 1];
      posArray[i3 + 2] += velocities[i3 + 2];
    }

    positionAttribute.needsUpdate = true;
    material.uniforms.uTime.value = time;
    material.uniforms.uMouse.value = mouseRef.current;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
};

export interface WebGLParticlesPortalProps {
  className?: string;
  particleCount?: number;
  enabled?: boolean;
}

export function WebGLParticlesPortal({
  className = '',
  particleCount = 50000,
  enabled = true,
}: WebGLParticlesPortalProps) {
  const reducedMotion = useReducedMotion();
  const mouseRef = useRef(new THREE.Vector2(0, 0));

  if (!enabled || reducedMotion) {
    return null;
  }

  return (
    <div className={`fixed inset-0 z-0 pointer-events-none ${className}`}>
      <Canvas
        dpr={1}
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Particles count={particleCount} mouseRef={mouseRef} />
      </Canvas>
    </div>
  );
}