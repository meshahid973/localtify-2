import { useEffect } from "react";
import { ACCENT_COLORS, useSettingsStore } from "../features/settings/settings.store";

export function useAppearance() {
  const theme = useSettingsStore((state) => state.theme);
  const accent = useSettingsStore((state) => state.accent);
  const backgroundColor = useSettingsStore((state) => state.backgroundColor);
  const motion = useSettingsStore((state) => state.motion);
  const bounceIntensity = useSettingsStore((state) => state.bounceIntensity);
  const density = useSettingsStore((state) => state.density);
  const artworkGlow = useSettingsStore((state) => state.artworkGlow);
  const heroBackdropBlur = useSettingsStore((state) => state.heroBackdropBlur);
  const heroBackdropBrightness = useSettingsStore((state) => state.heroBackdropBrightness);
  const ambienceStrength = useSettingsStore((state) => state.ambienceStrength);
  const playerStyle = useSettingsStore((state) => state.playerStyle);
  const aeroEnvironment = useSettingsStore((state) => state.aeroEnvironment);
  const aeroGlass = useSettingsStore((state) => state.aeroGlass);
  const aeroBubbles = useSettingsStore((state) => state.aeroBubbles);
  const aeroSaturation = useSettingsStore((state) => state.aeroSaturation);
  const aeroBackgroundMotion = useSettingsStore((state) => state.aeroBackgroundMotion);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--custom-accent", ACCENT_COLORS[accent]);
    root.style.setProperty("--custom-background", backgroundColor);
    root.style.setProperty("--hero-user-blur", `${heroBackdropBlur}px`);
    root.style.setProperty("--hero-user-brightness", `${heroBackdropBrightness}%`);
    root.style.setProperty("--aero-saturation", `${aeroSaturation}%`);
    root.dataset.theme = theme;
    root.dataset.motion = motion;
    root.dataset.bounce = bounceIntensity;
    root.dataset.density = density;
    root.dataset.artworkGlow = artworkGlow ? "on" : "off";
    root.dataset.ambience = ambienceStrength;
    root.dataset.playerStyle = playerStyle;
    root.dataset.aeroEnv = aeroEnvironment;
    root.dataset.aeroGlass = aeroGlass;
    root.dataset.aeroBubbles = aeroBubbles ? "on" : "off";
    root.dataset.aeroMotion = aeroBackgroundMotion ? "on" : "off";
  }, [
    accent,
    aeroBackgroundMotion,
    aeroBubbles,
    aeroEnvironment,
    aeroGlass,
    aeroSaturation,
    ambienceStrength,
    artworkGlow,
    backgroundColor,
    bounceIntensity,
    density,
    heroBackdropBlur,
    heroBackdropBrightness,
    motion,
    playerStyle,
    theme,
  ]);
}
