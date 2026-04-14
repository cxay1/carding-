'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { LayoutImage } from '../types';
import { shouldReduceMotion } from './animations/AnimatedImage';

interface MorphingGridProps {
  images: LayoutImage[];
}

type ViewMode = 'grid' | 'list';

export function MorphingGrid({ images }: MorphingGridProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const reducedMotion = shouldReduceMotion();

  const gridVariants = {
    grid: {
      container: 'grid grid-cols-2 gap-4 p-4 md:grid-cols-4 md:gap-6 md:p-8',
      item: 'aspect-square rounded-xl overflow-hidden cursor-pointer',
    },
    list: {
      container: 'flex flex-col gap-4 p-4 max-w-3xl mx-auto',
      item: 'h-64 rounded-xl overflow-hidden cursor-pointer flex flex-row',
    },
  };

  const transitionConfig = {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  };

  return (
    <div className="w-full">
      {/* Toggle Button */}
      <div className="fixed top-20 right-4 z-50">
        <motion.button
          className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg text-sm font-medium text-gray-800 hover:bg-white transition-colors"
          onClick={() => setViewMode((prev) => (prev === 'grid' ? 'list' : 'grid'))}
          whileTap={{ scale: 0.95 }}
        >
          {viewMode === 'grid' ? 'Switch to List' : 'Switch to Grid'}
        </motion.button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          className={gridVariants[viewMode].container}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {images.slice(0, 4).map((image, index) => (
            <motion.div
              key={image.id || index}
              layoutId={`image-container-${index}`}
              layout
              transition={reducedMotion ? undefined : transitionConfig}
              className={viewMode === 'grid' 
                ? gridVariants.grid.item 
                : gridVariants.list.item
              }
              whileHover={!reducedMotion ? { scale: 1.02 } : undefined}
              whileTap={!reducedMotion ? { scale: 0.98 } : undefined}
            >
              <Image
                src={image.src}
                alt={image.alt || ''}
                fill={viewMode === 'grid'}
                width={viewMode === 'list' ? 300 : undefined}
                height={viewMode === 'list' ? 256 : undefined}
                className={`object-cover ${
                  viewMode === 'list' ? 'w-48 h-full' : 'w-full h-full'
                }`}
                sizes={
                  viewMode === 'grid' 
                    ? '(max-width: 768px) 50vw, 25vw' 
                    : '300px'
                }
                priority={image.priority}
              />
              
              {viewMode === 'list' && (
                <div className="flex-1 p-4 flex flex-col justify-center">
                  <h3 className="text-lg font-semibold text-white">{image.alt}</h3>
                  <p className="text-sm text-gray-400">Description for {image.alt}</p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default MorphingGrid;