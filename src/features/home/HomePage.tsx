import { isTauri } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { FolderPlus, Library, Play } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { albumArtworkFor } from "../../ALBUM";
import { AlbumArtwork } from "../../components/ui/AlbumArtwork";
import { PageFrame, PageHeader, SectionHeading } from "../../components/ui/Page";
import { MOTION } from "../../lib/motion";
import { useLibraryStore } from "../library/library.store";
import { useNavigationStore } from "../navigation/navigation.store";
import { usePlayerStore } from "../player/player.store";
import { useSettingsStore } from "../settings/settings.store";
import { HeroArtworkBackdrop } from "./HeroArtworkBackdrop";

export function HomePage() {
  const reduceMotion = useReducedMotion();
  const tracks = useLibraryStore((state) => state.tracks);
  const folders = useLibraryStore((state) => state.folders);
  const scanning = useLibraryStore((state) => state.scanning);
  const libraryError = useLibraryStore((state) => state.error);
  const addFolder = useLibraryStore((state) => state.addFolder);
  const currentTrack = usePlayerStore((state) => state.state.currentTrack);
  const playerError = usePlayerStore((state) => state.error);
  const playTrack = usePlayerStore((state) => state.playTrack);
  const heroArtworkBackdrop = useSettingsStore((state) => state.heroArtworkBackdrop);
  const setPage = useNavigationStore((state) => state.setPage);

  const featured = currentTrack ?? tracks[0] ?? null;
  const heroArtwork = featured ? albumArtworkFor(featured.artworkKey) : albumArtworkFor("localtify-home-hero");
  const currentArtwork = currentTrack ? albumArtworkFor(currentTrack.artworkKey) : null;
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
            whileHover={reduceMotion ? undefined : { y: -2, scale: 1.015 }}
            whileTap={{ scale: 0.97 }}
            transition={MOTION.spring}
            onClick={() => void chooseFolder()}
            disabled={scanning}
            className="flex h-9 items-center gap-2 rounded-full bg-white px-4 text-[10px] font-semibold text-black shadow-[0_8px_28px_rgba(0,0,0,.22)] disabled:opacity-40"
          >
            <FolderPlus className="size-3.5" />
            {scanning ? "Scanning…" : "Add music"}
          </motion.button>
        }
      />

      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.996 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ ...MOTION.section, delay: 0.04 }}
        className="home-hero relative mt-6 overflow-hidden rounded-[18px] border border-[var(--line)] bg-[var(--surface-1)] shadow-[0_18px_70px_rgba(0,0,0,.20)]"
      >
        <HeroArtworkBackdrop source={currentArtwork} enabled={heroArtworkBackdrop} />

        <div className="home-hero-grid relative z-10 grid items-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={featured?.id ?? "empty"}
              initial={reduceMotion ? false : { opacity: 0, y: 9 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.34, ease: MOTION.enter.ease }}
              className="hero-copy max-w-[760px]"
            >
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">
                {currentTrack ? "Now playing" : featured ? "From your library" : "On this device"}
              </p>

              <h2 className="home-hero-title mt-4 max-w-[760px] font-semibold leading-[0.94] tracking-[-0.07em] text-white">
                {featured?.title ?? "Your music. Nothing else."}
              </h2>

              <p className="mt-5 max-w-xl text-[11px] leading-5 text-white/52">
                {featured
                  ? `${featured.artistName}${featured.albumTitle ? ` · ${featured.albumTitle}` : ""}`
                  : "A native local player that stays quiet until you need it."}
              </p>

              <div className="mt-7 flex items-center gap-3">
                <motion.button
                  type="button"
                  whileHover={reduceMotion ? undefined : { scale: 1.035, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  transition={MOTION.spring}
                  onClick={() => featured ? void playTrack(featured.id) : void chooseFolder()}
                  className="flex h-10 items-center gap-2 rounded-full bg-[var(--accent)] px-5 text-[10px] font-bold text-black shadow-[0_10px_32px_rgba(0,0,0,.30)]"
                >
                  {featured ? <Play className="size-3.5 fill-current" /> : <FolderPlus className="size-3.5" />}
                  {featured ? "Play" : "Add music"}
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={reduceMotion ? undefined : { y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={MOTION.spring}
                  onClick={() => setPage("library")}
                  className="flex h-10 items-center gap-2 rounded-full border border-white/[0.08] bg-black/25 px-4 text-[10px] font-medium text-white/58 backdrop-blur-sm transition-colors hover:bg-white/[0.055] hover:text-white/88"
                >
                  <Library className="size-3.5" />
                  Library
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>

          <motion.div
            key={featured?.artworkKey ?? "empty-art"}
            initial={reduceMotion ? false : { opacity: 0, x: 18, y: 4, scale: 0.94, rotate: 0.8 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
            transition={{ ...MOTION.softSpring, delay: 0.06 }}
            whileHover={reduceMotion ? undefined : { y: -5, scale: 1.015, rotate: -0.35 }}
            className="home-hero-art relative mx-auto hidden aspect-square w-full md:block"
          >
            {heroArtwork && (
              <img
                src={heroArtwork}
                alt=""
                aria-hidden
                className="image-ambience-aura absolute inset-2 size-[calc(100%-16px)] rounded-[18px] object-cover"
              />
            )}
            <AlbumArtwork
              artworkKey={featured?.artworkKey ?? "localtify-home-hero"}
              alt={featured ? `${featured.title} artwork` : "Localtify artwork"}
              eager
              className="relative z-10 size-full rounded-[16px] ring-1 ring-inset ring-white/[0.10] shadow-[0_18px_50px_rgba(0,0,0,.30)]"
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
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.26, delay: Math.min(index * 0.035, 0.16), ease: MOTION.enter.ease }}
                whileHover={reduceMotion ? undefined : { y: -3, scale: 1.003 }}
                whileTap={{ scale: 0.992 }}
                onClick={() => void playTrack(track.id)}
                className="quick-pick-card group flex h-[62px] min-w-0 items-center overflow-hidden rounded-[11px] border border-[var(--line)] bg-[var(--surface-1)] text-left transition-colors hover:border-white/[0.10] hover:bg-[var(--surface-2)]"
              >
                <AlbumArtwork artworkKey={track.artworkKey} alt={`${track.title} artwork`} className="size-[62px] shrink-0 transition-transform duration-300 ease-out group-hover:scale-[1.035]" />
                <span className="min-w-0 px-3">
                  <span className="block truncate text-[11px] font-semibold text-white/86">{track.title}</span>
                  <span className="mt-1 block truncate text-[9px] text-white/28">{track.artistName}</span>
                </span>
                <span className="ml-auto mr-3 grid size-8 shrink-0 translate-y-1 place-items-center rounded-full bg-white text-black opacity-0 shadow-xl transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
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
                initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.28, delay: Math.min(index * 0.035, 0.18), ease: MOTION.enter.ease }}
                whileHover={reduceMotion ? undefined : { y: -5, scale: 1.006 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => void playTrack(track.id)}
                className="recent-cover-card group min-w-0 text-left"
              >
                <div className="relative aspect-square overflow-hidden rounded-[13px] bg-[var(--surface-1)] ring-1 ring-inset ring-white/[0.055]">
                  <AlbumArtwork
                    artworkKey={track.artworkKey}
                    alt={`${track.title} artwork`}
                    className="size-full transition-transform duration-300 ease-out group-hover:scale-[1.035]"
                  />
                  <span className="absolute bottom-3 right-3 grid size-9 translate-y-2 place-items-center rounded-full bg-white text-black opacity-0 shadow-xl transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
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
