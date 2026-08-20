import { isTauri } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { FolderPlus, Play, Search, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { AlbumArtwork } from "../../components/ui/AlbumArtwork";
import { PageFrame, PageHeader } from "../../components/ui/Page";
import { formatDuration } from "../../lib/format";
import { MOTION } from "../../lib/motion";
import { usePlayerStore } from "../player/player.store";
import { filterTracks } from "./search";
import { useLibraryStore } from "./library.store";

const INITIAL_VISIBLE = 120;

export function LibraryPage() {
  const reduceMotion = useReducedMotion();
  const tracks = useLibraryStore((state) => state.tracks);
  const folders = useLibraryStore((state) => state.folders);
  const scanning = useLibraryStore((state) => state.scanning);
  const addFolder = useLibraryStore((state) => state.addFolder);
  const currentTrackId = usePlayerStore((state) => state.state.currentTrack?.id ?? null);
  const playTrack = usePlayerStore((state) => state.playTrack);
  const [visible, setVisible] = useState(INITIAL_VISIBLE);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const filteredTracks = useMemo(() => filterTracks(tracks, deferredQuery), [deferredQuery, tracks]);

  useEffect(() => {
    setVisible(INITIAL_VISIBLE);
  }, [deferredQuery]);

  async function chooseFolder() {
    if (!isTauri()) return;
    const selected = await open({ directory: true, multiple: false, title: "Add music folder" });
    if (typeof selected === "string") await addFolder(selected);
  }

  const meta = query.trim()
    ? `${filteredTracks.length} matches · ${tracks.length} total`
    : `${tracks.length} tracks · ${folders.length} folders`;

  return (
    <PageFrame>
      <PageHeader
        eyebrow="On this device"
        title="Library"
        meta={meta}
        actions={
          <div className="flex items-center gap-2">
            <label className="library-search flex h-9 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-1)] px-3 text-white/30 transition-colors focus-within:border-white/[0.12] focus-within:text-white/55">
              <Search className="size-3.5 shrink-0" />
              <input
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                placeholder="Search library"
                className="w-36 bg-transparent text-[10px] text-white/78 outline-none placeholder:text-white/20 sm:w-44"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear library search"
                  onClick={() => setQuery("")}
                  className="text-white/24 transition-colors hover:text-white/65"
                >
                  <X className="size-3" />
                </button>
              )}
            </label>

            <motion.button
              type="button"
              whileHover={reduceMotion ? undefined : { y: -1 }}
              whileTap={{ scale: 0.97 }}
              disabled={scanning}
              onClick={() => void chooseFolder()}
              className="flex h-9 items-center gap-2 rounded-full bg-white px-4 text-[10px] font-semibold text-black disabled:opacity-40"
            >
              <FolderPlus className="size-3.5" />
              <span className="hidden sm:inline">{scanning ? "Scanning…" : "Add music"}</span>
            </motion.button>
          </div>
        }
      />

      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...MOTION.section, delay: 0.04 }}
        className="performance-section mt-7 overflow-hidden rounded-[14px] border border-[var(--line)] bg-[var(--surface-1)]"
      >
        <div className="library-table grid grid-cols-[42px_minmax(0,1.5fr)_minmax(140px,.8fr)_70px] gap-3 border-b border-[var(--line)] px-3 py-2.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/17">
          <span className="text-center">#</span>
          <span>Title</span>
          <span className="library-album-column">Album</span>
          <span className="text-right">Time</span>
        </div>

        {tracks.length === 0 ? (
          <button
            type="button"
            onClick={() => void chooseFolder()}
            className="flex min-h-44 w-full items-center justify-center text-[10px] text-white/23 transition-colors hover:text-white/50"
          >
            Add a music folder to build your library
          </button>
        ) : filteredTracks.length ? (
          filteredTracks.slice(0, visible).map((track, index) => {
            const active = currentTrackId === track.id;
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => void playTrack(track.id)}
                className={`library-table group grid w-full grid-cols-[42px_minmax(0,1.5fr)_minmax(140px,.8fr)_70px] items-center gap-3 border-b border-white/[0.025] px-3 py-2 text-left transition-colors last:border-0 ${
                  active ? "bg-white/[0.05]" : "hover:bg-white/[0.028]"
                }`}
              >
                <span className="grid place-items-center text-[9px] tabular-nums text-white/17">
                  <span className="group-hover:hidden">{index + 1}</span>
                  <Play className="hidden size-3 fill-current text-white group-hover:block" />
                </span>

                <span className="flex min-w-0 items-center gap-3">
                  <AlbumArtwork artworkKey={track.artworkKey} className="size-10 shrink-0 rounded-[6px]" alt="" />
                  <span className="min-w-0">
                    <span className={`block truncate text-[10px] font-semibold ${active ? "text-white" : "text-white/80"}`}>
                      {track.title}
                    </span>
                    <span className="mt-1 block truncate text-[8px] text-white/23">{track.artistName}</span>
                  </span>
                </span>

                <span className="library-album-column truncate text-[9px] text-white/19">{track.albumTitle ?? "—"}</span>
                <span className="text-right text-[8px] tabular-nums text-white/17">{formatDuration(track.durationMs)}</span>
              </button>
            );
          })
        ) : (
          <div className="flex min-h-40 items-center justify-center px-5 text-center text-[10px] text-white/28">
            No tracks match “{query.trim()}”.
          </div>
        )}
      </motion.section>

      {visible < filteredTracks.length && (
        <motion.button
          type="button"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setVisible((count) => count + INITIAL_VISIBLE)}
          className="mx-auto mt-5 block rounded-full border border-[var(--line)] px-4 py-2 text-[9px] text-white/30 transition-colors hover:bg-white/[0.035] hover:text-white/60"
        >
          Show more
        </motion.button>
      )}
    </PageFrame>
  );
}
