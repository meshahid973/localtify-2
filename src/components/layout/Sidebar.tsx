import { Download, Home, Library, Search, Settings } from "lucide-react";
import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { useNavigationStore } from "../../features/navigation/navigation.store";

export function Sidebar() {
  const page = useNavigationStore((state) => state.page);
  const setPage = useNavigationStore((state) => state.setPage);

  function openSearch() {
    setPage("library");
    window.setTimeout(() => {
      document.querySelector<HTMLInputElement>("[data-library-search]")?.focus();
    }, 90);
  }

  return (
    <aside className="app-sidebar fixed bottom-[var(--player-height)] left-0 top-[var(--titlebar-height)] z-30 flex flex-col border-r border-white/[0.055] bg-[#070707] px-3 py-3.5">
      <div className="sidebar-mode mb-4 grid grid-cols-2 rounded-[10px] border border-white/[0.055] bg-[#0c0c0c] p-1 font-mono text-[9px] font-semibold uppercase tracking-[0.08em]">
        <span className="rounded-[7px] bg-[#1a1a19] px-2 py-2 text-center text-[#f0edd9]">Local</span>
        <button
          type="button"
          disabled
          title="Server mode is not enabled yet"
          className="rounded-[7px] px-2 py-2 text-white/20"
        >
          Server
        </button>
      </div>

      <nav className="space-y-1">
        <SidebarButton icon={Home} label="Home" active={page === "home"} onClick={() => setPage("home")} />
        <SidebarButton icon={Search} label="Search" active={false} onClick={openSearch} />
        <SidebarButton icon={Library} label="Library" active={page === "library"} onClick={() => setPage("library")} />

        <div className="sidebar-label my-3 h-px bg-white/[0.045]" />

        <SidebarButton icon={Download} label="Downloads" active={page === "downloads"} onClick={() => setPage("downloads")} />
      </nav>

      <div className="mt-auto border-t border-white/[0.05] pt-3">
        <button
          type="button"
          className="sidebar-item flex h-10 w-full items-center gap-3 rounded-[9px] px-3 text-left text-white/32 transition-colors hover:bg-white/[0.04] hover:text-white/70"
        >
          <Settings className="size-[17px] shrink-0" strokeWidth={1.8} />
          <span className="sidebar-label font-mono text-[11px]">Settings</span>
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
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ x: 1 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 460, damping: 34 }}
      className={`sidebar-item relative flex h-10 w-full items-center gap-3 rounded-[9px] px-3 text-left transition-colors ${
        active ? "bg-[#1a1a19] text-[#f3f0dd]" : "text-white/34 hover:bg-white/[0.04] hover:text-white/70"
      }`}
    >
      {active && (
        <motion.span
          layoutId="sidebar-active"
          className="absolute -left-3 h-5 w-[2px] rounded-full bg-[#f3f0dd]"
          transition={{ type: "spring", stiffness: 430, damping: 34 }}
        />
      )}
      <Icon className="size-[17px] shrink-0" strokeWidth={active ? 2 : 1.75} />
      <span className="sidebar-label font-mono text-[11px]">{label}</span>
    </motion.button>
  );
}
