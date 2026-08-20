import { create } from "zustand";
import { persist } from "zustand/middleware";

export const ACCENT_COLORS = {
  green: "#1ed760",
  mint: "#6ee7b7",
  cyan: "#67e8f9",
  violet: "#a78bfa",
} as const;

export type AccentPreset = keyof typeof ACCENT_COLORS;
export type MotionPreference = "full" | "subtle" | "off";
export type DensityPreference = "comfortable" | "compact";
export type PlayerStyle = "floating" | "flat";

interface SettingsStore {
  accent: AccentPreset;
  motion: MotionPreference;
  density: DensityPreference;
  artworkGlow: boolean;
  playerStyle: PlayerStyle;
  setAccent: (accent: AccentPreset) => void;
  setMotion: (motion: MotionPreference) => void;
  setDensity: (density: DensityPreference) => void;
  setArtworkGlow: (enabled: boolean) => void;
  setPlayerStyle: (style: PlayerStyle) => void;
  resetAppearance: () => void;
}

const DEFAULTS = {
  accent: "green" as AccentPreset,
  motion: "full" as MotionPreference,
  density: "comfortable" as DensityPreference,
  artworkGlow: true,
  playerStyle: "floating" as PlayerStyle,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setAccent: (accent) => set({ accent }),
      setMotion: (motion) => set({ motion }),
      setDensity: (density) => set({ density }),
      setArtworkGlow: (artworkGlow) => set({ artworkGlow }),
      setPlayerStyle: (playerStyle) => set({ playerStyle }),
      resetAppearance: () => set(DEFAULTS),
    }),
    {
      name: "localtify-ui-settings",
      version: 1,
    },
  ),
);
