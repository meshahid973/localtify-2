import { AnimatePresence, motion } from "motion/react";
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

  return (
    <div className="min-h-screen bg-black text-[#f3f0dd]">
      <TitleBar />
      <Sidebar />

      <div className="app-content fixed bottom-[var(--player-height)] right-0 top-[var(--titlebar-height)] overflow-y-auto bg-black">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-full"
          >
            {page === "home" && <HomePage />}
            {page === "library" && <LibraryPage />}
            {page === "downloads" && <DownloadsPage />}
          </motion.div>
        </AnimatePresence>
      </div>

      <PlayerBar />
    </div>
  );
}
