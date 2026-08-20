import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Sidebar } from "../components/layout/Sidebar";
import { TitleBar } from "../components/layout/TitleBar";
import { DownloadsPage } from "../features/downloads/DownloadsPage";
import { HomePage } from "../features/home/HomePage";
import { LibraryPage } from "../features/library/LibraryPage";
import { useNavigationStore } from "../features/navigation/navigation.store";
import { PlayerBar } from "../features/player/PlayerBar";
import { SettingsPage } from "../features/settings/SettingsPage";
import { useSettingsStore } from "../features/settings/settings.store";
import { EASE_OUT } from "../lib/motion";
import { useAppearance } from "./useAppearance";
import { useRuntimeSync } from "./useRuntimeSync";

export function App() {
  useAppearance();
  useRuntimeSync();

  const page = useNavigationStore((state) => state.page);
  const motionPreference = useSettingsStore((state) => state.motion);
  const pageDuration = motionPreference === "subtle" ? 0.16 : motionPreference === "off" ? 0.01 : 0.24;

  return (
    <MotionConfig reducedMotion={motionPreference === "off" ? "always" : "user"}>
      <div className="min-h-screen bg-[var(--app-bg)] text-white transition-colors duration-300">
        <TitleBar />
        <Sidebar />

        <div className="app-content fixed bottom-[var(--player-height)] right-0 top-[var(--titlebar-height)] overflow-y-auto bg-[var(--app-bg)] transition-colors duration-300">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: pageDuration, ease: EASE_OUT }}
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
