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
      className="fixed inset-x-0 top-0 z-50 flex h-[var(--titlebar-height)] select-none items-center border-b border-[var(--line)] bg-[var(--app-bg)] transition-colors duration-300"
    >
      <div data-tauri-drag-region className="flex min-w-0 flex-1 items-center px-4">
        <span className="pointer-events-none text-[9px] font-semibold tracking-[-0.015em] text-white/32">localtify</span>
      </div>

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
      className={`grid w-10 place-items-center text-white/22 transition-colors hover:text-white/70 ${
        danger ? "hover:bg-red-600/80" : "hover:bg-white/[0.045]"
      }`}
    >
      {children}
    </button>
  );
}
