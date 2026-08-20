import { isTauri } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { Check, Download, Folder, LoaderCircle, Settings, TriangleAlert } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigationStore } from "../navigation/navigation.store";
import { useDownloadsStore } from "./downloads.store";

export function DownloadsPage() {
  const reduceMotion = useReducedMotion();
  const jobs = useDownloadsStore((state) => state.jobs);
  const tools = useDownloadsStore((state) => state.tools);
  const loading = useDownloadsStore((state) => state.loading);
  const error = useDownloadsStore((state) => state.error);
  const hydrate = useDownloadsStore((state) => state.hydrate);
  const refresh = useDownloadsStore((state) => state.refresh);
  const start = useDownloadsStore((state) => state.start);
  const setPage = useNavigationStore((state) => state.setPage);
  const [source, setSource] = useState("");
  const [outputDir, setOutputDir] = useState("");

  useEffect(() => {
    void hydrate();
    const timer = window.setInterval(() => void refresh(), 1400);
    return () => window.clearInterval(timer);
  }, [hydrate, refresh]);

  async function chooseOutput() {
    if (!isTauri()) return;
    const selected = await open({ directory: true, multiple: false, title: "Choose download folder" });
    if (typeof selected === "string") setOutputDir(selected);
  }

  async function submit() {
    if (!source.trim() || !outputDir) return;
    const ok = await start(source.trim(), outputDir);
    if (ok) setSource("");
  }

  const ready = Boolean(tools?.ytDlp && tools?.ffmpeg);

  return (
    <main className="mx-auto w-full max-w-[1120px] px-7 pb-16 pt-7 lg:px-10">
      <motion.header
        initial={reduceMotion ? false : { opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-[10px] font-medium text-white/26">Local tools</p>
        <h1 className="mt-1 text-[32px] font-semibold tracking-[-0.055em]">Downloads</h1>
        <p className="mt-2 max-w-xl text-[10px] leading-5 text-white/26">
          Convert audio you have permission to save. Processing stays on this device.
        </p>
      </motion.header>

      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.34, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
        className="mt-7 rounded-[16px] border border-white/[0.05] bg-[#080808] p-5"
      >
        <div className="flex flex-wrap items-center gap-2 text-[9px]">
          <ToolBadge label="yt-dlp" ready={Boolean(tools?.ytDlp)} />
          <ToolBadge label="FFmpeg" ready={Boolean(tools?.ffmpeg)} />
          {!ready && (
            <button
              type="button"
              onClick={() => setPage("settings")}
              className="ml-auto flex items-center gap-2 rounded-full border border-white/[0.07] px-3 py-2 text-white/35 transition-colors hover:bg-white/[0.045] hover:text-white/70"
            >
              <Settings className="size-3" />
              Set up tools
            </button>
          )}
          {ready && <span className="ml-auto text-[var(--accent)]">Ready</span>}
        </div>

        <div className="mt-5 grid gap-3">
          <label>
            <span className="mb-2 block text-[9px] text-white/28">Media URL</span>
            <input
              value={source}
              onChange={(event) => setSource(event.currentTarget.value)}
              placeholder="https://..."
              className="h-10 w-full rounded-[10px] border border-white/[0.055] bg-black px-3.5 text-[10px] text-white/78 outline-none transition-colors placeholder:text-white/16 focus:border-white/[0.13]"
            />
          </label>

          <div>
            <span className="mb-2 block text-[9px] text-white/28">Output folder</span>
            <button
              type="button"
              onClick={() => void chooseOutput()}
              className="flex h-10 w-full items-center gap-3 rounded-[10px] border border-white/[0.055] bg-black px-3.5 text-left text-[9px] text-white/28 transition-colors hover:border-white/[0.11] hover:text-white/55"
            >
              <Folder className="size-3.5 shrink-0" />
              <span className="truncate">{outputDir || "Choose a folder"}</span>
            </button>
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.99 }}
            disabled={!ready || loading || !source.trim() || !outputDir}
            onClick={() => void submit()}
            className="mt-1 flex h-10 items-center justify-center gap-2 rounded-[10px] bg-[var(--accent)] text-[9px] font-bold text-black disabled:opacity-25"
          >
            <Download className="size-3.5" />
            Convert to MP3
          </motion.button>
        </div>

        {error && <p className="mt-3 text-[9px] text-red-300/80">{error}</p>}
      </motion.section>

      <section className="performance-section mt-9">
        <div className="mb-4 flex items-end gap-3">
          <h2 className="text-[22px] font-semibold tracking-[-0.045em]">Queue</h2>
          <span className="pb-0.5 text-[8px] text-white/20">{jobs.length} jobs</span>
        </div>

        <div className="space-y-2">
          {jobs.length ? jobs.map((job) => <DownloadRow key={job.id} job={job} />) : (
            <div className="rounded-[12px] border border-dashed border-white/[0.065] py-12 text-center text-[9px] text-white/20">
              No downloads yet
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function ToolBadge({ label, ready }: { label: string; ready: boolean }) {
  return (
    <span className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 ${
      ready ? "border-white/[0.065] bg-white/[0.035] text-[var(--accent)]" : "border-white/[0.055] text-white/25"
    }`}>
      {ready ? <Check className="size-3" /> : <TriangleAlert className="size-3" />}
      {label}
    </span>
  );
}

function DownloadRow({ job }: { job: import("../../lib/contracts/domain").DownloadJob }) {
  const running = job.status === "queued" || job.status === "downloading";
  return (
    <div className="flex items-center gap-3 rounded-[11px] border border-white/[0.045] bg-[#080808] px-4 py-3">
      <span className={`grid size-8 place-items-center rounded-full ${
        running
          ? "bg-white/[0.045] text-white/45"
          : job.status === "completed"
            ? "bg-white/[0.045] text-[var(--accent)]"
            : "bg-red-500/[0.07] text-red-300/80"
      }`}>
        {running ? <LoaderCircle className="size-4 animate-spin" /> : job.status === "completed" ? <Check className="size-4" /> : <TriangleAlert className="size-4" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[9px] font-medium text-white/72">{job.source}</p>
        <p className="mt-1 truncate text-[8px] text-white/20">{job.outputDir}</p>
        {job.error && <p className="mt-1 truncate text-[8px] text-red-300/75">{job.error}</p>}
      </div>
      <span className="text-[8px] font-semibold uppercase tracking-[0.08em] text-white/22">{job.status}</span>
    </div>
  );
}
