import { isTauri } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { FolderPlus, Play } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { AlbumArtwork } from "../../components/ui/AlbumArtwork";
import { usePlayerStore } from "../player/player.store";
import { useLibraryStore } from "./library.store";

const INITIAL_VISIBLE = 120;

export function LibraryPage() {
  const reduceMotion = useReducedMotion();
  const tracks = useLibraryStore((state) => state.tracks);
  const folders = useLibraryStore((state) => state.folders);
  const scanning = useLibraryStore((state) => state.scanning);
  const addFolder = useLibraryStore((state) => state.addFolder);
  const player = usePlayerStore((state) => state.state);
  const playTrack = usePlayerStore((state) => state.playTrack);
  const [visible, setVisible] = useState(INITIAL_VISIBLE);

  async function chooseFolder() {
    if (!isTauri()) return;
    const selected = await open({ directory: true, multiple: false, title: "Add music folder" });
    if (typeof selected === "string") await addFolder(selected);
  }

  return (
    <main className="mx-auto w-full max-w-[1460px] px-7 pb-16 pt-7 lg:px-10">
      <motion.header
        initial={reduceMotion ? false : { opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-end gap-4"
      >
        <div>
          <p className="text-[10px] font-medium text-white/26">On this device</p>
          <h1 className="mt-1 text-[32px] font-semibold tracking-[-0.055em]">Library</h1>
        </div>
        <span className="mb-1 text-[9px] text-white/22">{tracks.length} tracks · {folders.length} folders</span>
        <motion.button
          type="button"
          whileHover={reduceMotion ? undefined : { y: -1 }}
          whileTap={{ scale: 0.97 }}
          disabled={scanning}
          onClick={() => void chooseFolder()}
          className="ml-auto flex h-9 items-center gap-2 rounded-full bg-white px-4 text-[10px] font-semibold text-black disabled:opacity-40"
        >
          <FolderPlus className="size-3.5" />
          {scanning ? "Scanning…" : "Add music"}
        </motion.button>
      </motion.header>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
        className="performance-section mt-7 overflow-hidden rounded-[14px] border border-white/[0.05] bg-[#080808]"
      >
        <div className="grid grid-cols-[42px_minmax(0,1.5fr)_minmax(140px,.8fr)_70px] gap-3 border-b border-white/[0.045] px-3 py-2.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/18">
          <span className="text-center">#</span>
          <span>Title</span>
          <span>Album</span>
          <span className="text-right">Time</span>
        </div>

        {tracks.length ? (
          tracks.slice(0, visible).map((track, index) => {
            const active = player.currentTrack?.id === track.id;
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => void playTrack(track.id)}
                className={`group grid w-full grid-cols-[42px_minmax(0,1.5fr)_minmax(140px,.8fr)_70px] items-center gap-3 border-b border-white/[0.03] px-3 py-2 text-left transition-colors last:border-0 ${
                  active ? "bg-white/[0.055]" : "hover:bg-white/[0.03]"
                }`}
              >
                <span className="grid place-items-center text-[9px] tabular-nums text-white/18">
                  <span className="group-hover:hidden">{index + 1}</span>
                  <Play className="hidden size-3 fill-current text-white group-hover:block" />
                </span>

                <span className="flex min-w-0 items-center gap-3">
                  <AlbumArtwork artworkKey={track.artworkKey} className="size-10 shrink-0 rounded-[6px]" alt="" />
                  <span className="min-w-0">
                    <span className={`block truncate text-[10px] font-semibold ${active ? "text-[var(--accent)]" : "text-white/82"}`}>
                      {track.title}
                    </span>
                    <span className="mt-1 block truncate text-[8px] text-white/24">{track.artistName}</span>
                  </span>
                </span>

                <span className="truncate text-[9px] text-white/20">{track.albumTitle ?? "—"}</span>
                <span className="text-right text-[8px] tabular-nums text-white/18">{formatDuration(track.durationMs)}</span>
              </button>
            );
          })
        ) : (
          <button
            type="button"
            onClick={() => void chooseFolder()}
            className="flex min-h-44 w-full items-center justify-center text-[10px] text-white/24 transition-colors hover:text-white/50"
          >
            Add a music folder to build your library
          </button>
        )}
      </motion.div>

      {visible < tracks.length && (
        <button
          type="button"
          onClick={() => setVisible((count) => count + INITIAL_VISIBLE)}
          className="mx-auto mt-5 block rounded-full border border-white/[0.07] px-4 py-2 text-[9px] text-white/30 transition-colors hover:bg-white/[0.04] hover:text-white/60"
        >
          Show more
        </button>
      )}
    </main>
  );
}

function formatDuration(durationMs: number) {
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  return `${minutes}:${String(totalSeconds % 60).padStart(2, "0")}`;
}
