import {
  BarChart3,
  Download,
  Heart,
  Home,
  Library,
  ListMusic,
  Settings,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

const libraryItems = [
  { icon: Home, label: "Home", active: true },
  { icon: Library, label: "Library" },
  { icon: Heart, label: "Liked" },
  { icon: Sparkles, label: "Discover" },
  { icon: ListMusic, label: "Playlists" },
];

const toolItems = [
  { icon: Download, label: "Downloads" },
  { icon: BarChart3, label: "Stats" },
];

export function Sidebar() {
  return (
    <aside className="fixed bottom-24 left-0 top-8 z-30 flex w-14 flex-col border-r border-white/[0.05] bg-[#05070b]/92 px-2 py-3 backdrop-blur-xl">
      <SidebarGroup label="Library" items={libraryItems} />
      <SidebarGroup label="Tools" items={toolItems} className="mt-6" />
      <div className="mt-auto border-t border-white/[0.05] pt-3">
        <SidebarButton icon={Settings} label="Settings" />
      </div>
    </aside>
  );
}

function SidebarGroup({
  label,
  items,
  className = "",
}: {
  label: string;
  items: Array<{ icon: LucideIcon; label: string; active?: boolean }>;
  className?: string;
}) {
  return (
    <section className={className}>
      <p className="mb-2 px-1 text-[6px] font-bold uppercase tracking-[0.22em] text-white/38">
        {label}
      </p>
      <div className="space-y-1">
        {items.map((item) => (
          <SidebarButton key={item.label} {...item} />
        ))}
      </div>
    </section>
  );
}

function SidebarButton({
  icon: Icon,
  label,
  active = false,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      title={label}
      whileHover={{ scale: 1.08, x: 1 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 460, damping: 28 }}
      className={`group relative grid size-9 place-items-center rounded-xl border transition-colors ${
        active
          ? "border-mint-300/20 bg-mint-300/[0.09] text-mint-200"
          : "border-transparent text-white/45 hover:bg-white/[0.05] hover:text-white/85"
      }`}
    >
      {active && (
        <motion.span
          layoutId="sidebar-active"
          className="absolute -left-2 h-4 w-0.5 rounded-full bg-mint-300 shadow-[0_0_12px_rgba(120,255,204,.8)]"
        />
      )}
      <Icon className="size-4" strokeWidth={1.8} />
    </motion.button>
  );
}
