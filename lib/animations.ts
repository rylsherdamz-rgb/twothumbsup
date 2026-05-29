// Animation timing constants
export const TIMING = {
  fast: 150,
  normal: 250,
  slow: 400,
  slower: 600,
} as const;

// Easing curves
export const EASING = {
  ease: [0.4, 0, 0.2, 1],
  easeOut: [0.0, 0.0, 0.2, 1],
  easeIn: [0.4, 0.0, 1, 1],
  easeInOut: [0.4, 0.0, 0.2, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
} as const;

// Framer Motion variants
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: TIMING.normal / 1000 } },
};

export const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: TIMING.normal / 1000, ease: EASING.easeOut } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: TIMING.fast / 1000 } },
};

export const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

export const listItem = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: TIMING.normal / 1000 } },
};

// Page transition
export const pageTransition = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: TIMING.slow / 1000, ease: EASING.easeOut } },
  exit: { opacity: 0, y: -10, transition: { duration: TIMING.fast / 1000 } },
};

// Modal/Dialog
export const modal = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: TIMING.normal / 1000, ease: EASING.easeOut } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: TIMING.fast / 1000 } },
};

export const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: TIMING.normal / 1000 } },
  exit: { opacity: 0, transition: { duration: TIMING.fast / 1000 } },
};

// Button/Interactive
export const buttonPress = {
  scale: 1,
  tap: { scale: 0.95 },
  hover: { scale: 1.02, transition: { duration: TIMING.fast / 1000 } },
};

// Card hover
export const cardHover = {
  y: 0,
  hover: { y: -4, transition: { duration: TIMING.normal / 1000 } },
};

// Stats counter animation duration (ms)
export const COUNTER_DURATION = 1500;

// Stagger delay between list items (ms)
export const STAGGER_DELAY = 50;