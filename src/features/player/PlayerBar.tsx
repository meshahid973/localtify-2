import type { CSSProperties, ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play, Repeat2, Shuffle, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { AlbumArtwork } from "../../components/ui/AlbumArtwork";
import { formatDuration } from "../../lib/format";
import { MOTION } from "../../lib/motion";
import { useLibraryStore } from "../library/library.store";
import { useSettingsStore } from "../settings/settings.store";
import { usePlayerStore } from "./player.store";

export function PlayerBar() {
  const tracks = useLibraryStore((state) => state.tracks);
  const player = usePlayerStore((store) => store.state);
  const playerStyle = useSettingsStore((state) => state.playerStyle);
  const playTrack = usePlayerStore((store) => store.playTrack);
  const togglePlayback = usePlayerStore((store) => store.togglePlayback);
  const seek = usePlayerStore((store) => store.seek);
  const setVolume = usePlayerStore((store) => store.setVolume);
  const toggleMute = usePlayerStore((store) => store.toggleMute);
  const toggleShuffle = usePlayerStore((store) => store.toggleShuffle);
  const cycleRepeat = usePlayerStore((store) => store.cycleRepeat);

  const current = player.currentTrack;
  const playing = player.status === "playing";
  const progress = player.durationMs ? Math.min(100, (player.positionMs / player.durationMs) * 100) : 0;
  const volumePercent = (player.muted ? 0 : player.volume) * 100;

  function playAdjacent(direction: -1 | 1) {
    if (!tracks.length) return;
    if (player.shuffle) {
      const random = tracks[Math.floor(Math.random() * tracks.length)];
      if (random) void playTrack(random.id);
      return;
    }
    const currentIndex = current ? tracks.findIndex((track) => track.id === current.id) : -1;
    const base = currentIndex < 0 ? 0 : currentIndex;
    const nextIndex = (base + direction + tracks.length) % tracks.length;
    const next = tracks[nextIndex];
    if (next) void playTrack(next.id);
  }

  const floating = playerStyle === "floating";

  return (
    <footer className={`fixed inset-x-0 bottom-0 z-40 h-[var(--player-height)] bg-black ${floating ? "px-2 pb-2 pt-1.5" : "p-0"}`}>
      <div className={`grid h-full grid-cols-[minmax(210px,1fr)_minmax(340px,1.3fr)_minmax(160px,.9fr)] items-center gap-5 border border-[var(--line)] bg-[var(--surface-1)] px-3.5 ${floating ? "rounded-[13px] shadow-[0_-10px_36px_rgba(0,0,0,.25)]" : "rounded-none border-x-0 border-b-0"}`}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={current?.id ?? "empty"}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 5 }}
            transition={MOTION.quick}
            className="flex min-w-0 items-center gap-3"
          >
            <AlbumArtwork artworkKey={current?.artworkKey ?? "empty"} className="artwork-glow-target size-11 shrink-0 rounded-[8px] ring-1 ring-inset ring-white/[0.05]" />
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold text-white/86">{current?.title ?? "Nothing playing"}</p>
              <p className="mt-1 truncate text-[8px] text-white/24">{current?.artistName ?? "Choose something from your library"}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex min-w-0 flex-col items-center">
          <div className="flex items-center gap-4 text-white/28">
            <ControlButton active={player.shuffle} label="Shuffle" onClick={() => void toggleShuffle()}>
              <Shuffle className="size-3.5" />
            </ControlButton>
            <ControlButton label="Previous" onClick={() => playAdjacent(-1)}>
              <SkipBack className="size-4 fill-current" />
            </ControlButton>
            <motion.button
              type="button"
              aria-label={playing ? "Pause" : "Play"}
              disabled={!current}
              whileHover={current ? { scale: 1.055 } : undefined}
              whileTap={current ? { scale: 0.94 } : undefined}
              transition={MOTION.spring}
              onClick={() => void togglePlayback()}
              className="grid size-9 place-items-center rounded-full bg-[var(--accent)] text-black disabled:bg-white/18"
            >
              {playing ? <Pause className="size-4 fill-current" /> : <Play className="ml-0.5 size-4 fill-current" />}
            </motion.button>
            <ControlButton label="Next" onClick={() => playAdjacent(1)}>
              <SkipForward className="size-4 fill-current" />
            </ControlButton>
            <ControlButton active={player.repeat !== "off"} label={`Repeat ${player.repeat}`} onClick={() => void cycleRepeat()}>
              <Repeat2 className="size-3.5" />
              {player.repeat === "one" && <span className="absolute -right-1 -top-1 text-[7px] font-bold text-[var(--accent)]">1</span>}
            </ControlButton>
          </div>

          <div className="mt-2 flex w-full max-w-[610px] items-center gap-2 text-[7px] tabular-nums text-white/17">
            <span className="w-9 text-right">{formatDuration(player.positionMs)}</span>
            <input
              aria-label="Playback position"
              type="range"
              min="0"
              max={Math.max(1, player.durationMs)}
              value={Math.min(player.positionMs, Math.max(1, player.durationMs))}
              onChange={(event) => void seek(Number(event.currentTarget.value))}
              style={{ "--progress": `${progress}%` } as CSSProperties}
              className="progress-slider flex-1"
            />
            <span className="w-9">{formatDuration(player.durationMs)}</span>
          </div>
        </div>

        <div className="ml-auto flex w-full max-w-[180px] items-center justify-end gap-2">
          <button
            type="button"
            aria-label={player.muted ? "Unmute" : "Mute"}
            onClick={() => void toggleMute()}
            className="text-white/26 transition-colors hover:text-white/68"
          >
            {player.muted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
          </button>
          <input
            aria-label="Volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={player.muted ? 0 : player.volume}
            onChange={(event) => void setVolume(Number(event.currentTarget.value))}
            style={{ "--progress": `${volumePercent}%` } as CSSProperties}
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
      whileHover={{ scale: 1.07, y: -1 }}
      whileTap={{ scale: 0.93 }}
      transition={MOTION.spring}
      onClick={onClick}
      className={`relative transition-colors ${active ? "text-[var(--accent)]" : "hover:text-white/76"}`}
    >
      {children}
    </motion.button>
  );
}
