# Framer Motion Components

This document describes the Framer Motion primitives and layout components available in the project.

## Primitive Components

### MotionImage
Animated image with loading states and effects.

```tsx
import { MotionImage } from '@/components/ui/primitives/motion-image';

<MotionImage
  src="/image.jpg"
  alt="Description"
  placeholder="blur"
  blurDataURL="data:image/..."
  className="w-full h-64"
  priority
/>
```

**Props:**
- `placeholder?: 'blur' | 'empty'` - Show placeholder while loading
- `blurDataURL?: string` - Custom blur placeholder image
- `shimmerClassName?: string` - Custom shimmer styling
- `onErrorState?: (hasError: boolean) => void` - Error callback

### GestureContainer
Drag container with constraints and snap points.

```tsx
import { GestureContainer } from '@/components/ui/primitives/gesture-container';

<GestureContainer
  drag="x"
  dragConstraints={{ left: 0, right: 300 }}
  dragElastic={0.2}
  snapPointsX={[{ value: 0 }, { value: 150 }, { value: 300 }]}
  onDragEnd={(event, info) => console.log('Drag ended', info)}
>
  <div>Draggable content</div>
</GestureContainer>
```

**Props:**
- `drag?: 'x' | 'y' | false` - Drag axis
- `dragConstraints?: object | RefObject` - Movement bounds
- `dragElastic?: number` - Elasticity (0-1)
- `momentum?: number` - Momentum coefficient
- `snapPointsX/Y?: SnapPoint[]` - Snap positions

### TiltCard
3D tilting card with glare and shadow effects.

```tsx
import { TiltCard } from '@/components/ui/primitives/tilt-card';

<TiltCard
  tiltMax={20}
  enableGlare
  enableShadow
  glareIntensity={0.3}
>
  <div className="p-6">Card content</div>
</TiltCard>
```

**Props:**
- `tiltMax?: number` - Max rotation in degrees
- `enableGlare?: boolean` - Show glare overlay
- `glareIntensity?: number` - Glare opacity (0-1)
- `enableShadow?: boolean` - Enable dynamic shadow
- `shadowBlur?: number` - Shadow blur radius
- `transitionSpeed?: number` - Animation speed

### SpotlightBox
Mouse-tracking border glow effect.

```tsx
import { SpotlightBox } from '@/components/ui/primitives/spotlight-box';

<SpotlightBox
  borderColor="rgba(255,255,255,0.1)"
  glowColor="rgba(255,255,255,0.5)"
  glowIntensity={0.8}
  enableInnerLight
>
  <div>Content</div>
</SpotlightBox>
```

**Props:**
- `borderColor?: string` - Border color
- `glowColor?: string` - Glow color
- `borderRadius?: string` - Border radius
- `glowIntensity?: number` - Glow opacity (0-1)
- `enableInnerLight?: boolean` - Inner radial light
- `innerLightColor?: string` - Inner light color

## Layout Components

Located in `docs/components/layouts/`:

| Component | Description |
|-----------|-------------|
| HeroThreeCol | Hero image + 3-column grid |
| BentoGrid | Asymmetric bento-style grid |
| AsymmetricFeature | Two-row split layout |
| MasonryStagger | CSS columns masonry |
| CarouselFocus | Image carousel with thumbnails |
| OverlappingCards | Stacked draggable cards |
| ParallaxReveal | Scroll-triggered reveals |
| MorphingGrid | Grid/list view toggle |

## Animation Utilities

From `docs/components/layouts/animations/AnimatedImage.tsx`:

### Available Presets
```ts
import { animationPresets, shouldReduceMotion } from '@/docs/components/layouts/animations/AnimatedImage';

// fadeInUp, fadeInScale, slideInLeft, slideInRight
// staggerContainer, hoverScale, hoverLift, parallaxSlow
```

### Check Reduced Motion
```ts
const reducedMotion = shouldReduceMotion();
// Returns true if user prefers reduced motion
```

## Accessibility

All components support `prefers-reduced-motion`. When detected:
- Animations are disabled or simplified
- Components render with static styles
- Users still receive full functionality

## File Locations

```
src/components/ui/primitives/
├── motion-image.tsx      # MotionImage
├── gesture-container.tsx # GestureContainer
├── tilt-card.tsx         # TiltCard
└── spotlight-box.tsx     # SpotlightBox

docs/components/layouts/
├── HeroThreeCol.tsx
├── BentoGrid.tsx
├── AsymmetricFeature.tsx
├── MasonryStagger.tsx
├── CarouselFocus.tsx
├── OverlappingCards.tsx
├── ParallaxReveal.tsx
├── MorphingGrid.tsx
└── animations/
    └── AnimatedImage.tsx
```