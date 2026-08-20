import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { MOTION } from "../../lib/motion";

const PAGE_WIDTHS = {
  wide: "max-w-[1320px]",
  medium: "max-w-[1120px]",
  narrow: "max-w-[980px]",
} as const;

type PageWidth = keyof typeof PAGE_WIDTHS;

export function PageFrame({ children, width = "wide" }: { children: ReactNode; width?: PageWidth }) {
  return (
    <main className={`page-frame mx-auto w-full ${PAGE_WIDTHS[width]}`}>
      {children}
    </main>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: string;
  actions?: ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      initial={reduceMotion ? false : { opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={MOTION.enter}
      className="flex flex-wrap items-end gap-x-4 gap-y-3"
    >
      <div className="min-w-0">
        {eyebrow && <p className="text-[9px] font-medium text-white/25">{eyebrow}</p>}
        <div className="mt-1 flex flex-wrap items-end gap-3">
          <h1 className="text-[clamp(25px,2.25vw,32px)] font-semibold tracking-[-0.055em] text-white">{title}</h1>
          {meta && <span className="mb-1 text-[8px] text-white/18">{meta}</span>}
        </div>
        {description && <p className="mt-2 max-w-2xl text-[10px] leading-5 text-white/28">{description}</p>}
      </div>
      {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
    </motion.header>
  );
}

export function SectionHeading({ title, meta, action }: { title: string; meta?: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex min-h-8 items-end gap-3">
      <h2 className="text-[clamp(18px,1.7vw,21px)] font-semibold tracking-[-0.045em] text-white">{title}</h2>
      {meta && <span className="pb-0.5 text-[8px] text-white/18">{meta}</span>}
      {action && <div className="ml-auto">{action}</div>}
    </div>
  );
}
