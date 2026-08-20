import { AeroBubbleLayer } from "./AeroBubbleLayer";

export function AeroBackground() {
  return (
    <div className="aero-background pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="aero-world absolute inset-0" />
      <AeroBubbleLayer />
    </div>
  );
}
