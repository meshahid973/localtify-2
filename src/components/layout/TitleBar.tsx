import { isTauri } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Minus, Square, X } from "lucide-react";

async function perform(action: "minimize" | "maximize" | "close") {
  if (!isTauri()) return;
  const window = getCurrentWindow();
  if (action === "minimize") await window.minimize();
  else if (action === "maximize") await window.toggleMaximize();
  else await window.close();
}

export function TitleBar() {
  return (
    <header data-tauri-drag-region className="fixed inset-x-0 top-0 z-50 flex h-8 select-none items-center border-b border-[#111] bg-black">
      <div data-tauri-drag-region className="flex min-w-0 flex-1 items-center gap-2 px-3">
        <span className="size-2 rounded-full bg-[#1ed760]" />
        <span className="text-[10px] font-semibold tracking-[-0.02em] text-white/70">localtify</span>
      </div>
      <div className="flex h-full">
        <WindowButton label="Minimize" onClick={() => void perform("minimize")}><Minus className="size-3.5" /></WindowButton>
        <WindowButton label="Toggle maximize" onClick={() => void perform("maximize")}><Square className="size-3" /></WindowButton>
        <WindowButton label="Close" danger onClick={() => void perform("close")}><X className="size-3.5" /></WindowButton>
      </div>
    </header>
  );
}

function WindowButton({ children, label, danger = false, onClick }: { children: React.ReactNode; label: string; danger?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`grid w-11 place-items-center text-white/45 transition-colors hover:text-white ${danger ? "hover:bg-red-600" : "hover:bg-[#181818]"}`}
    >
      {children}
    </button>
  );
}
