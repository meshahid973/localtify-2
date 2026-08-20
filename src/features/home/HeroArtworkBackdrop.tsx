import { AnimatePresence, motion } from "motion/react";

export function HeroArtworkBackdrop({ source, enabled }: { source: string | null; enabled: boolean }) {
  return (
    <AnimatePresence initial={false} mode="wait">
      {enabled && source && (
        <motion.div
          key={source}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <img src={source} alt="" className="hero-backdrop-image absolute inset-0 size-full object-cover" />
          <div className="hero-backdrop-scrim absolute inset-0" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
