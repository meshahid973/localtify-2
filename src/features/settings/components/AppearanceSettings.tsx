import { Palette } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import {
  ACCENT_COLORS,
  type AccentPreset,
  type DensityPreference,
  type MotionPreference,
  type PlayerStyle,
  useSettingsStore,
} from "../settings.store";

export function AppearanceSettings() {
  const reduceMotion = useReducedMotion();
  const accent = useSettingsStore((state) => state.accent);
  const motionPreference = useSettingsStore((state) => state.motion);
  const density = useSettingsStore((state) => state.density);
  const artworkGlow = useSettingsStore((state) => state.artworkGlow);
  const playerStyle = useSettingsStore((state) => state.playerStyle);
  const setAccent = useSettingsStore((state) => state.setAccent);
  const setMotion = useSettingsStore((state) => state.setMotion);
  const setDensity = useSettingsStore((state) => state.setDensity);
  const setArtworkGlow = useSettingsStore((state) => state.setArtworkGlow);
  const setPlayerStyle = useSettingsStore((state) => state.setPlayerStyle);

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-[16px] border border-[var(--line)] bg-[var(--surface-1)] p-5"
    >
      <PanelHeader title="Appearance" description="OLED stays black. These only tune the details." />

      <SettingBlock label="Accent" hint="Reserved for playback and selected controls.">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(ACCENT_COLORS) as AccentPreset[]).map((preset) => (
            <motion.button
              key={preset}
              type="button"
              whileHover={reduceMotion ? undefined : { y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAccent(preset)}
              className={`relative h-9 w-12 rounded-[10px] border transition-colors ${
                accent === preset ? "border-white/65" : "border-white/[0.08] hover:border-white/20"
              }`}
              style={{ background: ACCENT_COLORS[preset] }}
              aria-label={`${preset} accent`}
              title={`${preset} accent`}
            >
              {accent === preset && <span className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-black/65" />}
            </motion.button>
          ))}
        </div>
      </SettingBlock>

      <SettingBlock label="Motion" hint="Choose how much movement the interface uses.">
        <Segmented
          value={motionPreference}
          options={[
            ["full", "Fluid"],
            ["subtle", "Calm"],
            ["off", "Off"],
          ]}
          onChange={(value) => setMotion(value as MotionPreference)}
        />
      </SettingBlock>

      <SettingBlock label="Density" hint="Compact mode reduces the sidebar and player height.">
        <Segmented
          value={density}
          options={[
            ["comfortable", "Comfortable"],
            ["compact", "Compact"],
          ]}
          onChange={(value) => setDensity(value as DensityPreference)}
        />
      </SettingBlock>

      <SettingBlock label="Player" hint="Float the player as a dock or keep it flush with the window edge.">
        <Segmented
          value={playerStyle}
          options={[
            ["floating", "Floating"],
            ["flat", "Flat"],
          ]}
          onChange={(value) => setPlayerStyle(value as PlayerStyle)}
        />
      </SettingBlock>

      <SettingBlock label="Artwork glow" hint="Adds a restrained accent glow around featured artwork.">
        <Toggle checked={artworkGlow} onChange={setArtworkGlow} />
      </SettingBlock>
    </motion.section>
  );
}

function PanelHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-[9px] bg-white/[0.04] text-white/50">
        <Palette className="size-4" />
      </span>
      <div>
        <h2 className="text-[17px] font-semibold tracking-[-0.03em]">{title}</h2>
        <p className="mt-1 text-[10px] leading-4 text-white/27">{description}</p>
      </div>
    </div>
  );
}

function SettingBlock({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 border-t border-[var(--line)] pt-4">
      <div className="mb-3">
        <p className="text-[11px] font-medium text-white/70">{label}</p>
        <p className="mt-1 text-[9px] text-white/23">{hint}</p>
      </div>
      {children}
    </div>
  );
}

function Segmented({ value, options, onChange }: { value: string; options: Array<[string, string]>; onChange: (value: string) => void }) {
  return (
    <div className="inline-flex rounded-[10px] border border-[var(--line)] bg-black p-1">
      {options.map(([option, label]) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`relative rounded-[7px] px-3 py-2 text-[9px] transition-colors ${
            value === option ? "text-black" : "text-white/30 hover:text-white/60"
          }`}
        >
          {value === option && <span className="absolute inset-0 rounded-[7px] bg-[var(--accent)]" />}
          <span className="relative z-10">{label}</span>
        </button>
      ))}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 rounded-full transition-colors ${checked ? "bg-[var(--accent)]" : "bg-white/[0.08]"}`}
    >
      <motion.span
        animate={{ x: checked ? 22 : 3 }}
        transition={{ type: "spring", stiffness: 520, damping: 34 }}
        className={`absolute left-0 top-1 size-5 rounded-full ${checked ? "bg-black" : "bg-white/65"}`}
      />
    </button>
  );
}
