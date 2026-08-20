import { create } from "zustand";
import type { RepeatMode, Track } from "../../lib/contracts/domain";
import { demoTracks } from "../../lib/demo/library";

interface PlayerStore {
  currentTrack: Track;
  playing: boolean;
  positionMs: number;
  volume: number;
  muted: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  playTrack: (track: Track) => void;
  togglePlayback: () => void;
  seek: (positionMs: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
}

const repeatOrder: RepeatMode[] = ["off", "all", "one"];

export const usePlayerStore = create<PlayerStore>((set) => ({
  currentTrack: demoTracks[0],
  playing: true,
  positionMs: 0,
  volume: 0.72,
  muted: false,
  shuffle: false,
  repeat: "off",
  playTrack: (track) => set({ currentTrack: track, playing: true, positionMs: 0 }),
  togglePlayback: () => set((state) => ({ playing: !state.playing })),
  seek: (positionMs) => set({ positionMs }),
  setVolume: (volume) => set({ volume: Math.min(1, Math.max(0, volume)), muted: false }),
  toggleMute: () => set((state) => ({ muted: !state.muted })),
  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
  cycleRepeat: () =>
    set((state) => {
      const index = repeatOrder.indexOf(state.repeat);
      return { repeat: repeatOrder[(index + 1) % repeatOrder.length] };
    }),
}));
