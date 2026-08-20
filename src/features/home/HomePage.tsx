import { isTauri } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { FolderPlus, Play, Search } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { albumArtworkFor } from "../../ALBUM";
import { AlbumArtwork } from "../../components/ui/AlbumArtwork";
import { useLibraryStore } from "../library/library.store";
import { usePlayerStore } from "../player/player.store";

export function HomePage() {
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const tracks = useLibraryStore((state) => state.tracks);
  const folders = useLibraryStore((state) => state.folders);
  const scanning = useLibraryStore((state) => state.scanning);
  const libraryError = useLibraryStore((state) => state.error);
  const addFolder = useLibraryStore((state) => state.addFolder);
  const player = usePlayerStore((state) => state.state);
  const playerError = usePlayerStore((state) => state.error);
  const playTrack = usePlayerStore((state) => state.playTrack);

  const filteredTracks = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return tracks;
    return tracks.filter((track) =>
      `${track.title} ${track.artistName} ${track.albumTitle ?? ""}`.toLocaleLowerCase().includes(normalized),
    );
  }, [query, tracks]);

  const heroTrack = player.currentTrack ?? filteredTracks[0] ?? tracks[0] ?? null;
  const heroArtwork = heroTrack ? albumArtworkFor(heroTrack.artworkKey) : null;
  const recentTracks = tracks.slice(0, 6);

  async function chooseFolder() {
    if (!isTauri()) return;
    const selected = await open({ directory: true, multiple: false, title: "Add music folder" });
    if (typeof selected === "string") {
      await addFolder(selected);
    }
  }

  return (
    <main className="mx-auto min-h-full w-full max-w-[1680px] px-6 pb-12 pt-7 lg:px-9">
      <motion.header
        initial={reduceMotion ? false : { opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div>
          <p className="text-[11px] font-medium text-[#777]">Your library</p>
          <h1 className="mt-1 text-[clamp(1.8rem,3vw,2.8rem)] font-semibold tracking-[-0.055em]">Listen locally.</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <label className="hidden h-10 w-[min(340px,34vw)] items-center gap-2 rounded-full bg-[#151515] px-4 text-[#777] md:flex">
            <Search className="size-4" />
            <input
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder="Search your music"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#666]"
            />
          </label>
          <motion.button
            type="button"
            whileHover={reduceMotion ? undefined : { scale: 1.025 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => void chooseFolder()}
            disabled={scanning}
            className="flex h-10 items-center gap-2 rounded-full bg-white px-4 text-xs font-semibold text-black disabled:opacity-50"
          >
            <FolderPlus className="size-4" />
            {scanning ? "Scanning…" : "Add music"}
          </motion.button>
        </div>
      </motion.header>

      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.35 }}
        className="relative mt-7 overflow-hidden rounded-2xl bg-[#0d0d0d]"
      >
        {heroArtwork && (
          <img
            src={heroArtwork}
            aria-hidden
            className="pointer-events-none absolute inset-0 size-full scale-110 object-cover opacity-[0.12] blur-3xl"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#0d0d0d_8%,rgba(13,13,13,.92)_45%,rgba(13,13,13,.56))]" />
        <div className="relative flex min-h-[310px] items-end gap-7 p-7 md:items-center md:p-9">
          <AlbumArtwork
            artworkKey={heroTrack?.artworkKey ?? "localtify"}
            alt={heroTrack ? `${heroTrack.title} artwork` : "Localtify artwork"}
            className="hidden size-[220px] shrink-0 rounded-xl shadow-[0_28px_60px_rgba(0,0,0,.5)] md:block"
          />
          <div className="min-w-0 max-w-3xl pb-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1ed760]">
              {heroTrack ? "Local playback" : "OLED. Native. Yours."}
            </p>
            <motion.h2
              key={heroTrack?.id ?? "empty"}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 line-clamp-2 text-[clamp(2.6rem,6vw,5.7rem)] font-bold leading-[0.9] tracking-[-0.075em]"
            >
              {heroTrack?.title ?? "Your music. Nothing else."}
            </motion.h2>
            <p className="mt-5 text-sm font-medium text-[#9b9b9b]">
              {heroTrack ? heroTrack.artistName : "Add a folder and Localtify will build your library on-device."}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {heroTrack && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => void playTrack(heroTrack.id)}
                  className="grid size-12 place-items-center rounded-full bg-[#1ed760] text-black"
                >
                  <Play className="ml-0.5 size-5 fill-current" />
                </motion.button>
              )}
              <span className="text-xs text-[#666]">{tracks.length} tracks · {folders.length} folders</span>
            </div>
          </div>
        </div>
      </motion.section>

      {(libraryError || playerError) && (
        <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/[0.07] px-4 py-3 text-xs text-red-200">
          {libraryError ?? playerError}
        </div>
      )}

      <Section title="Recently added" subtitle={tracks.length ? "From your local library" : "Your covers will appear here"}>
        {recentTracks.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {recentTracks.map((track, index) => (
              <motion.button
                key={track.id}
                type="button"
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + index * 0.025 }}
                whileHover={reduceMotion ? undefined : { y: -4 }}
                onClick={() => void playTrack(track.id)}
                className="group min-w-0 text-left"
              >
                <div className="relative aspect-square overflow-hidden rounded-lg bg-[#151515]">
                  <AlbumArtwork artworkKey={track.artworkKey} className="size-full" alt={`${track.title} artwork`} />
                  <span className="absolute bottom-3 right-3 grid size-10 translate-y-2 place-items-center rounded-full bg-[#1ed760] text-black opacity-0 shadow-xl transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                    <Play className="ml-0.5 size-4 fill-current" />
                  </span>
                </div>
                <p className="mt-3 truncate text-sm font-semibold">{track.title}</p>
                <p className="mt-1 truncate text-xs text-[#777]">{track.artistName}</p>
              </motion.button>
            ))}
          </div>
        ) : (
          <EmptyLibrary onAdd={() => void chooseFolder()} scanning={scanning} />
        )}
      </Section>

      <Section title="Tracks" subtitle={query ? `${filteredTracks.length} matches` : `${tracks.length} songs`}>
        <div className="overflow-hidden rounded-xl border border-[#171717]">
          {filteredTracks.slice(0, 100).map((track, index) => {
            const active = player.currentTrack?.id === track.id;
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => void playTrack(track.id)}
                className={`grid w-full grid-cols-[36px_minmax(0,1fr)_minmax(120px,.7fr)_64px] items-center gap-3 border-b border-[#151515] px-3 py-2.5 text-left transition-colors last:border-0 ${active ? "bg-[#171717]" : "hover:bg-[#111]"}`}
              >
                <span className="text-center text-[11px] tabular-nums text-[#666]">{index + 1}</span>
                <span className="flex min-w-0 items-center gap-3">
                  <AlbumArtwork artworkKey={track.artworkKey} className="size-10 shrink-0 rounded" />
                  <span className="min-w-0">
                    <span className={`block truncate text-sm font-medium ${active ? "text-[#1ed760]" : "text-white"}`}>{track.title}</span>
                    <span className="mt-0.5 block truncate text-xs text-[#777]">{track.artistName}</span>
                  </span>
                </span>
                <span className="truncate text-xs text-[#777]">{track.albumTitle ?? "—"}</span>
                <span className="text-right text-xs tabular-nums text-[#666]">{formatDuration(track.durationMs)}</span>
              </button>
            );
          })}
        </div>
      </Section>
    </main>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end gap-3">
        <h3 className="text-xl font-semibold tracking-[-0.035em]">{title}</h3>
        <span className="pb-0.5 text-[11px] text-[#666]">{subtitle}</span>
      </div>
      {children}
    </section>
  );
}

function EmptyLibrary({ onAdd, scanning }: { onAdd: () => void; scanning: boolean }) {
  return (
    <button
      type="button"
      onClick={onAdd}
      disabled={scanning}
      className="col-span-full flex min-h-44 w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#262626] bg-[#090909] text-center disabled:opacity-60"
    >
      <FolderPlus className="size-6 text-[#666]" />
      <p className="mt-3 text-sm font-semibold">Add your first music folder</p>
      <p className="mt-1 text-xs text-[#666]">MP3, FLAC, M4A, MP4, OGG and WAV</p>
    </button>
  );
}

function formatDuration(durationMs: number) {
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  return `${minutes}:${String(totalSeconds % 60).padStart(2, "0")}`;
}
