import hillscape from "./assets/xp-hillscape.svg";
import { AeroBubbleLayer } from "./AeroBubbleLayer";

export function AeroBackground() {
  return (
    <div className="aero-background pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <img src={hillscape} alt="" className="aero-landscape absolute inset-0 size-full object-cover" />
      <div className="aero-landscape-wash absolute inset-0" />
      <AeroBubbleLayer />
    </div>
  );
}
