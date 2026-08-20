import { isTauri } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { FolderPlus, Library, Play } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { albumArtworkFor } from "../../ALBUM";
import { AlbumArtwork } from "../../components/ui/AlbumArtwork";
import { PageFrame, PageHeader, SectionHeading } from "../../components/ui/Page";
import { MOTION } from "../../lib/motion";
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
  const recentTracks = tracks.slice(0, 6);

  async function chooseFolder() {
    if (!isTauri()) return;
    const selected = await open({ directory: true, multiple: false, title: "Add music folder" });
    if (typeof selected === "string") await addFolder(selected);
  }

  return (
    <PageFrame>
      <PageHeader
        eyebrow={greeting()}
        title="Listen locally."
        meta={`${tracks.length} tracks · ${folders.length} folders`}
        actions={
          <motion.button
            type="button"
            whileHover={reduceMotion ? undefined : { y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => void chooseFolder()}
            disabled={scanning}
            className="flex h-9 items-center gap-2 rounded-full bg-white px-4 text-[10px] font-semibold text-black disabled:opacity-40"
          >
            <FolderPlus className="size-3.5" />
            {scanning ? "Scanning…" : "Add music"}
          </motion.button>
        }
      />

      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...MOTION.section, delay: 0.04 }}
        className="relative mt-6 overflow-hidden rounded-[18px] border border-[var(--line)] bg-[var(--surface-1)]"
      >
        {heroArtwork && (
          <img
            src={heroArtwork}
            alt=""
            aria-hidden
            className="pointer-events-none absolute right-0 top-1/2 h-[340px] w-[340px] -translate-y-1/2 scale-125 rounded-full object-cover opacity-[0.09] blur-[72px]"
          />
        )}

        <div className="relative grid min-h-[300px] items-center gap-8 px-8 py-8 md:grid-cols-[minmax(0,1fr)_230px] md:px-10 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="max-w-[760px]">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/28">
              {featured ? "Now playing" : "On this device"}
            </p>

            <motion.h2
              key={featured?.id ?? "empty"}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...MOTION.enter, delay: 0.07 }}
              className="mt-4 max-w-[760px] text-[clamp(2.6rem,5vw,5rem)] font-semibold leading-[0.94] tracking-[-0.07em] text-white"
            >
              {featured?.title ?? "Your music. Nothing else."}
            </motion.h2>

            <p className="mt-5 max-w-xl text-[11px] leading-5 text-white/38">
              {featured
                ? `${featured.artistName}${featured.albumTitle ? ` · ${featured.albumTitle}` : ""}`
                : "A native local player that stays quiet until you need it."}
            </p>

            <div className="mt-7 flex items-center gap-3">
              <motion.button
                type="button"
                whileHover={reduceMotion ? undefined : { scale: 1.025 }}
                whileTap={{ scale: 0.96 }}
                transition={MOTION.spring}
                onClick={() => featured ? void playTrack(featured.id) : void chooseFolder()}
                className="flex h-10 items-center gap-2 rounded-full bg-[var(--accent)] px-5 text-[10px] font-bold text-black"
              >
                {featured ? <Play className="size-3.5 fill-current" /> : <FolderPlus className="size-3.5" />}
                {featured ? "Play" : "Add music"}
              </motion.button>

              <motion.button
                type="button"
                whileHover={reduceMotion ? undefined : { y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setPage("library")}
                className="flex h-10 items-center gap-2 rounded-full border border-[var(--line)] bg-black/30 px-4 text-[10px] font-medium text-white/48 transition-colors hover:bg-white/[0.035] hover:text-white/78"
              >
                <Library className="size-3.5" />
                Library
              </motion.button>
            </div>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 12, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ ...MOTION.softSpring, delay: 0.08 }}
            whileHover={reduceMotion ? undefined : { y: -3, scale: 1.01 }}
            className="relative mx-auto hidden aspect-square w-full max-w-[260px] md:block"
          >
            <AlbumArtwork
              artworkKey={featured?.artworkKey ?? "localtify-home-hero"}
              alt={featured ? `${featured.title} artwork` : "Localtify artwork"}
              className="artwork-glow-target relative size-full rounded-[16px] ring-1 ring-inset ring-white/[0.07]"
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
        <SectionHeading title="Quick picks" meta={quickPicks.length ? "From your library" : "Nothing here yet"} />
        {quickPicks.length ? (
          <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
            {quickPicks.map((track, index) => (
              <motion.button
                key={track.id}
                type="button"
                initial={reduceMotion ? false : { opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, delay: Math.min(index * 0.03, 0.14), ease: MOTION.enter.ease }}
                whileHover={reduceMotion ? undefined : { y: -2 }}
                whileTap={{ scale: 0.992 }}
                onClick={() => void playTrack(track.id)}
                className="group flex h-[62px] min-w-0 items-center overflow-hidden rounded-[11px] border border-[var(--line)] bg-[var(--surface-1)] text-left transition-colors hover:bg-[var(--surface-2)]"
              >
                <AlbumArtwork artworkKey={track.artworkKey} alt={`${track.title} artwork`} className="size-[62px] shrink-0" />
                <span className="min-w-0 px-3">
                  <span className="block truncate text-[11px] font-semibold text-white/84">{track.title}</span>
                  <span className="mt-1 block truncate text-[9px] text-white/26">{track.artistName}</span>
                </span>
                <span className="ml-auto mr-3 grid size-8 shrink-0 translate-y-1 place-items-center rounded-full bg-white text-black opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
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
          <SectionHeading title="Recently added" meta={`${recentTracks.length} covers`} />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {recentTracks.map((track, index) => (
              <motion.button
                key={track.id}
                type="button"
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.26, delay: Math.min(index * 0.03, 0.15), ease: MOTION.enter.ease }}
                whileHover={reduceMotion ? undefined : { y: -4 }}
                onClick={() => void playTrack(track.id)}
                className="group min-w-0 text-left"
              >
                <div className="relative aspect-square overflow-hidden rounded-[13px] bg-[var(--surface-1)] ring-1 ring-inset ring-white/[0.045]">
                  <AlbumArtwork
                    artworkKey={track.artworkKey}
                    alt={`${track.title} artwork`}
                    className="size-full transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                  />
                  <span className="absolute bottom-3 right-3 grid size-9 translate-y-2 place-items-center rounded-full bg-white text-black opacity-0 shadow-xl transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                    <Play className="ml-0.5 size-3.5 fill-current" />
                  </span>
                </div>
                <p className="mt-3 truncate text-[11px] font-semibold text-white/80">{track.title}</p>
                <p className="mt-1 truncate text-[9px] text-white/24">{track.artistName}</p>
              </motion.button>
            ))}
          </div>
        </section>
      )}
    </PageFrame>
  );
}

function EmptyState({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.003 }}
      whileTap={{ scale: 0.997 }}
      onClick={onClick}
      className="flex min-h-28 w-full items-center justify-center rounded-[11px] border border-dashed border-white/[0.07] bg-[var(--surface-1)] text-[10px] text-white/26 transition-colors hover:border-white/[0.12] hover:text-white/52"
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
