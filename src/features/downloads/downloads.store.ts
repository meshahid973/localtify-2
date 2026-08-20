import { create } from "zustand";
import type { DownloadJob, DownloadToolsStatus } from "../../lib/contracts/domain";
import { downloadsApi } from "../../lib/ipc/downloads-api";

interface DownloadsStore {
  jobs: DownloadJob[];
  tools: DownloadToolsStatus | null;
  loading: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  refresh: () => Promise<void>;
  start: (source: string, outputDir: string) => Promise<boolean>;
}

export const useDownloadsStore = create<DownloadsStore>((set) => ({
  jobs: [],
  tools: null,
  loading: false,
  error: null,

  hydrate: async () => {
    set({ loading: true, error: null });
    try {
      const [jobs, tools] = await Promise.all([downloadsApi.list(), downloadsApi.tools()]);
      set({ jobs, tools });
    } catch (error) {
      set({ error: errorMessage(error) });
    } finally {
      set({ loading: false });
    }
  },

  refresh: async () => {
    try {
      const jobs = await downloadsApi.list();
      set({ jobs, error: null });
    } catch (error) {
      set({ error: errorMessage(error) });
    }
  },

  start: async (source, outputDir) => {
    set({ loading: true, error: null });
    try {
      const job = await downloadsApi.start(source, outputDir);
      set((state) => ({ jobs: [job, ...state.jobs] }));
      return true;
    } catch (error) {
      set({ error: errorMessage(error) });
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));

function errorMessage(error: unknown): string {
  if (typeof error === "object" && error && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return String(error);
}
