# Layout Components

Animated layout components built with Next.js, Tailwind CSS, and Framer Motion.

## Components

### HeroThreeCol
Hero section with image + 3-column grid below. Features:
- Parallax scroll effect on hero image
- Staggered entrance animations for grid items
- Hover scale interactions

### BentoGrid
Asymmetric bento-style grid layout. Features:
- Large 2x2 card + 2 horizontal cards + 2 square cards
- Spring-based entrance with bounce effect
- Hover lift and rotate effects
- Responsive (stacks on mobile)

### AsymmetricFeature
Two-row split layout with alternating 60/40 and 40/60 ratios. Features:
- Parallax scroll on top section
- Hover rotate effects on bottom section
- Scroll-triggered animations
- Responsive breakpoint handling

### MasonryStagger
Masonry-style staggered grid. Features:
- CSS columns for true masonry layout
- Varied aspect ratios (3/4 and 4/3)
- Staggered entrance with rotation
- Hover lift with z-index stacking

### CarouselFocus
Image carousel with thumbnails. Features:
- Smooth slide transitions
- Thumbnail navigation with active states
- Keyboard accessible
- Touch/drag support ready

### OverlappingCards
Stacked cards with drag interaction. Features:
- 4 overlapping cards with different rotations
- Drag to reorder
- Hover brings card to front
- Spring physics for natural feel

### ParallaxReveal
Full-screen scroll-triggered reveals. Features:
- 4 sticky sections with different animations
- Fade, scale, rotate, slide, and blur effects
- Scroll progress based transitions
- Caption support

### MorphingGrid
Grid to list view toggle with layout animation. Features:
- Toggle button to switch views
- Layout animations using layoutId
- Spring physics for smooth morphing
- List view shows descriptions

## Shared Components

### AnimatedImage
Wrapper for next/image with Framer Motion. Located in `animations/AnimatedImage.tsx`

### Types
TypeScript interfaces in `types.ts`

## Usage

```tsx
import { BentoGrid, HeroThreeCol } from '@/docs/components/layouts';

const images = [
  { id: '1', src: '/hero.jpg', alt: 'Main', priority: true },
  { id: '2', src: '/img2.jpg', alt: 'Second' },
  { id: '3', src: '/img3.jpg', alt: 'Third' },
  { id: '4', src: '/img4.jpg', alt: 'Fourth' },
];

export default function Page() {
  return <BentoGrid images={images} />;
}
```

## Animation Presets

Available in `animations/AnimatedImage.tsx`:
- `fadeInUp` - Fade in and slide up
- `fadeInScale` - Fade in with scale
- `slideInLeft/Right` - Slide from sides
- `hoverScale` - Scale on hover
- `hoverLift` - Lift with shadow on hover
- `parallaxSlow` - Slow parallax effect

## Accessibility

All components support `prefers-reduced-motion`. When detected, animations are simplified or disabled.

## File Structure

```
docs/components/layouts/
├── index.ts              # Exports
├── types.ts              # TypeScript types
├── HeroThreeCol.tsx      # Component
├── BentoGrid.tsx
├── AsymmetricFeature.tsx
├── MasonryStagger.tsx
├── CarouselFocus.tsx
├── OverlappingCards.tsx
├── ParallaxReveal.tsx
├── MorphingGrid.tsx
└── animations/
    └── AnimatedImage.tsx # Shared animation utilities
```