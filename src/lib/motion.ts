export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const MOTION = {
  quick: { duration: 0.2, ease: EASE_OUT },
  enter: { duration: 0.34, ease: EASE_OUT },
  section: { duration: 0.4, ease: EASE_OUT },
  spring: { type: "spring", stiffness: 380, damping: 30 },
  softSpring: { type: "spring", stiffness: 145, damping: 20, mass: 0.9 },
} as const;
