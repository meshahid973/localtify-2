import { Download, Home, Library, Settings } from "lucide-react";
import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { useNavigationStore, type AppPage } from "../../features/navigation/navigation.store";

const items: Array<{ icon: LucideIcon; label: string; page: AppPage }> = [
  { icon: Home, label: "Home", page: "home" },
  { icon: Library, label: "Library", page: "library" },
  { icon: Download, label: "Downloads", page: "downloads" },
];

export function Sidebar() {
  const page = useNavigationStore((state) => state.page);
  const setPage = useNavigationStore((state) => state.setPage);

  return (
    <aside className="app-sidebar fixed bottom-[86px] left-0 top-8 z-30 flex flex-col border-r border-white/[0.06] bg-[#050505] px-3 py-4">
      <div className="sidebar-mode mb-5 rounded-xl bg-white/[0.035] p-1">
        <div className="rounded-lg bg-white/[0.07] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80">
          Local
        </div>
      </div>

      <nav className="space-y-1.5">
        {items.map((item) => (
          <SidebarButton
            key={item.page}
            {...item}
            active={item.page === page}
            onClick={() => setPage(item.page)}
          />
        ))}
      </nav>

      <div className="mt-auto border-t border-white/[0.06] pt-3">
        <button
          type="button"
          className="sidebar-item flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-[#777] transition-colors hover:bg-white/[0.045] hover:text-white"
        >
          <Settings className="size-[18px] shrink-0" strokeWidth={1.8} />
          <span className="sidebar-label text-[12px] font-medium">Settings</span>
        </button>
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
  page: AppPage;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.985 }}
      className={`sidebar-item relative flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left transition-colors ${
        active ? "bg-white/[0.09] text-white" : "text-[#777] hover:bg-white/[0.045] hover:text-white"
      }`}
    >
      {active && (
        <motion.span
          layoutId="sidebar-active"
          className="absolute -left-3 h-5 w-[2px] rounded-full bg-[#1ed760]"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      )}
      <Icon className="size-[18px] shrink-0" strokeWidth={active ? 2 : 1.8} />
      <span className="sidebar-label text-[12px] font-medium">{label}</span>
    </motion.button>
  );
}
