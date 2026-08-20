import { AudioLines, Cloud, Disc3, Orbit, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const palettes: Record<string, [string, string, string]> = {
  sky: ["#edf7ff", "#79c9ff", "#183cff"],
  lime: ["#11160d", "#9cf575", "#e5ffbd"],
  orbit: ["#07091c", "#7a5cff", "#55e7d0"],
  ember: ["#150908", "#d73a25", "#ff9d61"],
  cloud: ["#d8ebf3", "#f8f4e9", "#83a9ba"],
  violet: ["#21142d", "#a86cf4", "#f3a7ff"],
  aurora: ["#071414", "#48e4b3", "#5c7cff"],
  night: ["#070918", "#363d89", "#a7c5ff"],
  peach: ["#2a1017", "#ff8e8e", "#ffd1ac"],
  ocean: ["#07141c", "#2a8ca5", "#d4f2e8"],
};

const iconMap = [Sparkles, Orbit, Disc3, Cloud, AudioLines];

export function CoverArt({
  artworkKey,
  className = "",
  animated = true,
}: {
  artworkKey: string;
  className?: string;
  animated?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const palette = palettes[artworkKey] ?? palettes.aurora;
  const Icon = iconMap[Math.abs(hash(artworkKey)) % iconMap.length];

  return (
    <motion.div
      className={`relative isolate overflow-hidden bg-black ${className}`}
      style={{
        background: `radial-gradient(circle at 72% 22%, ${palette[2]}88 0, transparent 32%), linear-gradient(135deg, ${palette[0]}, ${palette[1]})`,
      }}
      animate={
        animated && !reduceMotion
          ? { backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }
          : undefined
      }
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:18px_18px]" />
      <motion.div
        className="absolute -right-8 -top-8 size-28 rounded-full border border-white/30"
        animate={!reduceMotion ? { rotate: 360 } : undefined}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-0 grid place-items-center">
        <div className="grid size-[44%] place-items-center rounded-[28%] border border-white/20 bg-black/25 shadow-2xl backdrop-blur-md">
          <Icon className="size-1/2 text-white/90" strokeWidth={1.6} />
        </div>
      </div>
    </motion.div>
  );
}

function hash(value: string) {
  let result = 0;
  for (let index = 0; index < value.length; index += 1) {
    result = (result << 5) - result + value.charCodeAt(index);
    result |= 0;
  }
  return result;
}
