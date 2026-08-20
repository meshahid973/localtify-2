import type { CSSProperties, ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play, Repeat2, Shuffle, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { albumArtworkFor } from "../../ALBUM";
import { AlbumArtwork } from "../../components/ui/AlbumArtwork";
import { formatDuration } from "../../lib/format";
import { MOTION } from "../../lib/motion";
import { Pressable } from "../../ui/motion/Pressable";
import { useLibraryStore } from "../library/library.store";
import { useSettingsStore } from "../settings/settings.store";
import { usePlaybackClock } from "./usePlaybackClock";
import { usePlayerStore } from "./player.store";

export function PlayerBar() {
  const tracks = useLibraryStore((state) => state.tracks);
  const current = usePlayerStore((store) => store.state.currentTrack);
  const status = usePlayerStore((store) => store.state.status);
  const serverPositionMs = usePlayerStore((store) => store.state.positionMs);
  const durationMs = usePlayerStore((store) => store.state.durationMs);
  const volume = usePlayerStore((store) => store.state.volume);
  const muted = usePlayerStore((store) => store.state.muted);
  const shuffle = usePlayerStore((store) => store.state.shuffle);
  const repeat = usePlayerStore((store) => store.state.repeat);
  const playerStyle = useSettingsStore((state) => state.playerStyle);
  const playerArtworkBackdrop = useSettingsStore((state) => state.playerArtworkBackdrop);
  const playTrack = usePlayerStore((store) => store.playTrack);
  const togglePlayback = usePlayerStore((store) => store.togglePlayback);
  const seek = usePlayerStore((store) => store.seek);
  const setVolume = usePlayerStore((store) => store.setVolume);
  const toggleMute = usePlayerStore((store) => store.toggleMute);
  const toggleShuffle = usePlayerStore((store) => store.toggleShuffle);
  const cycleRepeat = usePlayerStore((store) => store.cycleRepeat);

  const currentArtwork = current ? albumArtworkFor(current.artworkKey) : null;
  const playing = status === "playing";
  const visualPositionMs = usePlaybackClock(serverPositionMs, playing, durationMs);
  const progress = durationMs ? Math.min(100, (visualPositionMs / durationMs) * 100) : 0;
  const volumePercent = (muted ? 0 : volume) * 100;

  function playAdjacent(direction: -1 | 1) {
    if (!tracks.length) return;
    if (shuffle) {
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
    <footer className={`fixed inset-x-0 bottom-0 z-40 h-[var(--player-height)] bg-[var(--app-bg)] ${floating ? "px-2 pb-2 pt-1.5" : "p-0"}`}>
      <div className={`player-shell themed-player relative grid h-full items-center overflow-hidden border border-[var(--line)] bg-[var(--ui-player-bg)] px-3.5 ${floating ? "rounded-[13px] shadow-[0_-10px_36px_rgba(0,0,0,.25)]" : "rounded-none border-x-0 border-b-0"}`}>
        <AnimatePresence initial={false} mode="wait">
          {playerArtworkBackdrop && currentArtwork && current && (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 1.015 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01 }}
              transition={{ duration: 0.32, ease: MOTION.enter.ease }}
              className="pointer-events-none absolute inset-0 overflow-hidden"
              aria-hidden
            >
              <img src={currentArtwork} alt="" className="player-artwork-backdrop absolute object-cover" />
              <div className="player-artwork-vignette absolute inset-0" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={current?.id ?? "empty"}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 5 }}
            transition={MOTION.quick}
            className="player-track relative z-10 flex min-w-0 items-center gap-3"
          >
            <div className="relative size-11 shrink-0">
              {currentArtwork && <img src={currentArtwork} alt="" aria-hidden className="image-ambience-aura absolute inset-1 size-9 rounded-[8px] object-cover" />}
              <AlbumArtwork artworkKey={current?.artworkKey ?? "empty"} eager className="relative z-10 size-11 rounded-[8px] ring-1 ring-inset ring-white/[0.06]" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold text-white/88">{current?.title ?? "Nothing playing"}</p>
              <p className="mt-1 truncate text-[8px] text-white/30">{current?.artistName ?? "Choose something from your library"}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="player-controls relative z-10 flex min-w-0 flex-col items-center">
          <div className="flex items-center gap-4 text-white/34">
            <ControlButton active={shuffle} label="Shuffle" onClick={() => void toggleShuffle()}>
              <Shuffle className="size-3.5" />
            </ControlButton>
            <ControlButton label="Previous" onClick={() => playAdjacent(-1)}>
              <SkipBack className="size-4 fill-current" />
            </ControlButton>
            <Pressable
              ariaLabel={playing ? "Pause" : "Play"}
              disabled={!current}
              strength="strong"
              onClick={() => void togglePlayback()}
              className="grid size-9 place-items-center rounded-full bg-[var(--accent)] text-black shadow-[0_6px_22px_rgba(0,0,0,.24)] disabled:bg-white/18"
            >
              <span className="relative z-10">
                {playing ? <Pause className="size-4 fill-current" /> : <Play className="ml-0.5 size-4 fill-current" />}
              </span>
            </Pressable>
            <ControlButton label="Next" onClick={() => playAdjacent(1)}>
              <SkipForward className="size-4 fill-current" />
            </ControlButton>
            <ControlButton active={repeat !== "off"} label={`Repeat ${repeat}`} onClick={() => void cycleRepeat()}>
              <Repeat2 className="size-3.5" />
              {repeat === "one" && <span className="absolute -right-1 -top-1 text-[7px] font-bold text-[var(--accent)]">1</span>}
            </ControlButton>
          </div>

          <div className="mt-2 flex w-full max-w-[560px] items-center gap-2 text-[7px] tabular-nums text-white/22">
            <span className="w-9 text-right">{formatDuration(visualPositionMs)}</span>
            <input
              aria-label="Playback position"
              type="range"
              min="0"
              max={Math.max(1, durationMs)}
              value={Math.min(visualPositionMs, Math.max(1, durationMs))}
              onChange={(event) => void seek(Number(event.currentTarget.value))}
              style={{ "--progress": `${progress}%` } as CSSProperties}
              className="progress-slider flex-1"
            />
            <span className="w-9">{formatDuration(durationMs)}</span>
          </div>
        </div>

        <div className="player-volume relative z-10 ml-auto flex w-full max-w-[170px] items-center justify-end gap-2">
          <Pressable
            ariaLabel={muted ? "Unmute" : "Mute"}
            strength="subtle"
            flash={false}
            onClick={() => void toggleMute()}
            className="text-white/34 transition-colors hover:text-white/76"
          >
            <span className="relative z-10">{muted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}</span>
          </Pressable>
          <input
            aria-label="Volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={muted ? 0 : volume}
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
    <Pressable
      ariaLabel={label}
      title={label}
      strength="medium"
      onClick={onClick}
      className={`relative transition-colors ${active ? "text-[var(--accent)]" : "hover:text-white/80"}`}
    >
      <span className="relative z-10">{children}</span>
    </Pressable>
  );
}
