import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sidebar } from "../components/layout/Sidebar";
import { TitleBar } from "../components/layout/TitleBar";
import { HomePage } from "../features/home/HomePage";
import { useLibraryStore } from "../features/library/library.store";
import { PlayerBar } from "../features/player/PlayerBar";
import { usePlayerStore } from "../features/player/player.store";
import { inspectRuntime, type RuntimeState } from "./startup";

const INITIAL_RUNTIME: RuntimeState = { kind: "checking" };

export function App() {
  const [runtime, setRuntime] = useState<RuntimeState>(INITIAL_RUNTIME);
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
    const playerTimer = window.setInterval(() => void syncPlayer(), 250);
    const libraryTimer = window.setInterval(() => void refreshLibrary(), 3000);

    return () => {
      window.clearInterval(playerTimer);
      window.clearInterval(libraryTimer);
    };
  }, [runtime.kind, hydrateLibrary, hydratePlayer, refreshLibrary, syncPlayer]);

  return (
    <div className="min-h-screen bg-black text-white">
      <TitleBar />
      <Sidebar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="fixed bottom-[88px] left-16 right-0 top-8 overflow-y-auto bg-black"
      >
        <HomePage />
      </motion.div>
      <PlayerBar />
    </div>
  );
}
