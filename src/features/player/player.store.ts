import { create } from "zustand";
import type { PlayerState, RepeatMode, Track } from "../../lib/contracts/domain";
import { playerApi } from "../../lib/ipc/player-api";

const EMPTY_PLAYER: PlayerState = {
  status: "stopped",
  currentTrack: null,
  positionMs: 0,
  durationMs: 0,
  volume: 0.72,
  muted: false,
  shuffle: false,
  repeat: "off",
};

interface PlayerStore {
  state: PlayerState;
  error: string | null;
  hydrate: () => Promise<void>;
  sync: () => Promise<void>;
  playTrack: (trackId: string) => Promise<void>;
  togglePlayback: () => Promise<void>;
  seek: (positionMs: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  toggleMute: () => Promise<void>;
  toggleShuffle: () => Promise<void>;
  cycleRepeat: () => Promise<void>;
}

type StorePatch = Partial<PlayerStore> | ((store: PlayerStore) => Partial<PlayerStore>);
type StoreSetter = (patch: StorePatch) => void;

const repeatOrder: RepeatMode[] = ["off", "all", "one"];

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  state: EMPTY_PLAYER,
  error: null,

  hydrate: async () => run(set, playerApi.state()),
  sync: async () => run(set, playerApi.state(), false),
  playTrack: async (trackId) => run(set, playerApi.play(trackId)),
  togglePlayback: async () => run(set, playerApi.toggle()),
  seek: async (positionMs) => {
    set((store) => ({ state: { ...store.state, positionMs } }));
    await run(set, playerApi.seek(positionMs));
  },
  setVolume: async (volume) => {
    const normalized = Math.min(1, Math.max(0, volume));
    set((store) => ({ state: { ...store.state, volume: normalized, muted: false } }));
    await run(set, playerApi.setVolume(normalized));
  },
  toggleMute: async () => run(set, playerApi.toggleMute()),
  toggleShuffle: async () => run(set, playerApi.setShuffle(!get().state.shuffle)),
  cycleRepeat: async () => {
    const current = get().state.repeat;
    const next = repeatOrder[(repeatOrder.indexOf(current) + 1) % repeatOrder.length];
    await run(set, playerApi.setRepeat(next));
  },
}));

async function run(set: StoreSetter, request: Promise<PlayerState>, reportError = true) {
  try {
    const next = await request;
    set((store) => ({ state: reconcilePlayerState(store.state, next), error: null }));
  } catch (error) {
    if (reportError) set({ error: errorMessage(error) });
  }
}

function reconcilePlayerState(previous: PlayerState, next: PlayerState): PlayerState {
  const currentTrack = sameTrack(previous.currentTrack, next.currentTrack) ? previous.currentTrack : next.currentTrack;
  const reconciled = { ...next, currentTrack };

  if (
    previous.status === reconciled.status &&
    previous.currentTrack === reconciled.currentTrack &&
    previous.positionMs === reconciled.positionMs &&
    previous.durationMs === reconciled.durationMs &&
    previous.volume === reconciled.volume &&
    previous.muted === reconciled.muted &&
    previous.shuffle === reconciled.shuffle &&
    previous.repeat === reconciled.repeat
  ) {
    return previous;
  }

  return reconciled;
}

function sameTrack(left: Track | null, right: Track | null) {
  if (left === right) return true;
  if (!left || !right) return false;
  return (
    left.id === right.id &&
    left.title === right.title &&
    left.artistName === right.artistName &&
    left.albumTitle === right.albumTitle &&
    left.durationMs === right.durationMs &&
    left.artworkKey === right.artworkKey
  );
}

function errorMessage(error: unknown): string {
  if (typeof error === "object" && error && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return String(error);
}
