import { Download, Home, Library, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { type AppPage, useNavigationStore } from "../../features/navigation/navigation.store";
import { MOTION } from "../../lib/motion";
import { AnimatedIcon } from "../../ui/motion/AnimatedIcon";
import { Pressable } from "../../ui/motion/Pressable";

const PRIMARY_ITEMS: Array<{ page: AppPage; label: string; icon: LucideIcon }> = [
  { page: "home", label: "Home", icon: Home },
  { page: "library", label: "Library", icon: Library },
  { page: "downloads", label: "Downloads", icon: Download },
];

export function Sidebar() {
  const page = useNavigationStore((state) => state.page);
  const setPage = useNavigationStore((state) => state.setPage);

  return (
    <aside className="app-sidebar themed-sidebar fixed bottom-[var(--player-height)] left-0 top-[var(--titlebar-height)] z-30 flex flex-col border-r border-[var(--line)] bg-[var(--ui-sidebar-bg)] px-3 py-4 transition-[width,background-color] duration-300">
      <nav className="space-y-1">
        {PRIMARY_ITEMS.map((item) => (
          <SidebarButton
            key={item.page}
            icon={item.icon}
            label={item.label}
            active={page === item.page}
            onClick={() => setPage(item.page)}
          />
        ))}
      </nav>

      <div className="mt-auto border-t border-[var(--line)] pt-3">
        <SidebarButton icon={Settings} label="Settings" active={page === "settings"} onClick={() => setPage("settings")} />
      </div>
    </aside>
  );
}

function SidebarButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Pressable
      onClick={onClick}
      strength="subtle"
      flash={false}
      className={`sidebar-item relative flex h-10 w-full items-center gap-3 rounded-[10px] px-3 text-left transition-colors ${
        active ? "text-white" : "text-white/40 hover:text-white/78"
      }`}
    >
      {active && (
        <motion.span
          layoutId="sidebar-active"
          className="absolute inset-0 z-0 rounded-[10px] border border-white/[0.08] bg-white/[0.055]"
          transition={MOTION.spring}
        />
      )}
      <span className="relative z-10 flex items-center gap-3">
        <AnimatedIcon active={active}>
          <Icon className="size-[17px] shrink-0" strokeWidth={active ? 2 : 1.75} />
        </AnimatedIcon>
        <span className="sidebar-label text-[11px] font-medium tracking-[-0.01em]">{label}</span>
      </span>
    </Pressable>
  );
}
