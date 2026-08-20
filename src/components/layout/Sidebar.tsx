import { Download, Home, Library, Settings } from "lucide-react";
import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { useNavigationStore } from "../../features/navigation/navigation.store";

export function Sidebar() {
  const page = useNavigationStore((state) => state.page);
  const setPage = useNavigationStore((state) => state.setPage);

  return (
    <aside className="app-sidebar fixed bottom-[var(--player-height)] left-0 top-[var(--titlebar-height)] z-30 flex flex-col border-r border-white/[0.045] bg-[#040404] px-3 py-4">
      <nav className="space-y-1">
        <SidebarButton icon={Home} label="Home" active={page === "home"} onClick={() => setPage("home")} />
        <SidebarButton icon={Library} label="Library" active={page === "library"} onClick={() => setPage("library")} />
        <SidebarButton icon={Download} label="Downloads" active={page === "downloads"} onClick={() => setPage("downloads")} />
      </nav>

      <div className="mt-auto border-t border-white/[0.04] pt-3">
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
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
      className={`sidebar-item relative flex h-10 w-full items-center gap-3 overflow-hidden rounded-[10px] px-3 text-left ${
        active ? "text-white" : "text-white/36 hover:text-white/72"
      }`}
    >
      {active && (
        <motion.span
          layoutId="sidebar-active-bg"
          className="absolute inset-0 rounded-[10px] border border-white/[0.055] bg-white/[0.055]"
          transition={{ type: "spring", stiffness: 390, damping: 32 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-3">
        <span className="relative">
          <Icon className="size-[17px] shrink-0" strokeWidth={active ? 2 : 1.75} />
          {active && (
            <motion.span
              layoutId="sidebar-active-dot"
              className="accent-dot absolute -right-2 -top-1 size-1.5 rounded-full bg-[var(--accent)]"
            />
          )}
        </span>
        <span className="sidebar-label text-[11px] font-medium tracking-[-0.01em]">{label}</span>
      </span>
    </motion.button>
  );
}
