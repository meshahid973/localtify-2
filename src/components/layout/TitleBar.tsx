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
    <header
      data-tauri-drag-region
      className="fixed inset-x-0 top-0 z-50 flex h-[var(--titlebar-height)] select-none items-center border-b border-white/[0.04] bg-[#050505]"
    >
      <div data-tauri-drag-region className="flex min-w-0 flex-1 items-center px-3">
        <span className="accent-dot size-1.5 rounded-full bg-[var(--accent)]" />
      </div>

      <span
        data-tauri-drag-region
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-[8px] font-semibold uppercase tracking-[0.28em] text-white/24"
      >
        localtify
      </span>

      <div className="flex h-full">
        <WindowButton label="Minimize" onClick={() => void perform("minimize")}>
          <Minus className="size-3" />
        </WindowButton>
        <WindowButton label="Toggle maximize" onClick={() => void perform("maximize")}>
          <Square className="size-[10px]" />
        </WindowButton>
        <WindowButton label="Close" danger onClick={() => void perform("close")}>
          <X className="size-3" />
        </WindowButton>
      </div>
    </header>
  );
}

function WindowButton({
  children,
  label,
  danger = false,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`grid w-10 place-items-center text-white/24 transition-colors hover:text-white/72 ${
        danger ? "hover:bg-red-600/80" : "hover:bg-white/[0.05]"
      }`}
    >
      {children}
    </button>
  );
}
