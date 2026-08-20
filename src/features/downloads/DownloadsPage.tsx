import { isTauri } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { Check, Download, Folder, LoaderCircle, Settings, TriangleAlert } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { PageFrame, PageHeader, SectionHeading } from "../../components/ui/Page";
import { Pressable } from "../../ui/motion/Pressable";
import { useNavigationStore } from "../navigation/navigation.store";
import { useDownloadsStore } from "./downloads.store";

export function DownloadsPage() {
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
    <PageFrame width="narrow">
      <PageHeader
        eyebrow="Local tools"
        title="Downloads"
        description="Convert audio you have permission to save. Processing stays on this device."
      />

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
        className="themed-panel mt-7 rounded-[15px] border border-[var(--line)] bg-[var(--surface-1)] p-5"
      >
        <div className="flex flex-wrap items-center gap-2 text-[9px]">
          <ToolBadge label="yt-dlp" ready={Boolean(tools?.ytDlp)} />
          <ToolBadge label="FFmpeg" ready={Boolean(tools?.ffmpeg)} />
          {!ready ? (
            <Pressable
              strength="subtle"
              onClick={() => setPage("settings")}
              className="themed-button ml-auto flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-2 text-white/38"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Settings className="size-3" />
                Set up tools
              </span>
            </Pressable>
          ) : (
            <span className="ml-auto text-[9px] text-white/38">Ready</span>
          )}
        </div>

        <div className="mt-5 grid gap-3">
          <label>
            <span className="mb-2 block text-[9px] text-white/30">Media URL</span>
            <input
              value={source}
              onChange={(event) => setSource(event.currentTarget.value)}
              placeholder="https://..."
              className="themed-card h-10 w-full rounded-[10px] border border-[var(--line)] bg-black/55 px-3.5 text-[10px] text-white/80 outline-none transition-colors placeholder:text-white/18 focus:border-white/[0.16]"
            />
          </label>

          <div>
            <span className="mb-2 block text-[9px] text-white/30">Output folder</span>
            <Pressable
              strength="subtle"
              onClick={() => void chooseOutput()}
              className="themed-card flex h-10 w-full items-center gap-3 rounded-[10px] border border-[var(--line)] bg-black/45 px-3.5 text-left text-[9px] text-white/32"
            >
              <span className="relative z-10 flex min-w-0 items-center gap-3">
                <Folder className="size-3.5 shrink-0" />
                <span className="truncate">{outputDir || "Choose a folder"}</span>
              </span>
            </Pressable>
          </div>

          <Pressable
            strength="strong"
            disabled={!ready || loading || !source.trim() || !outputDir}
            onClick={() => void submit()}
            className="themed-button mt-1 flex h-10 items-center justify-center gap-2 rounded-[10px] bg-white text-[9px] font-bold text-black disabled:opacity-20"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Download className="size-3.5" />
              Convert to MP3
            </span>
          </Pressable>
        </div>

        {error && <p className="mt-3 text-[9px] text-red-300/80">{error}</p>}
      </motion.section>

      <section className="performance-section mt-9">
        <SectionHeading title="Queue" meta={`${jobs.length} jobs`} />
        <div className="space-y-2">
          {jobs.length ? (
            jobs.map((job) => <DownloadRow key={job.id} job={job} />)
          ) : (
            <div className="themed-card rounded-[11px] border border-dashed border-white/[0.07] py-12 text-center text-[9px] text-white/22">
              No downloads yet
            </div>
          )}
        </div>
      </section>
    </PageFrame>
  );
}

function ToolBadge({ label, ready }: { label: string; ready: boolean }) {
  return (
    <span className={`flex items-center gap-1.5 rounded-[8px] border px-2.5 py-1.5 ${
      ready ? "border-white/[0.08] bg-white/[0.04] text-white/62" : "border-white/[0.06] text-white/26"
    }`}>
      {ready ? <Check className="size-3" /> : <TriangleAlert className="size-3" />}
      {label}
    </span>
  );
}

function DownloadRow({ job }: { job: import("../../lib/contracts/domain").DownloadJob }) {
  const running = job.status === "queued" || job.status === "downloading";
  return (
    <div className="themed-card flex items-center gap-3 rounded-[11px] border border-[var(--line)] bg-[var(--surface-1)] px-4 py-3">
      <span className={`grid size-8 place-items-center rounded-[8px] ${
        running
          ? "bg-white/[0.05] text-white/45"
          : job.status === "completed"
            ? "bg-white/[0.05] text-white/68"
            : "bg-red-500/[0.08] text-red-300/80"
      }`}>
        {running ? <LoaderCircle className="size-4 animate-spin" /> : job.status === "completed" ? <Check className="size-4" /> : <TriangleAlert className="size-4" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[9px] font-medium text-white/74">{job.source}</p>
        <p className="mt-1 truncate text-[8px] text-white/22">{job.outputDir}</p>
        {job.error && <p className="mt-1 truncate text-[8px] text-red-300/75">{job.error}</p>}
      </div>
      <span className="text-[8px] font-semibold uppercase tracking-[0.08em] text-white/22">{job.status}</span>
    </div>
  );
}
