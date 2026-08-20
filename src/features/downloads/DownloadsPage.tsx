import { isTauri } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { Check, Download, Folder, LoaderCircle, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { useDownloadsStore } from "./downloads.store";

export function DownloadsPage() {
  const jobs = useDownloadsStore((state) => state.jobs);
  const tools = useDownloadsStore((state) => state.tools);
  const loading = useDownloadsStore((state) => state.loading);
  const error = useDownloadsStore((state) => state.error);
  const hydrate = useDownloadsStore((state) => state.hydrate);
  const refresh = useDownloadsStore((state) => state.refresh);
  const start = useDownloadsStore((state) => state.start);
  const [source, setSource] = useState("");
  const [outputDir, setOutputDir] = useState("");

  useEffect(() => {
    void hydrate();
    const timer = window.setInterval(() => void refresh(), 1200);
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
    <main className="mx-auto w-full max-w-[1220px] px-7 pb-14 pt-6 lg:px-10">
      <header>
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/22">Power tools</p>
        <h1 className="mt-1 font-mono text-[30px] font-semibold tracking-[-0.055em] text-[#f3f0dd]">Downloads</h1>
        <p className="mt-2 max-w-2xl font-mono text-[9px] leading-5 text-white/25">
          Save audio from media you have permission to download. Processing stays on this device.
        </p>
      </header>

      <section className="mt-6 rounded-[12px] border border-white/[0.05] bg-[#0b0b0b] p-5">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[8px]">
          <ToolBadge label="yt-dlp" ready={Boolean(tools?.ytDlp)} />
          <ToolBadge label="ffmpeg" ready={Boolean(tools?.ffmpeg)} />
          <span className="ml-auto text-white/20">{ready ? "ready" : "install tools and restart Localtify"}</span>
        </div>

        <div className="mt-5 grid gap-3">
          <label>
            <span className="mb-2 block font-mono text-[9px] text-white/30">Media URL</span>
            <input
              value={source}
              onChange={(event) => setSource(event.currentTarget.value)}
              placeholder="https://..."
              className="h-10 w-full rounded-[9px] border border-white/[0.055] bg-black px-3.5 font-mono text-[10px] text-[#dedac8] outline-none transition-colors placeholder:text-white/15 focus:border-white/[0.13]"
            />
          </label>

          <div>
            <span className="mb-2 block font-mono text-[9px] text-white/30">Output folder</span>
            <button
              type="button"
              onClick={() => void chooseOutput()}
              className="flex h-10 w-full items-center gap-3 rounded-[9px] border border-white/[0.055] bg-black px-3.5 text-left font-mono text-[9px] text-white/28 transition-colors hover:border-white/[0.11] hover:text-white/55"
            >
              <Folder className="size-3.5 shrink-0" />
              <span className="truncate">{outputDir || "Choose a folder"}</span>
            </button>
          </div>

          <button
            type="button"
            disabled={!ready || loading || !source.trim() || !outputDir}
            onClick={() => void submit()}
            className="mt-1 flex h-10 items-center justify-center gap-2 rounded-[9px] bg-[#f3f0dd] font-mono text-[9px] font-bold text-[#151515] transition-transform active:scale-[.99] disabled:opacity-25"
          >
            <Download className="size-3.5" />
            Convert to MP3
          </button>
        </div>

        {error && <p className="mt-3 font-mono text-[9px] text-red-300/80">{error}</p>}
      </section>

      <section className="performance-section mt-8">
        <div className="mb-4 flex items-end gap-3">
          <h2 className="font-mono text-[24px] font-semibold tracking-[-0.045em] text-[#f3f0dd]">Queue</h2>
          <span className="pb-1 font-mono text-[8px] uppercase tracking-[0.08em] text-white/20">{jobs.length} jobs</span>
        </div>

        <div className="space-y-2">
          {jobs.length ? jobs.map((job) => <DownloadRow key={job.id} job={job} />) : (
            <div className="rounded-[11px] border border-dashed border-white/[0.07] py-12 text-center font-mono text-[9px] text-white/20">
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
      ready ? "border-[#1ed760]/18 bg-[#1ed760]/[0.055] text-[#82da9e]" : "border-white/[0.055] text-white/25"
    }`}>
      {ready ? <Check className="size-3" /> : <TriangleAlert className="size-3" />}
      {label}
    </span>
  );
}

function DownloadRow({ job }: { job: import("../../lib/contracts/domain").DownloadJob }) {
  const running = job.status === "queued" || job.status === "downloading";
  return (
    <div className="flex items-center gap-3 rounded-[10px] border border-white/[0.045] bg-[#0b0b0b] px-4 py-3">
      <span className={`grid size-8 place-items-center rounded-full ${
        running
          ? "bg-white/[0.045] text-white/45"
          : job.status === "completed"
            ? "bg-[#1ed760]/[0.07] text-[#79d795]"
            : "bg-red-500/[0.07] text-red-300/80"
      }`}>
        {running ? <LoaderCircle className="size-4 animate-spin" /> : job.status === "completed" ? <Check className="size-4" /> : <TriangleAlert className="size-4" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-mono text-[9px] font-medium text-[#dcd8c6]">{job.source}</p>
        <p className="mt-1 truncate font-mono text-[8px] text-white/20">{job.outputDir}</p>
        {job.error && <p className="mt-1 truncate font-mono text-[8px] text-red-300/75">{job.error}</p>}
      </div>
      <span className="font-mono text-[8px] font-semibold uppercase tracking-[0.08em] text-white/22">{job.status}</span>
    </div>
  );
}
