import { isTauri } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { FolderPlus, Library, Play } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
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
  const heroArtwork = featured ? albumArtworkFor(featured.artworkKey) : albumArtworkFor("localtify-home-hero");
  const quickPicks = tracks.slice(0, 6);
  const secondBatch = tracks.slice(6, 12);
  const recentTracks = secondBatch.length ? secondBatch : tracks.slice(0, 6);

  async function chooseFolder() {
    if (!isTauri()) return;
    const selected = await open({ directory: true, multiple: false, title: "Add music folder" });
    if (typeof selected === "string") await addFolder(selected);
  }

  return (
    <main className="mx-auto w-full max-w-[1480px] px-7 pb-16 pt-7 lg:px-10">
      <motion.header
        initial={reduceMotion ? false : { opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-end gap-4"
      >
        <div>
          <p className="text-[10px] font-medium text-white/28">{greeting()}</p>
          <h1 className="mt-1 text-[32px] font-semibold tracking-[-0.055em] text-white">Your music.</h1>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden text-[10px] text-white/22 lg:block">
            {tracks.length} tracks · {folders.length} folders
          </span>
          <motion.button
            type="button"
            whileHover={reduceMotion ? undefined : { y: -1, scale: 1.015 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => void chooseFolder()}
            disabled={scanning}
            className="flex h-9 items-center gap-2 rounded-full bg-white px-4 text-[10px] font-semibold text-black disabled:opacity-40"
          >
            <FolderPlus className="size-3.5" />
            {scanning ? "Scanning…" : "Add music"}
          </motion.button>
        </div>
      </motion.header>

      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-6 overflow-hidden rounded-[20px] border border-white/[0.055] bg-[#090909]"
      >
        {heroArtwork && (
          <img
            src={heroArtwork}
            alt=""
            aria-hidden
            className="pointer-events-none absolute right-0 top-1/2 h-[360px] w-[360px] -translate-y-1/2 scale-125 rounded-full object-cover opacity-[0.12] blur-[70px]"
          />
        )}

        <div className="relative grid min-h-[330px] items-center gap-8 px-8 py-8 md:grid-cols-[minmax(0,1fr)_260px] md:px-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="max-w-[760px]">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              {featured ? "Now in your library" : "Private · Native · Local"}
            </p>

            <motion.h2
              key={featured?.id ?? "empty"}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.34, delay: 0.08 }}
              className="mt-4 max-w-[760px] text-[clamp(2.8rem,5.4vw,5.6rem)] font-semibold leading-[0.92] tracking-[-0.072em] text-white"
            >
              {featured?.title ?? "A quieter place for your music."}
            </motion.h2>

            <p className="mt-5 max-w-xl text-[12px] leading-5 text-white/42">
              {featured
                ? `${featured.artistName}${featured.albumTitle ? ` · ${featured.albumTitle}` : ""}`
                : "Add a folder once. Localtify keeps the library on your device and out of the way."}
            </p>

            <div className="mt-7 flex items-center gap-3">
              {featured ? (
                <motion.button
                  type="button"
                  whileHover={reduceMotion ? undefined : { scale: 1.025 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 430, damping: 28 }}
                  onClick={() => void playTrack(featured.id)}
                  className="flex h-10 items-center gap-2 rounded-full bg-[var(--accent)] px-5 text-[10px] font-bold text-black"
                >
                  <Play className="size-3.5 fill-current" />
                  Play
                </motion.button>
              ) : (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => void chooseFolder()}
                  className="h-10 rounded-full bg-[var(--accent)] px-5 text-[10px] font-bold text-black"
                >
                  Add your first folder
                </motion.button>
              )}

              <motion.button
                type="button"
                whileHover={reduceMotion ? undefined : { x: 2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setPage("library")}
                className="flex h-10 items-center gap-2 rounded-full border border-white/[0.08] px-4 text-[10px] font-medium text-white/48 transition-colors hover:border-white/[0.14] hover:text-white/80"
              >
                <Library className="size-3.5" />
                Library
              </motion.button>
            </div>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 16, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.08 }}
            whileHover={reduceMotion ? undefined : { scale: 1.018 }}
            className="relative mx-auto hidden aspect-square w-full max-w-[300px] md:block"
          >
            <div className="absolute inset-3 rounded-[22px] bg-white/[0.035] blur-2xl" />
            <AlbumArtwork
              artworkKey={featured?.artworkKey ?? "localtify-home-hero"}
              alt={featured ? `${featured.title} artwork` : "Localtify artwork"}
              className="artwork-glow-target relative size-full rounded-[18px] ring-1 ring-inset ring-white/[0.08]"
            />
          </motion.div>
        </div>
      </motion.section>

      {(libraryError || playerError) && (
        <div className="mt-4 rounded-[10px] border border-red-400/15 bg-red-500/[0.06] px-3 py-2 text-[10px] text-red-200/80">
          {libraryError ?? playerError}
        </div>
      )}

      <section className="performance-section mt-9">
        <SectionHeader title="Quick picks" meta={quickPicks.length ? "Play something now" : "Your library is empty"} />
        {quickPicks.length ? (
          <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
            {quickPicks.map((track, index) => (
              <motion.button
                key={track.id}
                type="button"
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: Math.min(index * 0.035, 0.16) }}
                whileHover={reduceMotion ? undefined : { y: -2 }}
                whileTap={{ scale: 0.992 }}
                onClick={() => void playTrack(track.id)}
                className="group flex h-[64px] min-w-0 items-center overflow-hidden rounded-[12px] border border-white/[0.045] bg-[#0b0b0b] text-left transition-colors hover:border-white/[0.09] hover:bg-[#111]"
              >
                <AlbumArtwork artworkKey={track.artworkKey} alt={`${track.title} artwork`} className="size-[64px] shrink-0" />
                <span className="min-w-0 px-3">
                  <span className="block truncate text-[11px] font-semibold text-white/86">{track.title}</span>
                  <span className="mt-1 block truncate text-[9px] text-white/28">{track.artistName}</span>
                </span>
                <span className="ml-auto mr-3 grid size-8 shrink-0 translate-x-1 place-items-center rounded-full bg-[var(--accent)] text-black opacity-0 shadow-lg transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                  <Play className="ml-0.5 size-3 fill-current" />
                </span>
              </motion.button>
            ))}
          </div>
        ) : (
          <EmptyState onClick={() => void chooseFolder()} />
        )}
      </section>

      {recentTracks.length > 0 && (
        <section className="performance-section mt-10">
          <SectionHeader title="Recently added" meta={`${recentTracks.length} covers`} />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {recentTracks.map((track, index) => (
              <motion.button
                key={track.id}
                type="button"
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.035, 0.18) }}
                whileHover={reduceMotion ? undefined : { y: -4 }}
                onClick={() => void playTrack(track.id)}
                className="group min-w-0 text-left"
              >
                <div className="relative aspect-square overflow-hidden rounded-[14px] bg-[#0b0b0b] ring-1 ring-inset ring-white/[0.05]">
                  <AlbumArtwork
                    artworkKey={track.artworkKey}
                    alt={`${track.title} artwork`}
                    className="size-full transition-transform duration-300 ease-out group-hover:scale-[1.025]"
                  />
                  <span className="absolute bottom-3 right-3 grid size-9 translate-y-2 place-items-center rounded-full bg-[var(--accent)] text-black opacity-0 shadow-xl transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                    <Play className="ml-0.5 size-3.5 fill-current" />
                  </span>
                </div>
                <p className="mt-3 truncate text-[11px] font-semibold text-white/82">{track.title}</p>
                <p className="mt-1 truncate text-[9px] text-white/26">{track.artistName}</p>
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
      <h3 className="text-[22px] font-semibold tracking-[-0.045em] text-white">{title}</h3>
      <span className="pb-0.5 text-[9px] text-white/20">{meta}</span>
    </div>
  );
}

function EmptyState({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.004 }}
      whileTap={{ scale: 0.997 }}
      onClick={onClick}
      className="flex min-h-28 w-full items-center justify-center rounded-[12px] border border-dashed border-white/[0.075] bg-[#080808] text-[10px] text-white/28 transition-colors hover:border-white/[0.13] hover:text-white/55"
    >
      Add music to build your home
    </motion.button>
  );
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
