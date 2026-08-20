import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { TitleBar } from "../components/layout/TitleBar";
import { DownloadsPage } from "../features/downloads/DownloadsPage";
import { HomePage } from "../features/home/HomePage";
import { LibraryPage } from "../features/library/LibraryPage";
import { useLibraryStore } from "../features/library/library.store";
import { useNavigationStore } from "../features/navigation/navigation.store";
import { PlayerBar } from "../features/player/PlayerBar";
import { usePlayerStore } from "../features/player/player.store";
import { SettingsPage } from "../features/settings/SettingsPage";
import { ACCENT_COLORS, useSettingsStore } from "../features/settings/settings.store";
import { inspectRuntime, type RuntimeState } from "./startup";

const INITIAL_RUNTIME: RuntimeState = { kind: "checking" };

export function App() {
  const [runtime, setRuntime] = useState<RuntimeState>(INITIAL_RUNTIME);
  const page = useNavigationStore((state) => state.page);
  const playerStatus = usePlayerStore((state) => state.state.status);
  const hydrateLibrary = useLibraryStore((state) => state.hydrate);
  const refreshLibrary = useLibraryStore((state) => state.refresh);
  const hydratePlayer = usePlayerStore((state) => state.hydrate);
  const syncPlayer = usePlayerStore((state) => state.sync);
  const accent = useSettingsStore((state) => state.accent);
  const motionPreference = useSettingsStore((state) => state.motion);
  const density = useSettingsStore((state) => state.density);
  const artworkGlow = useSettingsStore((state) => state.artworkGlow);
  const playerStyle = useSettingsStore((state) => state.playerStyle);

  useEffect(() => {
    let mounted = true;
    void inspectRuntime().then((state) => {
      if (mounted) setRuntime(state);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", ACCENT_COLORS[accent]);
    root.dataset.motion = motionPreference;
    root.dataset.density = density;
    root.dataset.artworkGlow = artworkGlow ? "on" : "off";
    root.dataset.playerStyle = playerStyle;
  }, [accent, artworkGlow, density, motionPreference, playerStyle]);

  useEffect(() => {
    if (runtime.kind !== "ready") return;
    void hydrateLibrary();
    void hydratePlayer();
  }, [runtime.kind, hydrateLibrary, hydratePlayer]);

  useEffect(() => {
    if (runtime.kind !== "ready") return;
    const interval = playerStatus === "playing" ? 500 : 1400;
    const timer = window.setInterval(() => void syncPlayer(), interval);
    return () => window.clearInterval(timer);
  }, [runtime.kind, playerStatus, syncPlayer]);

  useEffect(() => {
    if (runtime.kind !== "ready") return;
    const timer = window.setInterval(() => void refreshLibrary(), 8000);
    return () => window.clearInterval(timer);
  }, [runtime.kind, refreshLibrary]);

  const pageDuration = motionPreference === "subtle" ? 0.18 : motionPreference === "off" ? 0.01 : 0.28;

  return (
    <MotionConfig reducedMotion={motionPreference === "off" ? "always" : "user"}>
      <div className="min-h-screen bg-black text-white">
        <TitleBar />
        <Sidebar />

        <div className="app-content fixed bottom-[var(--player-height)] right-0 top-[var(--titlebar-height)] overflow-y-auto bg-black">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={page}
              initial={{ opacity: 0, x: 8, y: 2 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: -5, y: -1 }}
              transition={{ duration: pageDuration, ease: [0.22, 1, 0.36, 1] }}
              className="min-h-full"
            >
              {page === "home" && <HomePage />}
              {page === "library" && <LibraryPage />}
              {page === "downloads" && <DownloadsPage />}
              {page === "settings" && <SettingsPage />}
            </motion.div>
          </AnimatePresence>
        </div>

        <PlayerBar />
      </div>
    </MotionConfig>
  );
}
