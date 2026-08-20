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
        initial={reduceMotion ? false : { opacity: 0, y: 9 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...MOTION.section, delay: 0.04 }}
        className="home-hero relative mt-6 overflow-hidden rounded-[18px] border border-[var(--line)] bg-[var(--surface-1)]"
      >
        {heroArtwork && (
          <img
            src={heroArtwork}
            alt=""
            aria-hidden
            className="home-hero-ambient pointer-events-none absolute rounded-full object-cover"
          />
        )}

        <div className="home-hero-grid relative grid items-center">
          <div className="min-w-0 max-w-[720px]">
            <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-white/26">
              {featured ? "Now playing" : "On this device"}
            </p>

            <motion.h2
              key={featured?.id ?? "empty"}
              initial={reduceMotion ? false : { opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...MOTION.enter, delay: 0.07 }}
              className="home-hero-title mt-4 max-w-[720px] font-semibold leading-[0.95] tracking-[-0.068em] text-white"
            >
              {featured?.title ?? "Your music. Nothing else."}
            </motion.h2>

            <p className="mt-4 max-w-xl text-[10px] leading-5 text-white/36">
              {featured
                ? `${featured.artistName}${featured.albumTitle ? ` · ${featured.albumTitle}` : ""}`
                : "A native local player that stays quiet until you need it."}
            </p>

            <div className="mt-6 flex items-center gap-2.5">
              <motion.button
                type="button"
                whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={MOTION.spring}
                onClick={() => featured ? void playTrack(featured.id) : void chooseFolder()}
                className="flex h-9 items-center gap-2 rounded-full bg-[var(--accent)] px-4 text-[10px] font-bold text-black"
              >
                {featured ? <Play className="size-3.5 fill-current" /> : <FolderPlus className="size-3.5" />}
                {featured ? "Play" : "Add music"}
              </motion.button>

              <motion.button
                type="button"
                whileHover={reduceMotion ? undefined : { y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setPage("library")}
                className="flex h-9 items-center gap-2 rounded-full border border-[var(--line)] bg-black/20 px-4 text-[10px] font-medium text-white/46 transition-colors hover:bg-white/[0.035] hover:text-white/78"
              >
                <Library className="size-3.5" />
                Library
              </motion.button>
            </div>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 10, scale: 0.975 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ ...MOTION.softSpring, delay: 0.08 }}
            whileHover={reduceMotion ? undefined : { y: -2, scale: 1.008 }}
            className="home-hero-art relative mx-auto aspect-square w-full"
          >
            <AlbumArtwork
              artworkKey={featured?.artworkKey ?? "localtify-home-hero"}
              alt={featured ? `${featured.title} artwork` : "Localtify artwork"}
              className="artwork-glow-target relative size-full rounded-[15px] ring-1 ring-inset ring-white/[0.065]"
            />
          </motion.div>
        </div>
      </motion.section>

      {(libraryError || playerError) && (
        <div className="mt-4 rounded-[10px] border border-red-400/15 bg-red-500/[0.06] px-3 py-2 text-[10px] text-red-200/80">
          {libraryError ?? playerError}
        </div>
      )}

      <section className="performance-section home-section">
        <SectionHeading title="Quick picks" meta={quickPicks.length ? "From your library" : "Nothing here yet"} />
        {quickPicks.length ? (
          <div className="quick-picks-grid grid gap-2.5">
            {quickPicks.map((track, index) => (
              <motion.button
                key={track.id}
                type="button"
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: Math.min(index * 0.025, 0.12), ease: MOTION.enter.ease }}
                whileHover={reduceMotion ? undefined : { y: -1 }}
                whileTap={{ scale: 0.994 }}
                onClick={() => void playTrack(track.id)}
                className="group flex h-[58px] min-w-0 items-center overflow-hidden rounded-[10px] border border-[var(--line)] bg-[var(--surface-1)] text-left transition-colors hover:bg-[var(--surface-2)]"
              >
                <AlbumArtwork artworkKey={track.artworkKey} alt={`${track.title} artwork`} className="size-[58px] shrink-0" />
                <span className="min-w-0 px-3">
                  <span className="block truncate text-[10px] font-semibold text-white/82">{track.title}</span>
                  <span className="mt-1 block truncate text-[8px] text-white/24">{track.artistName}</span>
                </span>
                <span className="ml-auto mr-3 grid size-7 shrink-0 place-items-center rounded-full bg-white text-black opacity-0 transition-opacity duration-150 group-hover:opacity-100">
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
        <section className="performance-section home-section">
          <SectionHeading title="Recently added" meta={`${recentTracks.length} covers`} />
          <div className="recent-covers-grid grid gap-4">
            {recentTracks.map((track, index) => (
              <motion.button
                key={track.id}
                type="button"
                initial={reduceMotion ? false : { opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, delay: Math.min(index * 0.025, 0.12), ease: MOTION.enter.ease }}
                whileHover={reduceMotion ? undefined : { y: -3 }}
                onClick={() => void playTrack(track.id)}
                className="group min-w-0 text-left"
              >
                <div className="relative aspect-square overflow-hidden rounded-[12px] bg-[var(--surface-1)] ring-1 ring-inset ring-white/[0.045]">
                  <AlbumArtwork
                    artworkKey={track.artworkKey}
                    alt={`${track.title} artwork`}
                    className="size-full transition-transform duration-250 ease-out group-hover:scale-[1.015]"
                  />
                  <span className="absolute bottom-2.5 right-2.5 grid size-8 translate-y-1 place-items-center rounded-full bg-white text-black opacity-0 transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100">
                    <Play className="ml-0.5 size-3 fill-current" />
                  </span>
                </div>
                <p className="mt-2.5 truncate text-[10px] font-semibold text-white/78">{track.title}</p>
                <p className="mt-1 truncate text-[8px] text-white/22">{track.artistName}</p>
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
      whileHover={{ scale: 1.002 }}
      whileTap={{ scale: 0.998 }}
      onClick={onClick}
      className="flex min-h-24 w-full items-center justify-center rounded-[10px] border border-dashed border-white/[0.07] bg-[var(--surface-1)] text-[9px] text-white/25 transition-colors hover:border-white/[0.12] hover:text-white/50"
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
