import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sidebar } from "../components/layout/Sidebar";
import { TitleBar } from "../components/layout/TitleBar";
import { HomePage } from "../features/home/HomePage";
import { PlayerBar } from "../features/player/PlayerBar";
import { inspectRuntime, type RuntimeState } from "./startup";

const INITIAL_RUNTIME: RuntimeState = { kind: "checking" };

export function App() {
  const [runtime, setRuntime] = useState<RuntimeState>(INITIAL_RUNTIME);

  useEffect(() => {
    let mounted = true;

    void inspectRuntime().then((state) => {
      if (mounted) {
        setRuntime(state);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#02040a] text-white">
      <TitleBar />
      <Sidebar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed bottom-24 left-14 right-0 top-8 overflow-y-auto"
      >
        <div className="pointer-events-none fixed inset-x-14 bottom-24 top-8 bg-[radial-gradient(circle_at_60%_0%,rgba(31,64,98,.16),transparent_34%),radial-gradient(circle_at_15%_35%,rgba(71,255,191,.06),transparent_28%)]" />
        <div className="relative mx-auto w-full max-w-[1900px]">
          <RuntimeBadge runtime={runtime} />
          <HomePage />
        </div>
      </motion.div>
      <PlayerBar />
    </div>
  );
}

function RuntimeBadge({ runtime }: { runtime: RuntimeState }) {
  const label =
    runtime.kind === "ready"
      ? `native · v${runtime.app.version}`
      : runtime.kind === "browser"
        ? "web preview"
        : runtime.kind === "error"
          ? "native unavailable"
          : "starting";

  return (
    <div className="pointer-events-none fixed right-5 top-10 z-20 rounded-full border border-white/[0.07] bg-black/30 px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.14em] text-white/25 backdrop-blur-md">
      {label}
    </div>
  );
}
