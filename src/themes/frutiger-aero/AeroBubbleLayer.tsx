import type { CSSProperties } from "react";

const bubbles = [
  [8, 36, 18, -7, .42],
  [18, 22, 22, -14, .34],
  [31, 48, 25, -4, .32],
  [43, 30, 20, -11, .38],
  [57, 20, 23, -16, .28],
  [69, 42, 26, -9, .36],
  [79, 26, 21, -18, .30],
  [89, 52, 28, -6, .27],
  [95, 18, 19, -13, .32],
] as const;

export function AeroBubbleLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {bubbles.map(([x, size, duration, delay, opacity], index) => (
        <span
          key={index}
          className="aero-bubble"
          style={{
            "--bubble-x": `${x}%`,
            "--bubble-size": `${size}px`,
            "--bubble-duration": `${duration}s`,
            "--bubble-delay": `${delay}s`,
            "--bubble-opacity": opacity,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}
