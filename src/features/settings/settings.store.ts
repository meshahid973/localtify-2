import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BounceIntensity, MotionStyle } from "../../ui/motion/motion.types";
import type { AeroEnvironment, AeroGlassStrength, ThemeId } from "../../themes/theme.types";

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
export type MotionPreference = MotionStyle;
export type DensityPreference = "comfortable" | "compact";
export type PlayerStyle = "floating" | "flat";
export type AmbienceStrength = "soft" | "balanced" | "rich";
export type { BounceIntensity, AeroEnvironment, AeroGlassStrength, ThemeId };

interface SettingsStore {
  theme: ThemeId;
  accent: AccentPreset;
  backgroundColor: string;
  motion: MotionPreference;
  bounceIntensity: BounceIntensity;
  density: DensityPreference;
  artworkGlow: boolean;
  heroArtworkBackdrop: boolean;
  heroBackdropBlur: number;
  heroBackdropBrightness: number;
  playerArtworkBackdrop: boolean;
  ambienceStrength: AmbienceStrength;
  playerStyle: PlayerStyle;
  aeroEnvironment: AeroEnvironment;
  aeroGlass: AeroGlassStrength;
  aeroBubbles: boolean;
  aeroSaturation: number;
  aeroBackgroundMotion: boolean;
  setTheme: (theme: ThemeId) => void;
  setAccent: (accent: AccentPreset) => void;
  setBackgroundColor: (color: string) => void;
  setMotion: (motion: MotionPreference) => void;
  setBounceIntensity: (bounceIntensity: BounceIntensity) => void;
  setDensity: (density: DensityPreference) => void;
  setArtworkGlow: (enabled: boolean) => void;
  setHeroArtworkBackdrop: (enabled: boolean) => void;
  setHeroBackdropBlur: (blur: number) => void;
  setHeroBackdropBrightness: (brightness: number) => void;
  setPlayerArtworkBackdrop: (enabled: boolean) => void;
  setAmbienceStrength: (strength: AmbienceStrength) => void;
  setPlayerStyle: (style: PlayerStyle) => void;
  setAeroEnvironment: (environment: AeroEnvironment) => void;
  setAeroGlass: (glass: AeroGlassStrength) => void;
  setAeroBubbles: (enabled: boolean) => void;
  setAeroSaturation: (saturation: number) => void;
  setAeroBackgroundMotion: (enabled: boolean) => void;
  resetAppearance: () => void;
}

const DEFAULTS = {
  theme: "oled" as ThemeId,
  accent: "green" as AccentPreset,
  backgroundColor: BACKGROUND_PRESETS.oled,
  motion: "osu" as MotionPreference,
  bounceIntensity: "balanced" as BounceIntensity,
  density: "comfortable" as DensityPreference,
  artworkGlow: true,
  heroArtworkBackdrop: true,
  heroBackdropBlur: 12,
  heroBackdropBrightness: 118,
  playerArtworkBackdrop: true,
  ambienceStrength: "balanced" as AmbienceStrength,
  playerStyle: "floating" as PlayerStyle,
  aeroEnvironment: "sky" as AeroEnvironment,
  aeroGlass: "balanced" as AeroGlassStrength,
  aeroBubbles: true,
  aeroSaturation: 122,
  aeroBackgroundMotion: true,
};

function validHexColor(value: string) {
  return /^#[0-9a-f]{6}$/i.test(value.trim());
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function migrateMotion(value: unknown): MotionPreference {
  if (value === "full") return "osu";
  if (value === "subtle") return "calm";
  if (value === "localtify" || value === "osu" || value === "calm" || value === "off") return value;
  return DEFAULTS.motion;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setTheme: (theme) => set({ theme }),
      setAccent: (accent) => set({ accent }),
      setBackgroundColor: (backgroundColor) => {
        const normalized = backgroundColor.trim().toLowerCase();
        if (validHexColor(normalized)) set({ backgroundColor: normalized });
      },
      setMotion: (motion) => set({ motion }),
      setBounceIntensity: (bounceIntensity) => set({ bounceIntensity }),
      setDensity: (density) => set({ density }),
      setArtworkGlow: (artworkGlow) => set({ artworkGlow }),
      setHeroArtworkBackdrop: (heroArtworkBackdrop) => set({ heroArtworkBackdrop }),
      setHeroBackdropBlur: (heroBackdropBlur) => set({ heroBackdropBlur: clamp(heroBackdropBlur, 0, 24) }),
      setHeroBackdropBrightness: (heroBackdropBrightness) => set({ heroBackdropBrightness: clamp(heroBackdropBrightness, 80, 140) }),
      setPlayerArtworkBackdrop: (playerArtworkBackdrop) => set({ playerArtworkBackdrop }),
      setAmbienceStrength: (ambienceStrength) => set({ ambienceStrength }),
      setPlayerStyle: (playerStyle) => set({ playerStyle }),
      setAeroEnvironment: (aeroEnvironment) => set({ aeroEnvironment }),
      setAeroGlass: (aeroGlass) => set({ aeroGlass }),
      setAeroBubbles: (aeroBubbles) => set({ aeroBubbles }),
      setAeroSaturation: (aeroSaturation) => set({ aeroSaturation: clamp(aeroSaturation, 80, 160) }),
      setAeroBackgroundMotion: (aeroBackgroundMotion) => set({ aeroBackgroundMotion }),
      resetAppearance: () => set(DEFAULTS),
    }),
    {
      name: "localtify-ui-settings",
      version: 2,
      migrate: (persistedState) => {
        const previous = (persistedState ?? {}) as Partial<SettingsStore> & { motion?: unknown };
        return {
          ...DEFAULTS,
          ...previous,
          motion: migrateMotion(previous.motion),
        };
      },
    },
  ),
);
