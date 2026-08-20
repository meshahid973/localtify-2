import { Download, Home, Library, Search, Settings } from "lucide-react";
import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

const items = [
  { icon: Home, label: "Home", active: true },
  { icon: Search, label: "Search" },
  { icon: Library, label: "Library" },
  { icon: Download, label: "Downloads" },
];

export function Sidebar() {
  return (
    <aside className="fixed bottom-[88px] left-0 top-8 z-30 flex w-16 flex-col border-r border-[#151515] bg-black px-2 py-3">
      <div className="space-y-1">
        {items.map((item) => <SidebarButton key={item.label} {...item} />)}
      </div>
      <div className="mt-auto">
        <SidebarButton icon={Settings} label="Settings" />
      </div>
    </aside>
  );
}

function SidebarButton({ icon: Icon, label, active = false }: { icon: LucideIcon; label: string; active?: boolean }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      title={label}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
      className={`grid size-11 place-items-center rounded-md transition-colors ${
        active ? "bg-[#181818] text-white" : "text-[#8a8a8a] hover:bg-[#111] hover:text-white"
      }`}
    >
      <Icon className="size-[18px]" strokeWidth={1.8} />
    </motion.button>
  );
}
