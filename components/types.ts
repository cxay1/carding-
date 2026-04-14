export interface LayoutImage {
  id?: string;
  src: string;
  alt?: string;
  title?: string;
  description?: string;
  priority?: boolean;
}

export interface AnimationConfig {
  duration?: number;
  ease?: string;
  delay?: number;
  type?: 'spring' | 'tween' | 'keyframes';
  bounce?: number;
  stiffness?: number;
  damping?: number;
}

export interface ParallaxConfig {
  speed?: number;
  direction?: 'vertical' | 'horizontal';
  depth?: number;
}

export interface TransitionConfig {
  type: 'fade' | 'slide' | 'scale' | 'blur';
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
}