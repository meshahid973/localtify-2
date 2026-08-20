import { Check, Download, Gauge, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";
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
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-[16px] border border-[var(--line)] bg-[var(--surface-1)] p-5"
    >
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-[9px] bg-white/[0.04] text-white/50">
          <Wrench className="size-4" />
        </span>
        <div>
          <h2 className="text-[17px] font-semibold tracking-[-0.03em]">Download tools</h2>
          <p className="mt-1 text-[10px] leading-4 text-white/27">One-time setup for audio downloads and MP3 conversion.</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
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

      <p className="mt-5 rounded-[10px] border border-[var(--line)] bg-black px-4 py-3 text-[9px] leading-5 text-white/25">
        yt-dlp is stored inside Localtify's app-data folder. On Windows, FFmpeg setup uses Windows Package Manager.
      </p>

      {error && (
        <div className="mt-3 rounded-[10px] border border-red-400/15 bg-red-500/[0.06] px-3 py-2 text-[9px] text-red-200/80">
          {error}
        </div>
      )}
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
    <div className="rounded-[11px] border border-[var(--line)] bg-black p-4">
      <div className="flex items-center gap-3">
        <span className={`grid size-8 place-items-center rounded-[8px] ${ready ? "bg-white/[0.055] text-white/70" : "bg-white/[0.035] text-white/25"}`}>
          {ready ? <Check className="size-4" /> : <Icon className="size-4" />}
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-white/76">{name}</p>
          <p className="mt-0.5 text-[9px] text-white/25">{description}</p>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          disabled={busy || (ready && buttonLabel === "Ready")}
          onClick={onInstall}
          className="ml-auto rounded-full border border-[var(--line)] px-3 py-2 text-[9px] text-white/44 transition-colors hover:bg-white/[0.035] hover:text-white/72 disabled:opacity-35"
        >
          {busy ? "Setting up…" : buttonLabel}
        </motion.button>
      </div>
      {path && <p className="mt-3 truncate text-[8px] text-white/15">{path}</p>}
    </div>
  );
}
