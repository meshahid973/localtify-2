import type { ReactNode } from "react";
import { motion } from "motion/react";
import type { PressableStrength } from "./motion.types";
import { useInteractionMotion } from "./useInteractionMotion";

export function HoverSurface({ children, className = "", strength = "subtle" }: { children: ReactNode; className?: string; strength?: PressableStrength }) {
  const interaction = useInteractionMotion(strength);
  return (
    <motion.div
      animate={interaction.controls}
      onHoverStart={interaction.hoverStart}
      onHoverEnd={interaction.hoverEnd}
      className={className}
    >
      {children}
    </motion.div>
  );
}
