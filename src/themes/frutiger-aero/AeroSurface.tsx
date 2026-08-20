import type { ReactNode } from "react";
import { AeroGloss } from "./AeroGloss";

export function AeroSurface({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`themed-panel relative overflow-hidden ${className}`}>
      <AeroGloss />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
