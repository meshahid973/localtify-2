import { isTauri } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Minus, Square, X } from "lucide-react";

async function perform(action: "minimize" | "maximize" | "close") {
  if (!isTauri()) {
    return;
  }

  const window = getCurrentWindow();

  if (action === "minimize") {
    await window.minimize();
  } else if (action === "maximize") {
    await window.toggleMaximize();
  } else {
    await window.close();
  }
}

export function TitleBar() {
  return (
    <header
      data-tauri-drag-region
      className="fixed inset-x-0 top-0 z-50 flex h-8 select-none items-center border-b border-white/[0.04] bg-[#030506]/95"
    >
      <div data-tauri-drag-region className="flex min-w-0 flex-1 items-center gap-2 px-3">
        <span className="grid size-4 place-items-center rounded-full bg-mint-400/15 shadow-[0_0_16px_rgba(116,255,198,.35)]">
          <span className="size-1.5 rounded-full bg-mint-300" />
        </span>
        <span className="text-[10px] font-bold tracking-[-0.02em] text-white/70">localtify</span>
      </div>

      <div className="flex h-full">
        <button
          type="button"
          aria-label="Minimize"
          className="grid w-11 place-items-center text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white"
          onClick={() => void perform("minimize")}
        >
          <Minus className="size-3.5" />
        </button>
        <button
          type="button"
          aria-label="Toggle maximize"
          className="grid w-11 place-items-center text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white"
          onClick={() => void perform("maximize")}
        >
          <Square className="size-3" />
        </button>
        <button
          type="button"
          aria-label="Close"
          className="grid w-11 place-items-center text-white/45 transition-colors hover:bg-red-500/80 hover:text-white"
          onClick={() => void perform("close")}
        >
          <X className="size-3.5" />
        </button>
      </div>
    </header>
  );
}
