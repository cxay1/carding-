import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AnimationState {
  scroll: {
    progress: number;
    velocity: number;
    direction: 'up' | 'down' | 'none';
    isScrolling: boolean;
  };
  mouse: {
    x: number;
    y: number;
    normalizedX: number;
    normalizedY: number;
    isMoving: boolean;
  };
  webgl: {
    isSupported: boolean;
    contextLost: boolean;
  };
  transitions: {
    isTransitioning: boolean;
    currentPage: string;
    previousPage: string | null;
  };
  reducedMotion: boolean;
  performance: {
    fps: number;
    memory?: number;
  };
}

export interface AnimationActions {
  setScrollProgress: (progress: number) => void;
  setScrollVelocity: (velocity: number) => void;
  setScrollDirection: (direction: 'up' | 'down' | 'none') => void;
  setIsScrolling: (isScrolling: boolean) => void;
  setMousePosition: (x: number, y: number) => void;
  setMouseNormalized: (x: number, y: number) => void;
  setIsMouseMoving: (isMoving: boolean) => void;
  setWebGLSupported: (isSupported: boolean) => void;
  setContextLost: (contextLost: boolean) => void;
  setTransitioning: (isTransitioning: boolean) => void;
  setCurrentPage: (page: string) => void;
  setPreviousPage: (page: string | null) => void;
  setReducedMotion: (reduced: boolean) => void;
  setFps: (fps: number) => void;
  setMemory: (memory: number) => void;
  reset: () => void;
}

const initialState: AnimationState = {
  scroll: {
    progress: 0,
    velocity: 0,
    direction: 'none',
    isScrolling: false,
  },
  mouse: {
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
    isMoving: false,
  },
  webgl: {
    isSupported: true,
    contextLost: false,
  },
  transitions: {
    isTransitioning: false,
    currentPage: '',
    previousPage: null,
  },
  reducedMotion: false,
  performance: {
    fps: 60,
  },
};

export const useAnimationStore = create<AnimationState & AnimationActions>()(
  persist(
    (set) => ({
      ...initialState,

      setScrollProgress: (progress) =>
        set((state) => ({ scroll: { ...state.scroll, progress } })),

      setScrollVelocity: (velocity) =>
        set((state) => ({ scroll: { ...state.scroll, velocity } })),

      setScrollDirection: (direction) =>
        set((state) => ({ scroll: { ...state.scroll, direction } })),

      setIsScrolling: (isScrolling) =>
        set((state) => ({ scroll: { ...state.scroll, isScrolling } })),

      setMousePosition: (x, y) =>
        set((state) => ({ mouse: { ...state.mouse, x, y } })),

      setMouseNormalized: (normalizedX, normalizedY) =>
        set((state) => ({ mouse: { ...state.mouse, normalizedX, normalizedY } })),

      setIsMouseMoving: (isMoving) =>
        set((state) => ({ mouse: { ...state.mouse, isMoving } })),

      setWebGLSupported: (isSupported) =>
        set((state) => ({ webgl: { ...state.webgl, isSupported } })),

      setContextLost: (contextLost) =>
        set((state) => ({ webgl: { ...state.webgl, contextLost } })),

      setTransitioning: (isTransitioning) =>
        set((state) => ({ transitions: { ...state.transitions, isTransitioning } })),

      setCurrentPage: (currentPage) =>
        set((state) => ({
          transitions: { ...state.transitions, previousPage: state.transitions.currentPage, currentPage },
        })),

      setPreviousPage: (previousPage) =>
        set((state) => ({ transitions: { ...state.transitions, previousPage } })),

      setReducedMotion: (reducedMotion) => set({ reducedMotion }),

      setFps: (fps) => set((state) => ({ performance: { ...state.performance, fps } })),

      setMemory: (memory) => set((state) => ({ performance: { ...state.performance, memory } })),

      reset: () => set(initialState),
    }),
    {
      name: 'animation-storage',
      partialize: (state) => ({
        reducedMotion: state.reducedMotion,
      }),
    }
  )
);

export const useScrollState = () => useAnimationStore((state) => state.scroll);
export const useMouseState = () => useAnimationStore((state) => state.mouse);
export const useWebGLState = () => useAnimationStore((state) => state.webgl);
export const useTransitionState = () => useAnimationStore((state) => state.transitions);
export const usePerformanceState = () => useAnimationStore((state) => state.performance);