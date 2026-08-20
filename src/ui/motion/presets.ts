import type { BounceIntensity, MotionStyle, PressableStrength } from "./motion.types";

export const OUT_QUINT = [0.22, 1, 0.36, 1] as const;
export const OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export const MOTION = {
  quick: { duration: 0.2, ease: OUT_QUINT },
  enter: { duration: 0.34, ease: OUT_QUINT },
  section: { duration: 0.4, ease: OUT_QUINT },
  spring: { type: "spring", stiffness: 380, damping: 30 },
  softSpring: { type: "spring", stiffness: 145, damping: 20, mass: 0.9 },
} as const;

const strengthScale = {
  subtle: 0.55,
  medium: 1,
  strong: 1.35,
} satisfies Record<PressableStrength, number>;

const bounceScale = {
  subtle: 0.72,
  balanced: 1,
  playful: 1.23,
} satisfies Record<BounceIntensity, number>;

export function interactionProfile(style: MotionStyle, bounce: BounceIntensity, strength: PressableStrength) {
  if (style === "off") {
    return {
      hoverScale: 1,
      hoverY: 0,
      pressStart: 1,
      pressDeep: 1,
      hoverDuration: 0,
      pressDuration: 0,
      holdDelay: 0,
      release: { duration: 0 },
      flashOpacity: 0,
      flashDuration: 0,
    } as const;
  }

  const strengthFactor = strengthScale[strength];
  const bounceFactor = bounceScale[bounce];
  const styleFactor = style === "osu" ? 1.18 : style === "calm" ? 0.56 : 1;
  const amount = strengthFactor * bounceFactor * styleFactor;

  const hoverScale = 1 + 0.014 * amount;
  const hoverY = -1.5 * amount;
  const pressStart = 1 - 0.02 * amount;
  const pressDeep = Math.max(0.88, 1 - 0.048 * amount);

  const release = style === "osu"
    ? { type: "spring", stiffness: 320 + 35 * bounceFactor, damping: 14 + (bounce === "subtle" ? 5 : 0), mass: 0.68 }
    : style === "calm"
      ? { type: "spring", stiffness: 360, damping: 34, mass: 0.72 }
      : { type: "spring", stiffness: 380, damping: 24, mass: 0.72 };

  return {
    hoverScale,
    hoverY,
    pressStart,
    pressDeep,
    hoverDuration: style === "calm" ? 0.16 : 0.24,
    pressDuration: style === "osu" ? 0.18 : 0.13,
    holdDelay: style === "osu" ? 90 : 120,
    release,
    flashOpacity: style === "calm" ? 0.07 : style === "osu" ? 0.18 : 0.12,
    flashDuration: style === "osu" ? 0.52 : 0.38,
  } as const;
}
