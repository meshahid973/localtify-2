import { lazy, Suspense } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Sidebar } from "../components/layout/Sidebar";
import { TitleBar } from "../components/layout/TitleBar";
import { HomePage } from "../features/home/HomePage";
import { useNavigationStore } from "../features/navigation/navigation.store";
import { PlayerBar } from "../features/player/PlayerBar";
import { useSettingsStore } from "../features/settings/settings.store";
import { EASE_OUT } from "../lib/motion";
import { ThemeBackground } from "../themes/ThemeBackground";
import { useAppearance } from "./useAppearance";
import { useRuntimeSync } from "./useRuntimeSync";

const LibraryPage = lazy(() => import("../features/library/LibraryPage").then((module) => ({ default: module.LibraryPage })));
const DownloadsPage = lazy(() => import("../features/downloads/DownloadsPage").then((module) => ({ default: module.DownloadsPage })));
const SettingsPage = lazy(() => import("../features/settings/SettingsPage").then((module) => ({ default: module.SettingsPage })));

export function App() {
  useAppearance();
  useRuntimeSync();

  const page = useNavigationStore((state) => state.page);
  const motionPreference = useSettingsStore((state) => state.motion);
  const pageDuration = motionPreference === "calm" ? 0.16 : motionPreference === "off" ? 0.01 : motionPreference === "osu" ? 0.28 : 0.24;

  return (
    <MotionConfig reducedMotion={motionPreference === "off" ? "always" : "user"}>
      <div className="app-theme relative min-h-screen text-white">
        <ThemeBackground />
        <TitleBar />
        <Sidebar />

        <div className="app-content themed-content fixed bottom-[var(--player-height)] right-0 top-[var(--titlebar-height)] z-10 overflow-y-auto bg-[var(--app-bg)] transition-colors duration-300">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={page}
              initial={{ opacity: 0, y: motionPreference === "osu" ? 8 : 5, scale: motionPreference === "osu" ? 0.997 : 1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -3, scale: motionPreference === "osu" ? 0.998 : 1 }}
              transition={{ duration: pageDuration, ease: EASE_OUT }}
              className="min-h-full"
            >
              <Suspense fallback={<div className="min-h-full" />}>
                {page === "home" && <HomePage />}
                {page === "library" && <LibraryPage />}
                {page === "downloads" && <DownloadsPage />}
                {page === "settings" && <SettingsPage />}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>

        <PlayerBar />
      </div>
    </MotionConfig>
  );
}
