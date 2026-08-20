import { create } from "zustand";

export type AppPage = "home" | "library" | "downloads" | "settings";

interface NavigationStore {
  page: AppPage;
  setPage: (page: AppPage) => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  page: "home",
  setPage: (page) => set({ page }),
}));
