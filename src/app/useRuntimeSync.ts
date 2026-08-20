import { useEffect, useState } from "react";
import { useLibraryStore } from "../features/library/library.store";
import { usePlayerStore } from "../features/player/player.store";
import { inspectRuntime, type RuntimeState } from "./startup";

const INITIAL_RUNTIME: RuntimeState = { kind: "checking" };

export function useRuntimeSync() {
  const [runtime, setRuntime] = useState<RuntimeState>(INITIAL_RUNTIME);
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
}
