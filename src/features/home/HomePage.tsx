import { isTauri } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { FolderPlus, Library, Play } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useMemo } from "react";
import { albumArtworkFor } from "../../ALBUM";
import { AlbumArtwork } from "../../components/ui/AlbumArtwork";
import { useLibraryStore } from "../library/library.store";
import { useNavigationStore } from "../navigation/navigation.store";
import { usePlayerStore } from "../player/player.store";

export function HomePage() {
  const reduceMotion = useReducedMotion();
  const tracks = useLibraryStore((state) => state.tracks);
  const folders = useLibraryStore((state) => state.folders);
  const scanning = useLibraryStore((state) => state.scanning);
  const libraryError = useLibraryStore((state) => state.error);
  const addFolder = useLibraryStore((state) => state.addFolder);
  const player = usePlayerStore((state) => state.state);
  const playerError = usePlayerStore((state) => state.error);
  const playTrack = usePlayerStore((state) => state.playTrack);
  const setPage = useNavigationStore((state) => state.setPage);

  const featured = player.currentTrack ?? tracks[0] ?? null;
  const heroArtwork = featured
    ? albumArtworkFor(featured.artworkKey)
    : albumArtworkFor("localtify-home-hero");
  const listenNow = tracks.slice(0, 8);

  const artists = useMemo(() => {
    const map = new Map<string, { name: string; artworkKey: string; count: number }>();
    for (const track of tracks) {
      const key = track.artistName.trim() || "Unknown artist";
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(key, { name: key, artworkKey: track.artworkKey, count: 1 });
      }
    }
    return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 10);
  }, [tracks]);

  async function chooseFolder() {
    if (!isTauri()) return;
    const selected = await open({ directory: true, multiple: false, title: "Add music folder" });
    if (typeof selected === "string") await addFolder(selected);
  }

  return (
    <main className="mx-auto w-full max-w-[1540px] px-7 pb-14 pt-6 lg:px-10">
      <motion.header
        initial={reduceMotion ? false : { opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-4"
      >
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/24">Local library</p>
          <h1 className="mt-1 font-mono text-[30px] font-semibold tracking-[-0.055em] text-[#f3f0dd]">Home</h1>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden font-mono text-[9px] text-white/24 lg:block">
            {tracks.length} tracks · {folders.length} folders
          </span>
          <motion.button
            type="button"
            whileHover={reduceMotion ? undefined : { y: -1 }}
            whileTap={{ scale: 0.975 }}
            onClick={() => void chooseFolder()}
            disabled={scanning}
            className="ml-2 flex h-8 items-center gap-2 rounded-full border border-white/[0.07] bg-[#111] px-3.5 font-mono text-[9px] font-semibold text-[#d8d4c3] transition-colors hover:bg-[#171717] disabled:opacity-40"
          >
            <FolderPlus className="size-3.5" />
            {scanning ? "Scanning…" : "Add music"}
          </motion.button>
        </div>
      </motion.header>

      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.992 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-4 min-h-[315px] overflow-hidden rounded-[18px] bg-[#111]"
      >
        {heroArtwork && (
          <motion.img
            key={heroArtwork}
            src={heroArtwork}
            alt=""
            fetchPriority="high"
            initial={reduceMotion ? false : { opacity: 0, scale: 1.035 }}
            animate={{ opacity: 0.72, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 size-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,.90)_0%,rgba(5,5,5,.72)_38%,rgba(5,5,5,.28)_72%,rgba(5,5,5,.16)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,.34),transparent_58%)]" />

        <div className="relative flex min-h-[315px] max-w-[800px] flex-col justify-center px-8 py-8 md:px-10">
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-[#75d893]">
            ✦ {featured ? "Featured album" : "OLED · Native · Local"}
          </p>

          <motion.h2
            key={featured?.id ?? "empty"}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="mt-4 line-clamp-2 font-mono text-[clamp(2.5rem,4.6vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-[#f3f0dd]"
          >
            {featured?.title ?? "Your music, your space."}
          </motion.h2>

          <p className="mt-4 max-w-2xl truncate font-mono text-[12px] text-[#c3bfae]/70">
            {featured
              ? `By ${featured.artistName}${featured.albumTitle ? ` · ${featured.albumTitle}` : ""}`
              : "Add a folder and Localtify builds everything on-device."}
          </p>

          <div className="mt-6 flex items-center gap-3">
            {featured ? (
              <motion.button
                type="button"
                whileHover={reduceMotion ? undefined : { scale: 1.025 }}
                whileTap={{ scale: 0.965 }}
                transition={{ type: "spring", stiffness: 440, damping: 30 }}
                onClick={() => void playTrack(featured.id)}
                className="flex h-10 items-center gap-2 rounded-full bg-[#f3f0dd] px-5 font-mono text-[10px] font-bold text-[#151515]"
              >
                <Play className="size-3.5 fill-current" />
                Start listening
              </motion.button>
            ) : (
              <button
                type="button"
                onClick={() => void chooseFolder()}
                className="h-10 rounded-full bg-[#f3f0dd] px-5 font-mono text-[10px] font-bold text-[#151515]"
              >
                Add your first folder
              </button>
            )}

            <motion.button
              type="button"
              whileHover={reduceMotion ? undefined : { scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setPage("library")}
              aria-label="Open library"
              title="Open library"
              className="grid size-10 place-items-center rounded-full border border-white/[0.11] bg-black/20 text-[#e2decc]/70 transition-colors hover:bg-white/[0.07] hover:text-[#f3f0dd]"
            >
              <Library className="size-4" />
            </motion.button>
          </div>
        </div>
      </motion.section>

      {(libraryError || playerError) && (
        <div className="mt-4 rounded-[10px] border border-red-400/15 bg-red-500/[0.06] px-3 py-2 font-mono text-[9px] text-red-200/80">
          {libraryError ?? playerError}
        </div>
      )}

      <section className="performance-section mt-8">
        <SectionHeader title="Listen now" meta={listenNow.length ? "Quick picks" : "No tracks yet"} />
        {listenNow.length ? (
          <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-4">
            {listenNow.map((track, index) => (
              <motion.button
                key={track.id}
                type="button"
                initial={reduceMotion ? false : { opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.26, delay: Math.min(index * 0.025, 0.16) }}
                whileHover={reduceMotion ? undefined : { y: -2 }}
                whileTap={{ scale: 0.992 }}
                onClick={() => void playTrack(track.id)}
                className="group flex h-[66px] min-w-0 items-center overflow-hidden rounded-[11px] border border-white/[0.045] bg-[#111] text-left transition-colors hover:border-white/[0.08] hover:bg-[#171717]"
              >
                <AlbumArtwork artworkKey={track.artworkKey} alt={`${track.title} artwork`} className="size-[66px] shrink-0" />
                <span className="min-w-0 px-3">
                  <span className="block truncate font-mono text-[11px] font-semibold text-[#e8e4d2]">{track.title}</span>
                  <span className="mt-1.5 block truncate font-mono text-[9px] text-white/28">{track.artistName}</span>
                </span>
                <span className="ml-auto mr-3 grid size-7 shrink-0 translate-x-1 place-items-center rounded-full bg-[#f3f0dd] text-[#151515] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                  <Play className="ml-0.5 size-3 fill-current" />
                </span>
              </motion.button>
            ))}
          </div>
        ) : (
          <EmptyState onClick={() => void chooseFolder()} />
        )}
      </section>

      {artists.length > 0 && (
        <section className="performance-section mt-9">
          <SectionHeader title="Top artists" meta={`${artists.length} shown`} />
          <div className="hide-scrollbar flex gap-6 overflow-x-auto pb-2">
            {artists.map((artist, index) => (
              <motion.button
                key={artist.name}
                type="button"
                initial={reduceMotion ? false : { opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: Math.min(index * 0.025, 0.18) }}
                whileHover={reduceMotion ? undefined : { y: -3 }}
                className="group w-[132px] shrink-0 text-left"
              >
                <div className="relative aspect-square overflow-hidden rounded-full bg-[#111]">
                  <AlbumArtwork
                    artworkKey={artist.artworkKey}
                    alt=""
                    className="size-full transition-transform duration-300 ease-out group-hover:scale-[1.025]"
                  />
                  <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/[0.055]" />
                </div>
                <p className="mt-3 truncate text-center font-mono text-[10px] font-semibold text-[#dedac8]">{artist.name}</p>
                <p className="mt-1 text-center font-mono text-[8px] text-white/22">{artist.count} tracks</p>
              </motion.button>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function SectionHeader({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="mb-4 flex items-end gap-3">
      <h3 className="font-mono text-[24px] font-semibold tracking-[-0.045em] text-[#f3f0dd]">{title}</h3>
      <span className="pb-1 font-mono text-[8px] uppercase tracking-[0.08em] text-white/20">{meta}</span>
    </div>
  );
}

function EmptyState({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-28 w-full items-center justify-center rounded-[11px] border border-dashed border-white/[0.075] bg-[#0b0b0b] font-mono text-[10px] text-white/28 transition-colors hover:border-white/[0.13] hover:text-white/55"
    >
      Add music to build Listen now
    </button>
  );
}
