import type { ReactNode } from "react";
import { Palette, Sparkles, SlidersHorizontal } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import {
  ACCENT_COLORS,
  BACKGROUND_PRESETS,
  type AccentPreset,
  type AmbienceStrength,
  type DensityPreference,
  type MotionPreference,
  type PlayerStyle,
  useSettingsStore,
} from "../settings.store";

export function AppearanceSettings() {
  const reduceMotion = useReducedMotion();
  const accent = useSettingsStore((state) => state.accent);
  const backgroundColor = useSettingsStore((state) => state.backgroundColor);
  const motionPreference = useSettingsStore((state) => state.motion);
  const density = useSettingsStore((state) => state.density);
  const artworkGlow = useSettingsStore((state) => state.artworkGlow);
  const heroArtworkBackdrop = useSettingsStore((state) => state.heroArtworkBackdrop);
  const heroBackdropBlur = useSettingsStore((state) => state.heroBackdropBlur);
  const heroBackdropBrightness = useSettingsStore((state) => state.heroBackdropBrightness);
  const playerArtworkBackdrop = useSettingsStore((state) => state.playerArtworkBackdrop);
  const ambienceStrength = useSettingsStore((state) => state.ambienceStrength);
  const playerStyle = useSettingsStore((state) => state.playerStyle);

  const setAccent = useSettingsStore((state) => state.setAccent);
  const setBackgroundColor = useSettingsStore((state) => state.setBackgroundColor);
  const setMotion = useSettingsStore((state) => state.setMotion);
  const setDensity = useSettingsStore((state) => state.setDensity);
  const setArtworkGlow = useSettingsStore((state) => state.setArtworkGlow);
  const setHeroArtworkBackdrop = useSettingsStore((state) => state.setHeroArtworkBackdrop);
  const setHeroBackdropBlur = useSettingsStore((state) => state.setHeroBackdropBlur);
  const setHeroBackdropBrightness = useSettingsStore((state) => state.setHeroBackdropBrightness);
  const setPlayerArtworkBackdrop = useSettingsStore((state) => state.setPlayerArtworkBackdrop);
  const setAmbienceStrength = useSettingsStore((state) => state.setAmbienceStrength);
  const setPlayerStyle = useSettingsStore((state) => state.setPlayerStyle);

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-[16px] border border-[var(--line)] bg-[var(--surface-1)] p-4 sm:p-5"
    >
      <PanelHeader title="Appearance" description="Tune the canvas, motion and artwork atmosphere without adding clutter." />

      <div className="mt-5 grid gap-3 xl:grid-cols-2">
        <SettingGroup icon={Palette} title="Canvas" description="The base colors Localtify sits on.">
          <SettingBlock label="Background" hint="OLED black stays the default.">
            <div className="flex flex-wrap items-center gap-2">
              {(Object.entries(BACKGROUND_PRESETS) as Array<[keyof typeof BACKGROUND_PRESETS, string]>).map(([name, color]) => (
                <motion.button
                  key={name}
                  type="button"
                  whileHover={reduceMotion ? undefined : { y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setBackgroundColor(color)}
                  className={`relative h-9 w-12 rounded-[10px] border transition-colors ${
                    backgroundColor === color ? "border-white/70" : "border-white/[0.09] hover:border-white/24"
                  }`}
                  style={{ background: color }}
                  aria-label={`${name} background`}
                  title={`${name} background`}
                >
                  {backgroundColor === color && <span className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-white/80" />}
                </motion.button>
              ))}

              <label className="flex h-9 items-center gap-2 rounded-[10px] border border-[var(--line)] bg-black/20 px-2.5 text-[9px] text-white/38">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(event) => setBackgroundColor(event.currentTarget.value)}
                  className="size-5 cursor-pointer border-0 bg-transparent p-0"
                  aria-label="Custom background color"
                />
                <span className="font-mono uppercase">{backgroundColor}</span>
              </label>
            </div>
          </SettingBlock>

          <SettingBlock label="Accent" hint="Used only for meaningful active states.">
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
        </SettingGroup>

        <SettingGroup icon={SlidersHorizontal} title="Interface" description="Keep movement and spacing comfortable.">
          <SettingBlock label="Motion" hint="Fluid is smoothest; Calm removes the extra movement.">
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

          <SettingBlock label="Density" hint="Compact mode tightens the shell and player.">
            <Segmented
              value={density}
              options={[
                ["comfortable", "Comfortable"],
                ["compact", "Compact"],
              ]}
              onChange={(value) => setDensity(value as DensityPreference)}
            />
          </SettingBlock>

          <SettingBlock label="Player" hint="Float the player or pin it flush to the window edge.">
            <Segmented
              value={playerStyle}
              options={[
                ["floating", "Floating"],
                ["flat", "Flat"],
              ]}
              onChange={(value) => setPlayerStyle(value as PlayerStyle)}
            />
          </SettingBlock>
        </SettingGroup>

        <SettingGroup icon={Sparkles} title="Artwork ambience" description="Image-backed atmosphere around the song that is playing." wide>
          <div className="grid gap-4 lg:grid-cols-2">
            <SettingBlock label="Ambience strength" hint="Controls the overall image wash and halo.">
              <Segmented
                value={ambienceStrength}
                options={[
                  ["soft", "Soft"],
                  ["balanced", "Balanced"],
                  ["rich", "Rich"],
                ]}
                onChange={(value) => setAmbienceStrength(value as AmbienceStrength)}
              />
            </SettingBlock>

            <SettingBlock label="Hero blur" hint="Blur the current cover while keeping its shape recognizable.">
              <RangeControl value={heroBackdropBlur} min={0} max={24} step={1} suffix="px" onChange={setHeroBackdropBlur} />
            </SettingBlock>

            <SettingBlock label="Hero brightness" hint="Lift darker artwork without washing out the text.">
              <RangeControl value={heroBackdropBrightness} min={80} max={135} step={1} suffix="%" onChange={setHeroBackdropBrightness} />
            </SettingBlock>

            <div className="grid gap-2.5 sm:grid-cols-3 lg:col-span-2">
              <ToggleCard label="Hero background" hint="Current cover across the hero." checked={heroArtworkBackdrop} onChange={setHeroArtworkBackdrop} />
              <ToggleCard label="Player backdrop" hint="Blurred cover under playback controls." checked={playerArtworkBackdrop} onChange={setPlayerArtworkBackdrop} />
              <ToggleCard label="Artwork glow" hint="Image-colored halo around cover art." checked={artworkGlow} onChange={setArtworkGlow} />
            </div>
          </div>
        </SettingGroup>
      </div>
    </motion.section>
  );
}

function PanelHeader({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="text-[18px] font-semibold tracking-[-0.035em]">{title}</h2>
      <p className="mt-1 text-[10px] leading-4 text-white/27">{description}</p>
    </div>
  );
}

function SettingGroup({ icon: Icon, title, description, children, wide = false }: { icon: typeof Palette; title: string; description: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={`rounded-[14px] border border-white/[0.055] bg-black/20 p-4 ${wide ? "xl:col-span-2" : ""}`}>
      <div className="flex items-start gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-[9px] bg-white/[0.045] text-white/48">
          <Icon className="size-3.5" />
        </span>
        <div>
          <h3 className="text-[12px] font-semibold text-white/82">{title}</h3>
          <p className="mt-1 text-[9px] leading-4 text-white/24">{description}</p>
        </div>
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function SettingBlock({ label, hint, children }: { label: string; hint: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-2.5">
        <p className="text-[10px] font-medium text-white/68">{label}</p>
        <p className="mt-1 text-[8px] leading-4 text-white/22">{hint}</p>
      </div>
      {children}
    </div>
  );
}

function Segmented({ value, options, onChange }: { value: string; options: Array<[string, string]>; onChange: (value: string) => void }) {
  return (
    <div className="inline-flex flex-wrap rounded-[10px] border border-[var(--line)] bg-black/25 p-1">
      {options.map(([option, label]) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`relative rounded-[7px] px-3 py-2 text-[9px] transition-colors ${value === option ? "text-black" : "text-white/30 hover:text-white/60"}`}
        >
          {value === option && <span className="absolute inset-0 rounded-[7px] bg-[var(--accent)]" />}
          <span className="relative z-10">{label}</span>
        </button>
      ))}
    </div>
  );
}

function RangeControl({ value, min, max, step, suffix, onChange }: { value: number; min: number; max: number; step: number; suffix: string; onChange: (value: number) => void }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
        className="settings-range min-w-0 flex-1"
      />
      <output className="min-w-12 rounded-[8px] border border-[var(--line)] bg-black/25 px-2 py-1.5 text-center font-mono text-[8px] text-white/46">
        {value}{suffix}
      </output>
    </div>
  );
}

function ToggleCard({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between gap-3 rounded-[11px] border border-[var(--line)] bg-white/[0.018] px-3 py-3 text-left transition-colors hover:bg-white/[0.035]"
    >
      <span className="min-w-0">
        <span className="block text-[9px] font-medium text-white/66">{label}</span>
        <span className="mt-1 block text-[8px] leading-3 text-white/22">{hint}</span>
      </span>
      <Toggle checked={checked} />
    </button>
  );
}

function Toggle({ checked }: { checked: boolean }) {
  return (
    <span className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${checked ? "bg-[var(--accent)]" : "bg-white/[0.08]"}`}>
      <motion.span
        animate={{ x: checked ? 18 : 3 }}
        transition={{ type: "spring", stiffness: 520, damping: 34 }}
        className={`absolute left-0 top-0.5 size-5 rounded-full ${checked ? "bg-black" : "bg-white/65"}`}
      />
    </span>
  );
}
