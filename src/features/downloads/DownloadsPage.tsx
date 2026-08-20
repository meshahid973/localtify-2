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
    <main className="mx-auto w-full max-w-[1220px] px-6 pb-14 pt-7 lg:px-10">
      <header>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/28">Power tools</p>
        <h1 className="mt-1 text-[34px] font-semibold tracking-[-0.055em]">Downloads</h1>
        <p className="mt-2 max-w-2xl text-[11px] leading-5 text-white/32">
          Save audio from media you have permission to download. Localtify uses yt-dlp and FFmpeg on your machine and imports nothing into the cloud.
        </p>
      </header>

      <section className="mt-7 rounded-2xl border border-white/[0.06] bg-[#090909] p-5">
        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          <ToolBadge label="yt-dlp" ready={Boolean(tools?.ytDlp)} />
          <ToolBadge label="ffmpeg" ready={Boolean(tools?.ffmpeg)} />
          <span className="ml-auto text-white/25">{ready ? "ready" : "install tools and restart Localtify"}</span>
        </div>

        <div className="mt-5 grid gap-3">
          <label>
            <span className="mb-2 block text-[10px] font-medium text-white/38">Media URL</span>
            <input
              value={source}
              onChange={(event) => setSource(event.currentTarget.value)}
              placeholder="https://..."
              className="h-11 w-full rounded-xl border border-white/[0.07] bg-black px-4 text-[12px] text-white outline-none transition-colors placeholder:text-white/20 focus:border-white/[0.16]"
            />
          </label>

          <div>
            <span className="mb-2 block text-[10px] font-medium text-white/38">Output folder</span>
            <button
              type="button"
              onClick={() => void chooseOutput()}
              className="flex h-11 w-full items-center gap-3 rounded-xl border border-white/[0.07] bg-black px-4 text-left text-[11px] text-white/45 transition-colors hover:border-white/[0.14] hover:text-white/70"
            >
              <Folder className="size-4 shrink-0" />
              <span className="truncate">{outputDir || "Choose a folder"}</span>
            </button>
          </div>

          <button
            type="button"
            disabled={!ready || loading || !source.trim() || !outputDir}
            onClick={() => void submit()}
            className="mt-1 flex h-11 items-center justify-center gap-2 rounded-xl bg-[#f5f5ef] text-[11px] font-bold text-black transition-transform active:scale-[.99] disabled:opacity-30"
          >
            <Download className="size-4" />
            Convert to MP3
          </button>
        </div>

        {error && <p className="mt-3 text-[11px] text-red-300">{error}</p>}
      </section>

      <section className="performance-section mt-9">
        <div className="mb-4 flex items-end gap-3">
          <h2 className="text-[24px] font-semibold tracking-[-0.045em]">Queue</h2>
          <span className="pb-1 text-[10px] text-white/28">{jobs.length} jobs</span>
        </div>

        <div className="space-y-2">
          {jobs.length ? jobs.map((job) => <DownloadRow key={job.id} job={job} />) : (
            <div className="rounded-xl border border-dashed border-white/[0.08] py-12 text-center text-[11px] text-white/25">
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
      ready ? "border-[#1ed760]/20 bg-[#1ed760]/[0.07] text-[#8de7ad]" : "border-white/[0.07] text-white/30"
    }`}>
      {ready ? <Check className="size-3" /> : <TriangleAlert className="size-3" />}
      {label}
    </span>
  );
}

function DownloadRow({ job }: { job: import("../../lib/contracts/domain").DownloadJob }) {
  const running = job.status === "queued" || job.status === "downloading";
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.055] bg-[#090909] px-4 py-3">
      <span className={`grid size-8 place-items-center rounded-full ${running ? "bg-white/[0.06] text-white/55" : job.status === "completed" ? "bg-[#1ed760]/10 text-[#72e49a]" : "bg-red-500/10 text-red-300"}`}>
        {running ? <LoaderCircle className="size-4 animate-spin" /> : job.status === "completed" ? <Check className="size-4" /> : <TriangleAlert className="size-4" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-medium text-white/75">{job.source}</p>
        <p className="mt-1 truncate text-[9px] text-white/25">{job.outputDir}</p>
        {job.error && <p className="mt-1 truncate text-[9px] text-red-300">{job.error}</p>}
      </div>
      <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-white/30">{job.status}</span>
    </div>
  );
}
