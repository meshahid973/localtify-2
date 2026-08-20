import { useEffect } from "react";
import { ACCENT_COLORS, useSettingsStore } from "../features/settings/settings.store";

export function useAppearance() {
  const accent = useSettingsStore((state) => state.accent);
  const backgroundColor = useSettingsStore((state) => state.backgroundColor);
  const motion = useSettingsStore((state) => state.motion);
  const density = useSettingsStore((state) => state.density);
  const artworkGlow = useSettingsStore((state) => state.artworkGlow);
  const ambienceStrength = useSettingsStore((state) => state.ambienceStrength);
  const playerStyle = useSettingsStore((state) => state.playerStyle);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", ACCENT_COLORS[accent]);
    root.style.setProperty("--app-bg", backgroundColor);
    root.dataset.motion = motion;
    root.dataset.density = density;
    root.dataset.artworkGlow = artworkGlow ? "on" : "off";
    root.dataset.ambience = ambienceStrength;
    root.dataset.playerStyle = playerStyle;
  }, [accent, ambienceStrength, artworkGlow, backgroundColor, density, motion, playerStyle]);
}
