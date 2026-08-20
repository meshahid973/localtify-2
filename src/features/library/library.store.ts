import { create } from "zustand";
import type { LibraryFolder, LibrarySnapshot, Track } from "../../lib/contracts/domain";
import { libraryApi } from "../../lib/ipc/library-api";

interface LibraryStore {
  tracks: Track[];
  folders: LibraryFolder[];
  loading: boolean;
  scanning: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  refresh: () => Promise<void>;
  addFolder: (path: string) => Promise<void>;
}

export const useLibraryStore = create<LibraryStore>((set) => ({
  tracks: [],
  folders: [],
  loading: false,
  scanning: false,
  error: null,

  hydrate: async () => {
    set({ loading: true, error: null });
    try {
      const snapshot = await libraryApi.snapshot();
      set((store) => mergeSnapshot(store, snapshot));
    } catch (error) {
      set({ error: errorMessage(error) });
    } finally {
      set({ loading: false });
    }
  },

  refresh: async () => {
    try {
      const snapshot = await libraryApi.snapshot();
      set((store) => mergeSnapshot(store, snapshot));
    } catch (error) {
      set({ error: errorMessage(error) });
    }
  },

  addFolder: async (path) => {
    set({ scanning: true, error: null });
    try {
      const result = await libraryApi.scan(path);
      set((store) => mergeSnapshot(store, result.snapshot));
    } catch (error) {
      set({ error: errorMessage(error) });
    } finally {
      set({ scanning: false });
    }
  },
}));

function mergeSnapshot(store: LibraryStore, snapshot: LibrarySnapshot): Partial<LibraryStore> {
  const tracksChanged = !sameTracks(store.tracks, snapshot.tracks);
  const foldersChanged = !sameFolders(store.folders, snapshot.folders);

  if (!tracksChanged && !foldersChanged && store.error === null) return {};

  return {
    tracks: tracksChanged ? snapshot.tracks : store.tracks,
    folders: foldersChanged ? snapshot.folders : store.folders,
    error: null,
  };
}

function sameTracks(left: Track[], right: Track[]) {
  if (left === right) return true;
  if (left.length !== right.length) return false;

  for (let index = 0; index < left.length; index += 1) {
    const a = left[index];
    const b = right[index];
    if (
      !a ||
      !b ||
      a.id !== b.id ||
      a.title !== b.title ||
      a.artistName !== b.artistName ||
      a.albumTitle !== b.albumTitle ||
      a.durationMs !== b.durationMs ||
      a.artworkKey !== b.artworkKey
    ) {
      return false;
    }
  }

  return true;
}

function sameFolders(left: LibraryFolder[], right: LibraryFolder[]) {
  if (left === right) return true;
  if (left.length !== right.length) return false;
  return left.every((folder, index) => folder.path === right[index]?.path);
}

function errorMessage(error: unknown): string {
  if (typeof error === "object" && error && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return String(error);
}
