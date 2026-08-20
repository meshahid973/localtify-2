import { motion } from "motion/react";
import { OUT_QUINT } from "./presets";

export function InteractionFlash({ opacity, duration }: { opacity: number; duration: number }) {
  if (opacity <= 0 || duration <= 0) return null;

  return (
    <motion.span
      aria-hidden
      className="interaction-flash pointer-events-none absolute inset-0 z-20 rounded-[inherit]"
      initial={{ opacity, scale: 0.94 }}
      animate={{ opacity: 0, scale: 1.045 }}
      transition={{ duration, ease: OUT_QUINT }}
    />
  );
}
