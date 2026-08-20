import { AnimatePresence, motion } from "motion/react";

export function HeroArtworkBackdrop({ source, enabled }: { source: string | null; enabled: boolean }) {
  return (
    <AnimatePresence initial={false} mode="wait">
      {enabled && source && (
        <motion.div
          key={source}
          initial={{ opacity: 0, scale: 1.018 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.01 }}
          transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <img src={source} alt="" className="hero-backdrop-bloom absolute object-cover" />
          <img src={source} alt="" className="hero-backdrop-image absolute object-cover" />
          <div className="hero-backdrop-light absolute inset-0" />
          <div className="hero-backdrop-scrim absolute inset-0" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
