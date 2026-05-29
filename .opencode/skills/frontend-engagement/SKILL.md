---
name: frontend-engagement
description: Use when improving frontend UX, animations, micro-interactions, and engagement patterns to convert visitors into daily users. Focus on subtle, delightful animations without overcrowding the minimalist design.
---

# Frontend Engagement & Daily User Retention

## Design Principles for Two Thumbs Up

1. **Subtle over flashy** - Micro-interactions should feel responsive, not distracting
2. **Purposeful animations** - Every animation should serve UX (feedback, guidance, delight)
3. **Performance first** - Use CSS transforms/opacity, avoid layout thrashing
4. **Consistent timing** - 150-300ms for UI, 300-500ms for page transitions
5. **Dark/light mode aware** - Animations should work in both themes

## Key Engagement Patterns

### 1. Onboarding & First-Time User Experience
- Welcome toast with quick tips (auto-dismiss after 5s)
- Progressive disclosure - show features as user explores
- Empty states with clear CTAs ("Create your first post")
- Skeleton loaders for all async content

### 2. Micro-interactions That Delight
```tsx
// Button hover with subtle scale
className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"

// Card hover with lift and shadow
className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"

// Icon spin on click
className="transition-transform duration-300 active:rotate-12"
```

### 3. Content Loading Strategies
- **Skeleton screens** matching content shape (not generic bars)
- **Staggered fade-in** for lists (0ms, 50ms, 100ms delays)
- **Optimistic UI** - update immediately, rollback on error
- **Pull-to-refresh** on mobile for blog feed

### 4. Notification & Feedback System
```tsx
// Toast positions: top-right for success, top-center for errors
// Auto-dismiss: 3s for info, 5s for actions, persistent for errors
// Stack limit: 3 visible, queue the rest
```

### 5. Scroll-Triggered Animations
- Fade-in elements as they enter viewport (IntersectionObserver)
- Parallax for hero sections (subtle, 10-20px max)
- Progress indicator for long articles
- "Back to top" button appears after 50vh scroll

### 6. Daily Engagement Hooks
- **Streak counter** for daily visitors (show in profile dropdown)
- **"Quote of the Day"** card on homepage (cached, changes at midnight)
- **Reading progress** saved per user (resume where you left off)
- **New content notifications** - badge on blog tab when new posts published
- **Weekly digest** modal for inactive users (7+ days)

### 7. Social Proof & Community
- Live reaction counter animations (counter rolls up/down)
- "X people are reading this" for active posts
- Recent comments feed on homepage (last 3, with avatar)
- Author badges for admin posts

### 8. Gamification (Subtle)
- Profile completion progress bar
- "First post!" celebration confetti (admin only, once)
- Badge system: "Early Adopter", "Top Commenter", "Daily Visitor"
- Reading time milestones (5min, 30min, 1hr total)

## Animation Implementation Guide

### CSS Transitions (Preferred)
```css
/* In globals.css */
.transition-smooth { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
.transition-bounce { transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
.fade-in { animation: fadeIn 0.3s ease-out; }
.slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
```

### React Component Patterns
```tsx
// AnimatePresence for conditional rendering
<AnimatePresence>
  {showModal && <Modal initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />}
</AnimatePresence>

// useInView for scroll animations
const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
<div ref={ref} className={cn(inView && 'animate-fade-in')} />

// useSpring for physics-based animations
const props = useSpring({ opacity: 1, y: 0, from: { opacity: 0, y: 20 } });
```

### Performance Rules
- ✅ Use `transform` and `opacity` only for animations
- ✅ Use `will-change: transform` sparingly (remove after animation)
- ✅ Debounce scroll handlers (16ms minimum)
- ✅ Use `requestAnimationFrame` for complex animations
- ❌ Avoid animating `width`, `height`, `top`, `left`
- ❌ Avoid `!important` in animation styles
- ❌ Avoid animating more than 3 elements simultaneously

## File Structure for Animations
```
lib/
  animations.ts        # Animation configs, timing constants
  hooks/
    useInView.ts       # IntersectionObserver hook
    useScrollProgress.ts
    useStreak.ts       # Daily visitor tracking
components/
  ui/
    Toast.tsx          # Notification component
    Skeleton.tsx       # Loading skeletons
    Badge.tsx          # User badges
    ProgressBar.tsx
  animations/
    FadeIn.tsx         # Reusable fade-in wrapper
    Stagger.tsx        # Staggered children animation
    ParticleBackground.tsx (existing)
```

## Specific Improvements for Two Thumbs Up

### Homepage
- [ ] Add staggered fade-in for featured posts grid
- [ ] Particle background reacts to mouse (subtle repel effect)
- [ ] "Quote of the Day" card with flip animation on hover
- [ ] Scroll progress indicator at top of page

### Blog Feed
- [ ] Skeleton cards matching actual card dimensions
- [ ] Staggered load animation (50ms delay per card)
- [ ] Tag pills with subtle bounce on click
- [ ] Infinite scroll with smooth loading indicator

### Post/Page View
- [ ] Reading progress bar at top (sticky)
- [ ] Estimated read time with gentle pulse
- [ ] Reactions with scale animation on click
- [ ] Comments section with slide-in animation

### Admin Dashboard
- [ ] Stats cards with counting animation (0 → value)
- [ ] Chart animations (smooth draw on mount)
- [ ] Drag-and-drop for media library
- [ ] Success toast after post creation

### Auth Flow
- [ ] Modal fade-in with backdrop blur
- [ ] Form fields with focus underline animation
- [ ] Loading spinner on submit (not full page block)
- [ ] Success checkmark animation before redirect

### Profile
- [ ] Avatar upload with preview fade-in
- [ ] Streak badge with flame animation
- [ ] Reading stats with circular progress
- [ ] Edit mode with smooth form expansion

## Daily User Retention Metrics to Track

```ts
// Store in Zustand + persist to localStorage
interface EngagementState {
  lastVisit: string | null;
  visitStreak: number;
  totalReadTime: number; // minutes
  postsRead: string[]; // post IDs
  dailyGoal: number; // minutes per day
  notificationsSeen: string[]; // notification IDs
}
```

## Implementation Priority

### Phase 1: Foundation (Week 1)
1. Create animation utilities and hooks
2. Add skeleton loaders to all async components
3. Implement toast notification system
4. Add scroll-triggered fade-ins

### Phase 2: Engagement (Week 2)
1. Streak counter with localStorage + Supabase sync
2. Quote of the Day feature
3. Reading progress tracking
4. Reaction/comment animations

### Phase 3: Polish (Week 3)
1. Page transition animations
2. Admin dashboard stats animations
3. Profile enhancements
4. Performance optimization

## Testing Checklist
- [ ] Animations respect `prefers-reduced-motion`
- [ ] No jank on mobile (test on slow devices)
- [ ] Animations disabled in tests (mock framer-motion)
- [ ] Lighthouse performance score >90
- [ ] No layout shifts (CLS < 0.1)

## Dependencies to Install
```bash
npm install framer-motion @react-spring/web
npm install -D @types/framer-motion
```

## Example: Staggered List Animation
```tsx
import { motion } from "framer-motion";

export function StaggeredList({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.05 }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggeredItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {children}
    </motion.div>
  );
}
```

## Remember
- **Less is more** - One delightful animation per interaction
- **Consistency** - Use the same timing across the app
- **Accessibility** - Always provide a way to reduce motion
- **Performance** - 60fps or don't ship it