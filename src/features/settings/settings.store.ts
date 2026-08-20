import { create } from "zustand";
import { persist } from "zustand/middleware";

export const ACCENT_COLORS = {
  green: "#1ed760",
  mint: "#6ee7b7",
  cyan: "#67e8f9",
  violet: "#a78bfa",
} as const;

export const BACKGROUND_PRESETS = {
  oled: "#000000",
  graphite: "#050505",
  midnight: "#02050a",
  warm: "#070504",
} as const;

export type AccentPreset = keyof typeof ACCENT_COLORS;
export type MotionPreference = "full" | "subtle" | "off";
export type DensityPreference = "comfortable" | "compact";
export type PlayerStyle = "floating" | "flat";
export type AmbienceStrength = "soft" | "balanced" | "rich";

interface SettingsStore {
  accent: AccentPreset;
  backgroundColor: string;
  motion: MotionPreference;
  density: DensityPreference;
  artworkGlow: boolean;
  heroArtworkBackdrop: boolean;
  playerArtworkBackdrop: boolean;
  ambienceStrength: AmbienceStrength;
  playerStyle: PlayerStyle;
  setAccent: (accent: AccentPreset) => void;
  setBackgroundColor: (color: string) => void;
  setMotion: (motion: MotionPreference) => void;
  setDensity: (density: DensityPreference) => void;
  setArtworkGlow: (enabled: boolean) => void;
  setHeroArtworkBackdrop: (enabled: boolean) => void;
  setPlayerArtworkBackdrop: (enabled: boolean) => void;
  setAmbienceStrength: (strength: AmbienceStrength) => void;
  setPlayerStyle: (style: PlayerStyle) => void;
  resetAppearance: () => void;
}

const DEFAULTS = {
  accent: "green" as AccentPreset,
  backgroundColor: BACKGROUND_PRESETS.oled,
  motion: "full" as MotionPreference,
  density: "comfortable" as DensityPreference,
  artworkGlow: true,
  heroArtworkBackdrop: true,
  playerArtworkBackdrop: true,
  ambienceStrength: "balanced" as AmbienceStrength,
  playerStyle: "floating" as PlayerStyle,
};

function validHexColor(value: string) {
  return /^#[0-9a-f]{6}$/i.test(value.trim());
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setAccent: (accent) => set({ accent }),
      setBackgroundColor: (backgroundColor) => {
        const normalized = backgroundColor.trim().toLowerCase();
        if (validHexColor(normalized)) set({ backgroundColor: normalized });
      },
      setMotion: (motion) => set({ motion }),
      setDensity: (density) => set({ density }),
      setArtworkGlow: (artworkGlow) => set({ artworkGlow }),
      setHeroArtworkBackdrop: (heroArtworkBackdrop) => set({ heroArtworkBackdrop }),
      setPlayerArtworkBackdrop: (playerArtworkBackdrop) => set({ playerArtworkBackdrop }),
      setAmbienceStrength: (ambienceStrength) => set({ ambienceStrength }),
      setPlayerStyle: (playerStyle) => set({ playerStyle }),
      resetAppearance: () => set(DEFAULTS),
    }),
    {
      name: "localtify-ui-settings",
      version: 1,
    },
  ),
);
