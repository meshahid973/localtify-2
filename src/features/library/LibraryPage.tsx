import { isTauri } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { FolderPlus, Play, Search, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { AlbumArtwork } from "../../components/ui/AlbumArtwork";
import { PageFrame, PageHeader } from "../../components/ui/Page";
import { formatDuration } from "../../lib/format";
import { MOTION } from "../../lib/motion";
import { Pressable } from "../../ui/motion/Pressable";
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
            <label className="library-search themed-card flex h-9 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-1)] px-3 text-white/34 transition-colors focus-within:border-white/[0.16] focus-within:text-white/62">
              <Search className="size-3.5 shrink-0" />
              <input
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                placeholder="Search library"
                className="w-36 bg-transparent text-[10px] text-white/82 outline-none placeholder:text-white/22 sm:w-44"
              />
              {query && (
                <Pressable
                  ariaLabel="Clear library search"
                  strength="subtle"
                  flash={false}
                  onClick={() => setQuery("")}
                  className="text-white/28 transition-colors hover:text-white/68"
                >
                  <X className="relative z-10 size-3" />
                </Pressable>
              )}
            </label>

            <Pressable
              strength="medium"
              disabled={scanning}
              onClick={() => void chooseFolder()}
              className="themed-button flex h-9 items-center gap-2 rounded-full bg-white px-4 text-[10px] font-semibold text-black disabled:opacity-40"
            >
              <span className="relative z-10 flex items-center gap-2">
                <FolderPlus className="size-3.5" />
                <span className="hidden sm:inline">{scanning ? "Scanning…" : "Add music"}</span>
              </span>
            </Pressable>
          </div>
        }
      />

      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...MOTION.section, delay: 0.04 }}
        className="performance-section themed-panel mt-7 overflow-hidden rounded-[14px] border border-[var(--line)] bg-[var(--surface-1)]"
      >
        <div className="library-table grid grid-cols-[42px_minmax(0,1.5fr)_minmax(140px,.8fr)_70px] gap-3 border-b border-[var(--line)] px-3 py-2.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/20">
          <span className="text-center">#</span>
          <span>Title</span>
          <span className="library-album-column">Album</span>
          <span className="text-right">Time</span>
        </div>

        {tracks.length === 0 ? (
          <Pressable
            strength="subtle"
            onClick={() => void chooseFolder()}
            className="flex min-h-44 w-full items-center justify-center text-[10px] text-white/26 transition-colors hover:text-white/54"
          >
            <span className="relative z-10">Add a music folder to build your library</span>
          </Pressable>
        ) : filteredTracks.length ? (
          filteredTracks.slice(0, visible).map((track, index) => {
            const active = currentTrackId === track.id;
            return (
              <Pressable
                key={track.id}
                strength="subtle"
                flash={false}
                onClick={() => void playTrack(track.id)}
                className={`library-table group grid w-full grid-cols-[42px_minmax(0,1.5fr)_minmax(140px,.8fr)_70px] items-center gap-3 border-b border-white/[0.03] px-3 py-2 text-left transition-colors last:border-0 ${
                  active ? "bg-white/[0.055]" : "hover:bg-white/[0.035]"
                }`}
              >
                <span className="relative z-10 grid place-items-center text-[9px] tabular-nums text-white/20">
                  <span className="group-hover:hidden">{index + 1}</span>
                  <Play className="hidden size-3 fill-current text-white group-hover:block" />
                </span>

                <span className="relative z-10 flex min-w-0 items-center gap-3">
                  <AlbumArtwork artworkKey={track.artworkKey} className="size-10 shrink-0 rounded-[6px]" alt="" />
                  <span className="min-w-0">
                    <span className={`block truncate text-[10px] font-semibold ${active ? "text-white" : "text-white/84"}`}>
                      {track.title}
                    </span>
                    <span className="mt-1 block truncate text-[8px] text-white/26">{track.artistName}</span>
                  </span>
                </span>

                <span className="library-album-column relative z-10 truncate text-[9px] text-white/22">{track.albumTitle ?? "—"}</span>
                <span className="relative z-10 text-right text-[8px] tabular-nums text-white/20">{formatDuration(track.durationMs)}</span>
              </Pressable>
            );
          })
        ) : (
          <div className="flex min-h-40 items-center justify-center px-5 text-center text-[10px] text-white/30">
            No tracks match “{query.trim()}”.
          </div>
        )}
      </motion.section>

      {visible < filteredTracks.length && (
        <Pressable
          strength="subtle"
          onClick={() => setVisible((count) => count + INITIAL_VISIBLE)}
          className="themed-button mx-auto mt-5 block rounded-full border border-[var(--line)] px-4 py-2 text-[9px] text-white/34 transition-colors hover:bg-white/[0.04] hover:text-white/65"
        >
          <span className="relative z-10">Show more</span>
        </Pressable>
      )}
    </PageFrame>
  );
}
