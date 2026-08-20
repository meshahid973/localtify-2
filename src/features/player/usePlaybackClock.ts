import { useEffect, useRef, useState } from "react";

export function usePlaybackClock(serverPositionMs: number, playing: boolean, durationMs: number) {
  const [positionMs, setPositionMs] = useState(serverPositionMs);
  const anchorRef = useRef({ positionMs: serverPositionMs, at: performance.now() });

  useEffect(() => {
    anchorRef.current = { positionMs: serverPositionMs, at: performance.now() };
    setPositionMs(serverPositionMs);
  }, [serverPositionMs]);

  useEffect(() => {
    if (!playing) return;

    const timer = window.setInterval(() => {
      const elapsed = performance.now() - anchorRef.current.at;
      setPositionMs(Math.min(durationMs || Number.MAX_SAFE_INTEGER, anchorRef.current.positionMs + elapsed));
    }, 250);

    return () => window.clearInterval(timer);
  }, [durationMs, playing]);

  return Math.min(positionMs, durationMs || positionMs);
}
