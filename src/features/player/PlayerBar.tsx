import type { ReactNode } from "react";
import { Pause, Play, Repeat2, Shuffle, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { motion } from "motion/react";
import { CoverArt } from "../../components/ui/CoverArt";
import { usePlayerStore } from "./player.store";

export function PlayerBar() {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const playing = usePlayerStore((state) => state.playing);
  const positionMs = usePlayerStore((state) => state.positionMs);
  const volume = usePlayerStore((state) => state.volume);
  const muted = usePlayerStore((state) => state.muted);
  const shuffle = usePlayerStore((state) => state.shuffle);
  const repeat = usePlayerStore((state) => state.repeat);
  const togglePlayback = usePlayerStore((state) => state.togglePlayback);
  const setVolume = usePlayerStore((state) => state.setVolume);
  const toggleMute = usePlayerStore((state) => state.toggleMute);
  const toggleShuffle = usePlayerStore((state) => state.toggleShuffle);
  const cycleRepeat = usePlayerStore((state) => state.cycleRepeat);

  const progress = currentTrack.durationMs ? Math.min(100, (positionMs / currentTrack.durationMs) * 100) : 0;

  return (
    <footer className="fixed inset-x-0 bottom-0 z-40 h-24 border-t border-white/[0.08] bg-[#10161a]/90 shadow-[0_-20px_60px_rgba(0,0,0,.35)] backdrop-blur-2xl">
      <div className="grid h-full grid-cols-[minmax(190px,1fr)_minmax(300px,1.35fr)_minmax(180px,1fr)] items-center gap-4 px-3 md:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <CoverArt artworkKey={currentTrack.artworkKey} animated={false} className="size-12 shrink-0 rounded-xl border border-white/10" />
          <div className="min-w-0">
            <motion.p key={currentTrack.id} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="truncate text-[11px] font-bold text-white">
              {currentTrack.title}
            </motion.p>
            <p className="truncate text-[9px] font-medium text-white/40">{currentTrack.artistName}</p>
          </div>
        </div>

        <div className="flex min-w-0 flex-col items-center">
          <div className="flex items-center gap-4 text-white/50">
            <ControlButton active={shuffle} label="Shuffle" onClick={toggleShuffle}><Shuffle className="size-3.5" /></ControlButton>
            <ControlButton label="Previous"><SkipBack className="size-4" /></ControlButton>
            <motion.button
              type="button"
              aria-label={playing ? "Pause" : "Play"}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 500, damping: 24 }}
              onClick={togglePlayback}
              className="grid size-10 place-items-center rounded-full bg-mint-300 text-[#07110d] shadow-[0_0_30px_rgba(120,255,204,.28)]"
            >
              {playing ? <Pause className="size-4 fill-current" /> : <Play className="ml-0.5 size-4 fill-current" />}
            </motion.button>
            <ControlButton label="Next"><SkipForward className="size-4" /></ControlButton>
            <ControlButton active={repeat !== "off"} label={`Repeat ${repeat}`} onClick={cycleRepeat}>
              <Repeat2 className="size-3.5" />
              {repeat === "one" && <span className="absolute -right-1 -top-1 text-[7px] font-bold text-mint-300">1</span>}
            </ControlButton>
          </div>

          <div className="mt-2 flex w-full max-w-[560px] items-center gap-2 text-[7px] font-semibold tabular-nums text-white/32">
            <span>0:00</span>
            <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/10">
              <motion.div className="absolute inset-y-0 left-0 rounded-full bg-white/45" animate={{ width: `${progress}%` }} transition={{ type: "spring", stiffness: 160, damping: 24 }} />
            </div>
            <span>{formatDuration(currentTrack.durationMs)}</span>
          </div>
        </div>

        <div className="ml-auto flex w-full max-w-[190px] items-center justify-end gap-2">
          <button type="button" aria-label={muted ? "Unmute" : "Mute"} onClick={toggleMute} className="text-white/55 transition-colors hover:text-white">
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
          <input
            aria-label="Volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={muted ? 0 : volume}
            onChange={(event) => setVolume(Number(event.currentTarget.value))}
            className="volume-slider w-full"
          />
        </div>
      </div>
    </footer>
  );
}

function ControlButton({ children, label, active = false, onClick }: { children: ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      title={label}
      whileHover={{ scale: 1.13 }}
      whileTap={{ scale: 0.88 }}
      onClick={onClick}
      className={`relative transition-colors ${active ? "text-mint-300" : "hover:text-white"}`}
    >
      {children}
    </motion.button>
  );
}

function formatDuration(durationMs: number) {
  const seconds = Math.round(durationMs / 1000);
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}
