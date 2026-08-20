import type { CSSProperties } from "react";

const bubbles = [
  [10, 24, 24, -8, .28],
  [27, 34, 29, -17, .22],
  [48, 20, 22, -5, .24],
  [66, 30, 31, -21, .20],
  [82, 22, 25, -12, .24],
  [93, 38, 34, -25, .18],
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
