export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const MOTION = {
  quick: { duration: 0.18, ease: EASE_OUT },
  enter: { duration: 0.3, ease: EASE_OUT },
  section: { duration: 0.36, ease: EASE_OUT },
  spring: { type: "spring", stiffness: 420, damping: 32 },
  softSpring: { type: "spring", stiffness: 170, damping: 22 },
} as const;
