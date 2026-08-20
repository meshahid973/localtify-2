import { create } from "zustand";
import type { LibraryFolder, Track } from "../../lib/contracts/domain";
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
      set({ tracks: snapshot.tracks, folders: snapshot.folders });
    } catch (error) {
      set({ error: errorMessage(error) });
    } finally {
      set({ loading: false });
    }
  },

  refresh: async () => {
    try {
      const snapshot = await libraryApi.snapshot();
      set({ tracks: snapshot.tracks, folders: snapshot.folders, error: null });
    } catch (error) {
      set({ error: errorMessage(error) });
    }
  },

  addFolder: async (path) => {
    set({ scanning: true, error: null });
    try {
      const result = await libraryApi.scan(path);
      set({ tracks: result.snapshot.tracks, folders: result.snapshot.folders });
    } catch (error) {
      set({ error: errorMessage(error) });
    } finally {
      set({ scanning: false });
    }
  },
}));

function errorMessage(error: unknown): string {
  if (typeof error === "object" && error && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return String(error);
}
