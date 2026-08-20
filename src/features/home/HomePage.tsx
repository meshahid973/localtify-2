import { isTauri } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { FolderPlus, Play } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import { albumArtworkFor } from "../../ALBUM";
import { AlbumArtwork } from "../../components/ui/AlbumArtwork";
import { useLibraryStore } from "../library/library.store";
import { useNavigationStore } from "../navigation/navigation.store";
import { usePlayerStore } from "../player/player.store";

const heroMotion = {
  hidden: { opacity: 0, scale: 0.985, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

export function HomePage() {
  const tracks = useLibraryStore((state) => state.tracks);
  const folders = useLibraryStore((state) => state.folders);
  const scanning = useLibraryStore((state) => state.scanning);
  const addFolder = useLibraryStore((state) => state.addFolder);
  const player = usePlayerStore((state) => state.state);
  const playTrack = usePlayerStore((state) => state.playTrack);
  const setPage = useNavigationStore((state) => state.setPage);

  const featured = player.currentTrack ?? tracks[0] ?? null;
  const heroArtwork = featured ? albumArtworkFor(featured.artworkKey) : null;
  const listenNow = tracks.slice(0, 8);

  const artists = useMemo(() => {
    const map = new Map<string, { name: string; artworkKey: string; count: number }>();
    for (const track of tracks) {
      const key = track.artistName.trim() || "Unknown artist";
      const entry = map.get(key);
      if (entry) {
        entry.count += 1;
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
    <main className="mx-auto w-full max-w-[1680px] px-6 pb-14 pt-7 lg:px-10">
      <header className="flex items-center gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">Local library</p>
          <h1 className="mt-1 text-[34px] font-semibold tracking-[-0.055em] text-[#f5f5ef]">Home</h1>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden rounded-full border border-white/[0.07] px-3 py-1.5 text-[10px] text-white/35 md:block">
            {tracks.length} tracks · {folders.length} folders
          </span>
          <button
            type="button"
            onClick={() => void chooseFolder()}
            disabled={scanning}
            className="flex h-9 items-center gap-2 rounded-full bg-[#f5f5ef] px-4 text-[11px] font-semibold text-black transition-transform active:scale-[.97] disabled:opacity-50"
          >
            <FolderPlus className="size-3.5" />
            {scanning ? "Scanning…" : "Add music"}
          </button>
        </div>
      </header>

      <motion.section
        variants={heroMotion}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        className="performance-section relative mt-5 min-h-[330px] overflow-hidden rounded-[22px] border border-white/[0.06] bg-[#0b0b0b]"
      >
        {heroArtwork && (
          <motion.img
            key={heroArtwork}
            src={heroArtwork}
            alt=""
            fetchPriority="high"
            initial={{ opacity: 0, scale: 1.035 }}
            animate={{ opacity: 0.56, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 size-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.88)_0%,rgba(0,0,0,.64)_43%,rgba(0,0,0,.22)_72%,rgba(0,0,0,.35)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,.48),transparent_55%)]" />

        <div className="relative flex min-h-[330px] max-w-3xl flex-col justify-end p-7 md:p-10">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#78e8a0]">
            {featured ? "Featured from your library" : "Native · OLED · Local"}
          </p>
          <motion.h2
            key={featured?.id ?? "empty"}
            initial={{ opacity: 0, y: 9 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            className="mt-3 line-clamp-2 text-[clamp(2.7rem,5.6vw,5.5rem)] font-semibold leading-[0.91] tracking-[-0.065em] text-[#f7f7f2]"
          >
            {featured?.title ?? "Your music, without the noise."}
          </motion.h2>
          <p className="mt-4 max-w-xl truncate text-sm text-white/55">
            {featured ? `${featured.artistName}${featured.albumTitle ? ` · ${featured.albumTitle}` : ""}` : "Add a folder and Localtify builds the library on-device."}
          </p>

          <div className="mt-6 flex items-center gap-3">
            {featured ? (
              <motion.button
                type="button"
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.965 }}
                transition={{ type: "spring", stiffness: 420, damping: 28 }}
                onClick={() => void playTrack(featured.id)}
                className="flex h-10 items-center gap-2 rounded-full bg-[#f5f5ef] px-5 text-[11px] font-bold text-black"
              >
                <Play className="size-3.5 fill-current" />
                Start listening
              </motion.button>
            ) : (
              <button
                type="button"
                onClick={() => void chooseFolder()}
                className="rounded-full bg-[#f5f5ef] px-5 py-3 text-[11px] font-bold text-black"
              >
                Add your first folder
              </button>
            )}
            <button
              type="button"
              onClick={() => setPage("library")}
              className="rounded-full border border-white/[0.1] bg-black/30 px-4 py-2.5 text-[11px] font-medium text-white/65 transition-colors hover:bg-white/[0.07] hover:text-white"
            >
              View library
            </button>
          </div>
        </div>
      </motion.section>

      <section className="performance-section mt-9">
        <SectionHeader title="Listen now" meta={listenNow.length ? "Quick picks" : "No tracks yet"} />
        {listenNow.length ? (
          <div className="grid gap-2.5 lg:grid-cols-2 2xl:grid-cols-4">
            {listenNow.map((track) => (
              <button
                key={track.id}
                type="button"
                onClick={() => void playTrack(track.id)}
                className="group flex min-w-0 items-center overflow-hidden rounded-xl border border-white/[0.055] bg-[#0d0d0d] text-left transition-[background,border-color,transform] duration-200 hover:-translate-y-[1px] hover:border-white/[0.1] hover:bg-[#151515]"
              >
                <AlbumArtwork artworkKey={track.artworkKey} alt={`${track.title} artwork`} className="size-[58px] shrink-0" />
                <span className="min-w-0 px-3">
                  <span className="block truncate text-[12px] font-semibold text-[#ededeb]">{track.title}</span>
                  <span className="mt-1 block truncate text-[10px] text-white/35">{track.artistName}</span>
                </span>
                <span className="ml-auto mr-3 grid size-7 shrink-0 translate-x-1 place-items-center rounded-full bg-[#1ed760] text-black opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                  <Play className="ml-0.5 size-3 fill-current" />
                </span>
              </button>
            ))}
          </div>
        ) : (
          <EmptyState onClick={() => void chooseFolder()} />
        )}
      </section>

      {artists.length > 0 && (
        <section className="performance-section mt-10">
          <SectionHeader title="Top artists" meta={`${artists.length} shown`} />
          <div className="hide-scrollbar flex gap-5 overflow-x-auto pb-2">
            {artists.map((artist) => (
              <button key={artist.name} type="button" className="group w-[122px] shrink-0 text-left">
                <div className="relative aspect-square overflow-hidden rounded-full border border-white/[0.07] bg-[#111]">
                  <AlbumArtwork artworkKey={artist.artworkKey} alt="" className="size-full transition-transform duration-300 group-hover:scale-[1.035]" />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                </div>
                <p className="mt-3 truncate text-center text-[12px] font-semibold text-white/80">{artist.name}</p>
                <p className="mt-1 text-center text-[9px] text-white/28">{artist.count} tracks</p>
              </button>
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
      <h3 className="text-[24px] font-semibold tracking-[-0.045em] text-[#f5f5ef]">{title}</h3>
      <span className="pb-1 text-[10px] text-white/28">{meta}</span>
    </div>
  );
}

function EmptyState({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-32 w-full items-center justify-center rounded-xl border border-dashed border-white/[0.09] bg-[#090909] text-[12px] text-white/40 transition-colors hover:border-white/[0.16] hover:text-white/70"
    >
      Add music to build Listen now
    </button>
  );
}
