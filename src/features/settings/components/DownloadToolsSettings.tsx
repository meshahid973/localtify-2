import { Check, Download, Gauge, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";
import { Pressable } from "../../../ui/motion/Pressable";
import { useDownloadsStore } from "../../downloads/downloads.store";

export function DownloadToolsSettings() {
  const reduceMotion = useReducedMotion();
  const tools = useDownloadsStore((state) => state.tools);
  const installing = useDownloadsStore((state) => state.installing);
  const error = useDownloadsStore((state) => state.error);
  const hydrate = useDownloadsStore((state) => state.hydrate);
  const installTool = useDownloadsStore((state) => state.installTool);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      className="settings-surface themed-panel overflow-hidden rounded-[14px] border border-[var(--line)] bg-[var(--surface-1)]"
    >
      <div className="flex items-start gap-3 px-4 py-4 sm:px-5">
        <span className="grid size-8 shrink-0 place-items-center rounded-[9px] bg-white/[0.045] text-white/48">
          <Wrench className="size-3.5" />
        </span>
        <div>
          <h2 className="text-[12px] font-semibold tracking-[-0.02em] text-white/84">Download tools</h2>
          <p className="mt-1 text-[9px] leading-4 text-white/26">One-time setup for yt-dlp and MP3 conversion.</p>
        </div>
      </div>

      <div className="border-t border-[var(--line)] px-4 sm:px-5">
        <ToolRow
          name="yt-dlp"
          description={tools?.ytDlpManaged ? "Managed by Localtify" : tools?.ytDlp ? "Detected on this PC" : "Not installed"}
          path={tools?.ytDlpPath ?? null}
          ready={Boolean(tools?.ytDlp)}
          busy={installing === "yt-dlp"}
          icon={Download}
          buttonLabel={tools?.ytDlpManaged ? "Ready" : tools?.ytDlp ? "Manage locally" : "Set up"}
          onInstall={() => void installTool("yt-dlp")}
        />

        <ToolRow
          name="FFmpeg"
          description={tools?.ffmpeg ? "Ready for MP3 conversion" : "Required for conversion"}
          path={tools?.ffmpegPath ?? null}
          ready={Boolean(tools?.ffmpeg)}
          busy={installing === "ffmpeg"}
          icon={Gauge}
          buttonLabel={tools?.ffmpeg ? "Ready" : "Set up"}
          onInstall={() => void installTool("ffmpeg")}
        />
      </div>

      <div className="border-t border-[var(--line)] px-4 py-3 text-[8px] leading-4 text-white/20 sm:px-5">
        yt-dlp is stored in Localtify app data. FFmpeg setup uses Windows Package Manager when available.
      </div>

      {error && <div className="border-t border-red-400/10 bg-red-500/[0.05] px-4 py-3 text-[8px] text-red-200/80 sm:px-5">{error}</div>}
    </motion.section>
  );
}

function ToolRow({
  name,
  description,
  path,
  ready,
  busy,
  icon: Icon,
  buttonLabel,
  onInstall,
}: {
  name: string;
  description: string;
  path: string | null;
  ready: boolean;
  busy: boolean;
  icon: LucideIcon;
  buttonLabel: string;
  onInstall: () => void;
}) {
  return (
    <div className="grid gap-3 border-b border-[var(--line)] py-4 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div className="flex min-w-0 items-start gap-3">
        <span className={`grid size-8 shrink-0 place-items-center rounded-[8px] ${ready ? "bg-white/[0.055] text-white/70" : "bg-white/[0.03] text-white/24"}`}>
          {ready ? <Check className="size-3.5" /> : <Icon className="size-3.5" />}
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-white/72">{name}</p>
          <p className="mt-1 text-[8px] text-white/24">{description}</p>
          {path && <p className="mt-1.5 truncate font-mono text-[7px] text-white/14">{path}</p>}
        </div>
      </div>

      <Pressable
        strength="subtle"
        disabled={busy || (ready && buttonLabel === "Ready")}
        onClick={onInstall}
        className="themed-button rounded-full border border-[var(--line)] px-3 py-2 text-[8px] font-medium text-white/46 disabled:opacity-35"
      >
        <span className="relative z-10">{busy ? "Setting up…" : buttonLabel}</span>
      </Pressable>
    </div>
  );
}
