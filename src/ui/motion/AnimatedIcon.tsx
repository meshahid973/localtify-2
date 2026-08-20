import type { ReactNode } from "react";
import { motion } from "motion/react";
import { useSettingsStore } from "../../features/settings/settings.store";

export function AnimatedIcon({ children, active = false }: { children: ReactNode; active?: boolean }) {
  const motionStyle = useSettingsStore((state) => state.motion);
  const animate = active && motionStyle !== "off" && motionStyle !== "calm";
  return (
    <motion.span
      className="inline-flex"
      animate={animate ? { scale: [1, 0.92, 1], rotate: [0, -2, 0] } : { scale: 1, rotate: 0 }}
      transition={{ duration: motionStyle === "osu" ? 0.5 : 0.36, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  );
}
