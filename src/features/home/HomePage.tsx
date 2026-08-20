import { Search, Shuffle } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { CoverArt } from "../../components/ui/CoverArt";
import { coverShelf, demoTracks } from "../../lib/demo/library";
import { usePlayerStore } from "../player/player.store";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export function HomePage() {
  const reduceMotion = useReducedMotion();
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const playTrack = usePlayerStore((state) => state.playTrack);
  const toggleShuffle = usePlayerStore((state) => state.toggleShuffle);

  return (
    <motion.main
      variants={container}
      initial={reduceMotion ? false : "hidden"}
      animate="show"
      className="min-h-full px-5 pb-7 pt-5 lg:px-7"
    >
      <motion.header variants={item} className="flex items-center gap-4 border-b border-white/10 pb-4">
        <h1 className="text-[clamp(1.7rem,3vw,2.8rem)] font-bold tracking-[-0.065em] text-white">
          good evening<span className="ml-1 text-white/20">.</span>
        </h1>
        <div className="ml-auto hidden w-[min(310px,33vw)] items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-white/40 shadow-inner md:flex">
          <Search className="size-3.5" />
          <input
            aria-label="Search"
            placeholder="search songs, try feedback"
            className="w-full bg-transparent text-[11px] font-medium text-white/80 outline-none placeholder:text-white/35"
          />
        </div>
      </motion.header>

      <motion.section
        variants={item}
        className="relative mt-4 min-h-[250px] overflow-hidden rounded-[22px] border border-mint-300/15 bg-[#0a1014] shadow-[0_30px_100px_rgba(0,0,0,.25)]"
      >
        <motion.div
          aria-hidden
          className="absolute -left-[12%] -top-[70%] h-[220%] w-[74%] rounded-full bg-white/20 blur-[90px]"
          animate={!reduceMotion ? { x: [0, 80, 0], opacity: [0.12, 0.2, 0.12] } : undefined}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-40 right-[-5%] size-[420px] rounded-full bg-blue-700/35 blur-[95px]"
          animate={!reduceMotion ? { scale: [1, 1.12, 1] } : undefined}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative z-10 flex h-full min-h-[250px] items-center gap-8 px-8 py-7 md:px-10">
          <div className="min-w-0 flex-1">
            <p className="mb-3 text-[8px] font-bold uppercase tracking-[0.24em] text-mint-300">now playing</p>
            <motion.h2
              key={currentTrack.id}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-[720px] text-[clamp(2.2rem,5vw,4.6rem)] font-bold leading-[0.92] tracking-[-0.07em] text-white"
            >
              {currentTrack.title}
            </motion.h2>
            <p className="mt-8 text-sm font-semibold text-white/70">{currentTrack.artistName}</p>
            <div className="mt-5 flex gap-2">
              <span className="rounded-full border border-mint-300/20 bg-mint-300/10 px-3 py-1 text-[9px] font-bold text-mint-200">compact player</span>
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[9px] font-bold text-white/50">covers</span>
            </div>
          </div>

          <motion.div
            key={currentTrack.artworkKey}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.92, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
            className="hidden shrink-0 md:block"
          >
            <CoverArt
              artworkKey={currentTrack.artworkKey}
              className="size-[clamp(150px,17vw,220px)] rounded-[22px] border border-white/15 shadow-[0_25px_80px_rgba(0,0,0,.45)]"
            />
          </motion.div>
        </div>
      </motion.section>

      <motion.section variants={item} className="mt-3 rounded-[20px] border border-white/[0.07] bg-[#070a10]/76 p-3 shadow-[0_20px_70px_rgba(0,0,0,.18)]">
        <div className="flex items-end border-b border-white/[0.08] pb-3">
          <div>
            <p className="text-[7px] font-bold uppercase tracking-[0.22em] text-mint-300">local picks</p>
            <h3 className="mt-1 text-2xl font-bold tracking-[-0.055em] text-white">Listen now</h3>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-[9px] font-semibold text-white/35">{demoTracks.length * 8 + 3} playable</span>
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={toggleShuffle}
              className="flex items-center gap-1.5 rounded-full bg-mint-300 px-3 py-1.5 text-[9px] font-bold text-[#07110d] shadow-[0_0_24px_rgba(120,255,204,.18)]"
            >
              <Shuffle className="size-3" />
              shuffle library
            </motion.button>
          </div>
        </div>

        <div className="mt-2 grid gap-2 lg:grid-cols-2 2xl:grid-cols-4">
          {demoTracks.map((track, index) => {
            const active = track.id === currentTrack.id;
            return (
              <motion.button
                key={track.id}
                type="button"
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + index * 0.035 }}
                whileHover={reduceMotion ? undefined : { y: -2, scale: 1.006 }}
                whileTap={{ scale: 0.992 }}
                onClick={() => playTrack(track)}
                className={`group flex min-w-0 items-center overflow-hidden rounded-xl border text-left transition-colors ${
                  active
                    ? "border-mint-300/25 bg-white/[0.08]"
                    : "border-white/[0.08] bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.045]"
                }`}
              >
                <CoverArt artworkKey={track.artworkKey} animated={false} className="size-11 shrink-0" />
                <span className="min-w-0 flex-1 px-2.5">
                  <span className="block truncate text-[10px] font-bold text-white/90">{track.title}</span>
                  <span className="block truncate text-[8px] font-medium text-white/38">{track.artistName}</span>
                </span>
                <span className="px-3 text-[8px] font-semibold tabular-nums text-white/45">{formatDuration(track.durationMs)}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      <motion.section variants={item} className="mt-3 rounded-[20px] border border-white/[0.08] bg-[linear-gradient(115deg,#08100f,#090c13_60%,#07080c)] p-4">
        <div className="border-b border-white/[0.09] pb-2">
          <p className="text-[7px] font-bold uppercase tracking-[0.22em] text-mint-300">fresh shelf</p>
          <h3 className="mt-0.5 text-2xl font-bold tracking-[-0.055em] text-white">recent covers</h3>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7 2xl:grid-cols-10">
          {coverShelf.map((cover, index) => (
            <motion.button
              key={`${cover}-${index}`}
              type="button"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.18 + index * 0.035 }}
              whileHover={reduceMotion ? undefined : { y: -5, scale: 1.025 }}
              whileTap={{ scale: 0.98 }}
              className="group relative aspect-square overflow-hidden rounded-[16px] border border-white/[0.08] shadow-[0_16px_35px_rgba(0,0,0,.22)]"
            >
              <CoverArt artworkKey={cover} animated={false} className="absolute inset-0" />
              <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.button>
          ))}
        </div>
      </motion.section>
    </motion.main>
  );
}

function formatDuration(durationMs: number) {
  const seconds = Math.round(durationMs / 1000);
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}
