# Usage Examples

## HeroThreeCol

```tsx
import { HeroThreeCol } from '@/docs/components/layouts';

const images = [
  { id: '1', src: '/hero.jpg', alt: 'Campus', priority: true },
  { id: '2', src: '/students.jpg', alt: 'Students' },
  { id: '3', src: '/library.jpg', alt: 'Library' },
  { id: '4', src: '/sports.jpg', alt: 'Sports' },
];

export default function Page() {
  return (
    <HeroThreeCol 
      images={images}
      overlayText={{
        title: 'Welcome to AVI',
        subtitle: 'Shape your future'
      }}
    />
  );
}
```

## BentoGrid

```tsx
import { BentoGrid } from '@/docs/components/layouts';

const images = [
  { id: '1', src: '/main.jpg', alt: 'Main', priority: true },
  { id: '2', src: '/top-right.jpg', alt: 'Top Right' },
  { id: '3', src: '/bottom-left.jpg', alt: 'Bottom Left' },
  { id: '4', src: '/bottom-right.jpg', alt: 'Bottom Right' },
];

export default function Page() {
  return <BentoGrid images={images} />;
}
```

## AsymmetricFeature

```tsx
import { AsymmetricFeature } from '@/docs/components/layouts';

const images = [
  { id: '1', src: '/feature1.jpg', alt: 'Feature 1', priority: true },
  { id: '2', src: '/feature2.jpg', alt: 'Feature 2' },
  { id: '3', src: '/feature3.jpg', alt: 'Feature 3' },
  { id: '4', src: '/feature4.jpg', alt: 'Feature 4' },
];

export default function Page() {
  return <AsymmetricFeature images={images} />;
}
```

## MasonryStagger

```tsx
import { MasonryStagger } from '@/docs/components/layouts';

const images = [
  { id: '1', src: '/masonry1.jpg', alt: 'Image 1', priority: true },
  { id: '2', src: '/masonry2.jpg', alt: 'Image 2' },
  { id: '3', src: '/masonry3.jpg', alt: 'Image 3' },
  { id: '4', src: '/masonry4.jpg', alt: 'Image 4' },
];

export default function Page() {
  return <MasonryStagger images={images} />;
}
```

## CarouselFocus

```tsx
import { CarouselFocus } from '@/docs/components/layouts';

const images = [
  { id: '1', src: '/slide1.jpg', alt: 'Slide 1', priority: true },
  { id: '2', src: '/slide2.jpg', alt: 'Slide 2' },
  { id: '3', src: '/slide3.jpg', alt: 'Slide 3' },
  { id: '4', src: '/slide4.jpg', alt: 'Slide 4' },
];

export default function Page() {
  return <CarouselFocus images={images} />;
}
```

## OverlappingCards

```tsx
import { OverlappingCards } from '@/docs/components/layouts';

const images = [
  { id: '1', src: '/card1.jpg', alt: 'Card 1', priority: true },
  { id: '2', src: '/card2.jpg', alt: 'Card 2' },
  { id: '3', src: '/card3.jpg', alt: 'Card 3' },
  { id: '4', src: '/card4.jpg', alt: 'Card 4' },
];

export default function Page() {
  return <OverlappingCards images={images} />;
}
```

## ParallaxReveal

```tsx
import { ParallaxReveal } from '@/docs/components/layouts';

const images = [
  { id: '1', src: '/parallax1.jpg', alt: 'Section 1', priority: true },
  { id: '2', src: '/parallax2.jpg', alt: 'Section 2' },
  { id: '3', src: '/parallax3.jpg', alt: 'Section 3' },
  { id: '4', src: '/parallax4.jpg', alt: 'Section 4' },
];

export default function Page() {
  return (
    <ParallaxReveal 
      images={images}
      captions={[
        'Welcome',
        'Discover',
        'Explore',
        'Join Us'
      ]}
    />
  );
}
```

## MorphingGrid

```tsx
import { MorphingGrid } from '@/docs/components/layouts';

const images = [
  { id: '1', src: '/grid1.jpg', alt: 'Item 1', priority: true },
  { id: '2', src: '/grid2.jpg', alt: 'Item 2' },
  { id: '3', src: '/grid3.jpg', alt: 'Item 3' },
  { id: '4', src: '/grid4.jpg', alt: 'Item 4' },
];

export default function Page() {
  return <MorphingGrid images={images} />;
}
```

## Using Animation Presets

```tsx
import { animationPresets, shouldReduceMotion } from '@/docs/components/layouts/animations/AnimatedImage';
import { motion } from 'framer-motion';

export function MyComponent() {
  const reducedMotion = shouldReduceMotion();
  
  return (
    <motion.div
      {...(reducedMotion ? { initial: { opacity: 0 }, animate: { opacity: 1 } } : animationPresets.fadeInUp)}
    >
      Content
    </motion.div>
  );
}
```