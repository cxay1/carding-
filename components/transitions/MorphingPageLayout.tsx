'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

export type LayoutState = 'grid' | 'focus' | 'list';

export interface LayoutItem {
  id: string;
  content?: React.ReactNode;
  imageUrl?: string;
}

export interface MorphingPageLayoutProps {
  className?: string;
  items?: LayoutItem[];
  initialState?: LayoutState;
  transitions?: {
    type?: 'layout' | 'spring';
    spring?: { stiffness?: number; damping?: number };
    stagger?: number;
  };
  controls?: {
    position?: string;
    toggle?: Array<{ id: LayoutState; label: string }>;
  };
  enabled?: boolean;
}

const layoutClasses: Record<LayoutState, string> = {
  grid: 'grid grid-cols-2 gap-4 p-8',
  focus: 'flex flex-col gap-8 p-8',
  list: 'flex flex-col gap-4 p-8 max-w-3xl mx-auto',
};

const itemClasses: Record<LayoutState, (index: number, total: number) => string> = {
  grid: (index) => {
    const defaults = ['', '', '', ''];
    return defaults[index] || 'aspect-square';
  },
  focus: (index, total) => index === 0 ? 'h-[60vh]' : 'h-[15vh] opacity-60',
  list: () => 'h-48 flex flex-row gap-4',
};

export function MorphingPageLayout({
  className = '',
  items: propItems,
  initialState = 'grid',
  transitions = { type: 'layout', spring: { stiffness: 300, damping: 30 }, stagger: 0.05 },
  controls = {
    position: 'fixed bottom-8 left-1/2 -translate-x-1/2',
    toggle: [
      { id: 'grid', label: 'Grid' },
      { id: 'focus', label: 'Focus' },
      { id: 'list', label: 'List' },
    ],
  },
  enabled = true,
}: MorphingPageLayoutProps) {
  const reducedMotion = useReducedMotion();
  const [activeItem, setActiveItem] = useState(0);
  const [layoutState, setLayoutState] = useState<LayoutState>(initialState);

  const defaultItems: LayoutItem[] = [
    { id: 'item-0', imageUrl: 'https://picsum.photos/800/400?random=1' },
    { id: 'item-1', imageUrl: 'https://picsum.photos/400/400?random=2' },
    { id: 'item-2', imageUrl: 'https://picsum.photos/400/400?random=3' },
    { id: 'item-3', imageUrl: 'https://picsum.photos/800/400?random=4' },
  ];

  const items = propItems || defaultItems;

  const handleLayoutChange = useCallback((newState: LayoutState) => {
    setLayoutState(newState);
    if (newState === 'focus') {
      setActiveItem(0);
    }
  }, []);

  if (!enabled || reducedMotion) {
    return (
      <div className={`${layoutClasses[layoutState]} ${className}`}>
        {items.map((item) => (
          <div
            key={item.id}
            className={itemClasses[layoutState](items.indexOf(item), items.length)}
          >
            {item.content || (item.imageUrl && (
              <img src={item.imageUrl} alt={item.id} className="w-full h-full object-cover" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={layoutState}
          className={layoutClasses[layoutState]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: reducedMotion ? 0 : 0.3,
          }}
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              layoutId={item.id}
              className={itemClasses[layoutState](index, items.length)}
              onClick={() => layoutState === 'grid' && setActiveItem(index)}
              transition={{
                type: transitions.type === 'spring' ? 'spring' : 'tween',
                stiffness: transitions.spring?.stiffness,
                damping: transitions.spring?.damping,
                delay: index * (transitions.stagger || 0.05),
              }}
            >
              {item.content || (item.imageUrl && (
                <img src={item.imageUrl} alt={item.id} className="w-full h-full object-cover rounded-lg" />
              ))}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {controls?.toggle && (
        <div className={`${controls.position} flex gap-2 z-10`}>
          {controls.toggle.map((btn) => (
            <button
              key={btn.id}
              onClick={() => handleLayoutChange(btn.id)}
              className={`px-4 py-2 rounded-full transition-colors ${
                layoutState === btn.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}