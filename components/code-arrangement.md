# AI Code Arrangement Guide

Guidelines for organizing code from component design to logic lifecycle. Applicable to websites, web apps, and native apps.

## Core Principles

### 1. Single Responsibility
- One component does one thing well
- Split complex UI into smaller components
- Extract reusable logic into hooks

### 2. Consistent File Structure
```
src/
├── components/     # UI components
│   ├── ui/         # Primitive/base components
│   └── features/   # Feature-specific components
├── hooks/          # Custom React hooks
├── services/       # Business logic/API calls
├── lib/            # Utilities and helpers
├── types/          # TypeScript types
└── app/            # Pages and routing
```

### 3. Naming Conventions
- **Components**: PascalCase (UserProfile, ProductCard)
- **Hooks**: camelCase with "use" prefix (useAuth, useFetch)
- **Types**: PascalCase with suffix (UserType, ApiResponse)
- **Files**: kebab-case (user-profile.tsx, api-client.ts)

## Component Design Rules

### Before Writing Code
1. Identify the data needed (props)
2. Identify the actions (handlers)
3. Identify the side effects (useEffect)
4. Define the visual states

### Component Structure Pattern
```tsx
// 1. Imports - external first, then internal
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks';

// 2. Types/Interfaces
interface Props {
  title: string;
  onSubmit: () => void;
}

// 3. Helper functions (if any)
function formatDate(date: Date): string { ... }

// 4. Main component
export function Component({ title, onSubmit }: Props) {
  // 5. State - grouped by purpose
  const [data, setData] = useState<Data>(null);
  const [loading, setLoading] = useState(true);

  // 6. Hooks
  const { user } = useAuth();

  // 7. Effects
  useEffect(() => { ... }, []);

  // 8. Handlers
  const handleClick = () => { ... };

  // 9. Render
  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
}
```

## Logic Lifecycle

### 1. Data Fetching
```tsx
// Prefer: Custom hook
const { data, loading, error } = useUserData(userId);

// Or: Server components with fetch
async function Page() {
  const data = await fetchData();
  return <Component data={data} />;
}
```

### 2. State Management
```tsx
// Local state: useState
const [count, setCount] = useState(0);

// Derived state: calculate during render
const isActive = currentId === item.id;

// Shared state: useContext or store
const { theme } = useTheme();
```

### 3. Side Effects
```tsx
// Event handlers (preferred)
const handleSubmit = () => fetch('/api/data');

// useEffect for subscriptions/cleanup
useEffect(() => {
  const sub = subscribe(id, callback);
  return () => sub.unsubscribe();
}, [id]);
```

### 4. Error Handling
```tsx
// Try-catch in handlers
const handleSubmit = async () => {
  try {
    await submit(data);
  } catch (err) {
    setError(err.message);
  }
};

// Error boundaries for UI failures
<ErrorBoundary fallback={<ErrorUI />}>
  <Component />
</ErrorBoundary>
```

## Strict Rules for AI

### DO
- Keep files under 200 lines
- Extract logic into custom hooks
- Use TypeScript strictly
- Document complex algorithms
- Test critical paths

### DON'T
- Put unrelated code in same file
- Mix UI and business logic
- Use any without justification
- Leave console.log in production
- Skip error states

### File Organization Order
1. Type definitions
2. Constants/configs
3. Helper functions
4. Custom hooks
5. Component definition
6. Export

### Import Order
1. React/framework imports
2. External libraries
3. Internal absolute imports (@/...)
4. Relative imports (./...)

## Platform-Specific Notes

### Web (Next.js/React)
- Use Server Components where possible
- Keep client components small
- Use streaming for large data

### Web Apps
- Implement code splitting
- Lazy load features
- Optimize bundle size

### Native (React Native/Flutter)
- Keep components platform-agnostic when possible
- Extract platform-specific code
- Use responsive design patterns

## Validation Checklist

Before marking code complete:
- [ ] Component has single responsibility
- [ ] No mixed concerns (UI + logic)
- [ ] Types are defined and used
- [ ] Error states handled
- [ ] Loading states shown
- [ ] No console.log in production
- [ ] File naming follows conventions
- [ ] Imports ordered correctly
- [ ] Code fits within line limits
- [ ] Logic extracted to hooks