export interface LayoutImage {
  id: string;
  src: string;
  alt: string;
  priority?: boolean;
}

export interface AnimationConfig {
  initial?: Record<string, unknown>;
  animate?: Record<string, unknown>;
  transition?: Record<string, unknown>;
  whileHover?: Record<string, unknown>;
  whileTap?: Record<string, unknown>;
  scrollYProgress?: number[];
  delay?: number;
}

export interface BentoSlot {
  slot: number;
  className: string;
  imageClass: string;
  animation?: {
    entrance?: AnimationConfig;
    hover?: string;
  };
}

export interface MasonryItem {
  slot: number;
  className: string;
  aspectRatio: string;
  animation: {
    entrance: AnimationConfig;
    hover: {
      whileHover: Record<string, unknown>;
      transition: Record<string, unknown>;
    };
  };
}

export interface CardConfig {
  slot: number;
  className: string;
  zIndex: number;
  animation: {
    initial: Record<string, unknown>;
    animate: Record<string, unknown>;
    whileHover: Record<string, unknown>;
    drag: boolean;
  };
}

export interface ParallaxSection {
  slot: number;
  className: string;
  imageClass: string;
  animation: {
    scrollProgress: {
      inputRange: number[];
      opacity?: number[];
      scale?: number[];
      y?: number[];
      x?: string[];
      rotate?: number[];
      filter?: string[];
    };
  };
}

export interface MorphingItem {
  slot: number;
  animation: {
    layout: boolean;
    transition: Record<string, unknown>;
  };
}