import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Layers3, MousePointer2, Palette, Sparkles, SlidersHorizontal } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Pressable } from "../../../ui/motion/Pressable";
import {
  ACCENT_COLORS,
  BACKGROUND_PRESETS,
  type AccentPreset,
  type AeroGlassStrength,
  type AmbienceStrength,
  type BounceIntensity,
  type DensityPreference,
  type MotionPreference,
  type PlayerStyle,
  type ThemeId,
  useSettingsStore,
} from "../settings.store";

export function AppearanceSettings() {
  const reduceMotion = useReducedMotion();
  const theme = useSettingsStore((state) => state.theme);
  const accent = useSettingsStore((state) => state.accent);
  const backgroundColor = useSettingsStore((state) => state.backgroundColor);
  const motionPreference = useSettingsStore((state) => state.motion);
  const bounceIntensity = useSettingsStore((state) => state.bounceIntensity);
  const density = useSettingsStore((state) => state.density);
  const artworkGlow = useSettingsStore((state) => state.artworkGlow);
  const heroArtworkBackdrop = useSettingsStore((state) => state.heroArtworkBackdrop);
  const heroBackdropBlur = useSettingsStore((state) => state.heroBackdropBlur);
  const heroBackdropBrightness = useSettingsStore((state) => state.heroBackdropBrightness);
  const playerArtworkBackdrop = useSettingsStore((state) => state.playerArtworkBackdrop);
  const ambienceStrength = useSettingsStore((state) => state.ambienceStrength);
  const playerStyle = useSettingsStore((state) => state.playerStyle);
  const aeroGlass = useSettingsStore((state) => state.aeroGlass);
  const aeroBubbles = useSettingsStore((state) => state.aeroBubbles);
  const aeroSaturation = useSettingsStore((state) => state.aeroSaturation);
  const aeroBackgroundMotion = useSettingsStore((state) => state.aeroBackgroundMotion);

  const setTheme = useSettingsStore((state) => state.setTheme);
  const setAccent = useSettingsStore((state) => state.setAccent);
  const setBackgroundColor = useSettingsStore((state) => state.setBackgroundColor);
  const setMotion = useSettingsStore((state) => state.setMotion);
  const setBounceIntensity = useSettingsStore((state) => state.setBounceIntensity);
  const setDensity = useSettingsStore((state) => state.setDensity);
  const setArtworkGlow = useSettingsStore((state) => state.setArtworkGlow);
  const setHeroArtworkBackdrop = useSettingsStore((state) => state.setHeroArtworkBackdrop);
  const setHeroBackdropBlur = useSettingsStore((state) => state.setHeroBackdropBlur);
  const setHeroBackdropBrightness = useSettingsStore((state) => state.setHeroBackdropBrightness);
  const setPlayerArtworkBackdrop = useSettingsStore((state) => state.setPlayerArtworkBackdrop);
  const setAmbienceStrength = useSettingsStore((state) => state.setAmbienceStrength);
  const setPlayerStyle = useSettingsStore((state) => state.setPlayerStyle);
  const setAeroGlass = useSettingsStore((state) => state.setAeroGlass);
  const setAeroBubbles = useSettingsStore((state) => state.setAeroBubbles);
  const setAeroSaturation = useSettingsStore((state) => state.setAeroSaturation);
  const setAeroBackgroundMotion = useSettingsStore((state) => state.setAeroBackgroundMotion);

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-3"
    >
      <SettingsSection icon={Layers3} title="Theme" description="Keep OLED minimal or switch to the brighter Aero world.">
        <div className="grid gap-2 sm:grid-cols-2">
          <ThemeChoice
            id="oled"
            active={theme === "oled"}
            title="OLED"
            description="Pure black and artwork-led colour."
            onClick={() => setTheme("oled")}
          />
          <ThemeChoice
            id="aero"
            active={theme === "aero"}
            title="Frutiger Aero"
            description="Blue sky, green hills, glass and a few bubbles."
            onClick={() => setTheme("aero")}
          />
        </div>
      </SettingsSection>

      <SettingsSection icon={MousePointer2} title="Motion" description="Tactile interactions without making the whole app bounce.">
        <SettingsRow label="Motion style" hint="osu! Elastic gives controls the strongest hold-and-release feel.">
          <Segmented
            value={motionPreference}
            options={[
              ["localtify", "Localtify"],
              ["osu", "osu! Elastic"],
              ["calm", "Calm"],
              ["off", "Off"],
            ]}
            onChange={(value) => setMotion(value as MotionPreference)}
          />
        </SettingsRow>
        <SettingsRow label="Bounce" hint="How far buttons compress and overshoot on release.">
          <Segmented
            value={bounceIntensity}
            options={[
              ["subtle", "Subtle"],
              ["balanced", "Balanced"],
              ["playful", "Playful"],
            ]}
            onChange={(value) => setBounceIntensity(value as BounceIntensity)}
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection
        icon={Palette}
        title={theme === "oled" ? "Canvas" : "Aero"}
        description={theme === "oled" ? "Keep the shell dark and quiet." : "The hillscape is fixed; tune only the material over it."}
      >
        {theme === "oled" ? (
          <>
            <SettingsRow label="Background" hint="OLED black stays the default.">
              <div className="flex flex-wrap items-center gap-2">
                {(Object.entries(BACKGROUND_PRESETS) as Array<[keyof typeof BACKGROUND_PRESETS, string]>).map(([name, color]) => (
                  <Pressable
                    key={name}
                    strength="subtle"
                    flash={false}
                    onClick={() => setBackgroundColor(color)}
                    className={`relative h-8 w-10 rounded-[9px] border ${backgroundColor === color ? "border-white/70" : "border-white/[0.10]"}`}
                    style={{ background: color }}
                    ariaLabel={`${name} background`}
                    title={`${name} background`}
                  >
                    {backgroundColor === color && <span className="absolute inset-x-3 bottom-1 z-10 h-0.5 rounded-full bg-white/80" />}
                  </Pressable>
                ))}
                <label className="flex h-8 items-center gap-2 rounded-[9px] border border-[var(--line)] bg-black/20 px-2 text-[8px] text-white/38">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(event) => setBackgroundColor(event.currentTarget.value)}
                    className="size-4 cursor-pointer border-0 bg-transparent p-0"
                    aria-label="Custom background color"
                  />
                  <span className="font-mono uppercase">{backgroundColor}</span>
                </label>
              </div>
            </SettingsRow>
          </>
        ) : (
          <>
            <SettingsRow label="Glass" hint="Keep it light for the cleanest Aero look.">
              <Segmented
                value={aeroGlass}
                options={[
                  ["light", "Light"],
                  ["balanced", "Balanced"],
                  ["glossy", "Glossy"],
                ]}
                onChange={(value) => setAeroGlass(value as AeroGlassStrength)}
              />
            </SettingsRow>
            <SettingsRow label="Saturation" hint="Controls how vivid the sky, hills and glass feel.">
              <RangeControl value={aeroSaturation} min={90} max={150} step={2} suffix="%" onChange={setAeroSaturation} />
            </SettingsRow>
            <SettingsRow label="Bubbles" hint="A few slow bubbles over the wallpaper.">
              <Toggle checked={aeroBubbles} onChange={setAeroBubbles} />
            </SettingsRow>
            <SettingsRow label="Background motion" hint="A tiny landscape drift; off is cheaper and calmer.">
              <Toggle checked={aeroBackgroundMotion} onChange={setAeroBackgroundMotion} />
            </SettingsRow>
          </>
        )}

        <SettingsRow label="Accent" hint="Used for active controls and progress.">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(ACCENT_COLORS) as AccentPreset[]).map((preset) => (
              <Pressable
                key={preset}
                strength="subtle"
                flash={false}
                onClick={() => setAccent(preset)}
                className={`relative h-8 w-10 rounded-[9px] border ${accent === preset ? "border-white/70" : "border-white/[0.10]"}`}
                style={{ background: ACCENT_COLORS[preset] }}
                ariaLabel={`${preset} accent`}
                title={`${preset} accent`}
              >
                {accent === preset && <span className="absolute inset-x-3 bottom-1 z-10 h-0.5 rounded-full bg-black/65" />}
              </Pressable>
            ))}
          </div>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection icon={SlidersHorizontal} title="Layout" description="Only the spacing choices that change how much fits on screen.">
        <SettingsRow label="Density" hint="Compact tightens the shell and player.">
          <Segmented
            value={density}
            options={[
              ["comfortable", "Comfortable"],
              ["compact", "Compact"],
            ]}
            onChange={(value) => setDensity(value as DensityPreference)}
          />
        </SettingsRow>
        <SettingsRow label="Player" hint="Float it slightly or pin it flat to the window edge.">
          <Segmented
            value={playerStyle}
            options={[
              ["floating", "Floating"],
              ["flat", "Flat"],
            ]}
            onChange={(value) => setPlayerStyle(value as PlayerStyle)}
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection icon={Sparkles} title="Artwork" description="Keep the current song visible without turning the app into a light show.">
        <SettingsRow label="Ambience" hint="Overall image wash and glow strength.">
          <Segmented
            value={ambienceStrength}
            options={[
              ["soft", "Soft"],
              ["balanced", "Balanced"],
              ["rich", "Rich"],
            ]}
            onChange={(value) => setAmbienceStrength(value as AmbienceStrength)}
          />
        </SettingsRow>

        <div className="grid gap-2 py-3 sm:grid-cols-3">
          <ToggleTile label="Hero background" checked={heroArtworkBackdrop} onChange={setHeroArtworkBackdrop} />
          <ToggleTile label="Player backdrop" checked={playerArtworkBackdrop} onChange={setPlayerArtworkBackdrop} />
          <ToggleTile label="Artwork glow" checked={artworkGlow} onChange={setArtworkGlow} />
        </div>

        <details className="group border-t border-[var(--line)] py-3">
          <summary className="cursor-pointer list-none text-[9px] font-medium text-white/42 transition-colors hover:text-white/72">
            Fine tune hero
          </summary>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-[8px] text-white/28">Blur</p>
              <RangeControl value={heroBackdropBlur} min={0} max={24} step={1} suffix="px" onChange={setHeroBackdropBlur} />
            </div>
            <div>
              <p className="mb-2 text-[8px] text-white/28">Brightness</p>
              <RangeControl value={heroBackdropBrightness} min={80} max={140} step={1} suffix="%" onChange={setHeroBackdropBrightness} />
            </div>
          </div>
        </details>
      </SettingsSection>
    </motion.div>
  );
}

function SettingsSection({ icon: Icon, title, description, children }: { icon: LucideIcon; title: string; description: string; children: ReactNode }) {
  return (
    <section className="settings-surface themed-panel overflow-hidden rounded-[14px] border border-[var(--line)] bg-[var(--surface-1)]">
      <div className="flex items-start gap-3 px-4 py-4 sm:px-5">
        <span className="grid size-8 shrink-0 place-items-center rounded-[9px] bg-white/[0.045] text-white/48">
          <Icon className="size-3.5" />
        </span>
        <div>
          <h2 className="text-[12px] font-semibold tracking-[-0.02em] text-white/84">{title}</h2>
          <p className="mt-1 text-[9px] leading-4 text-white/26">{description}</p>
        </div>
      </div>
      <div className="border-t border-[var(--line)] px-4 sm:px-5">{children}</div>
    </section>
  );
}

function SettingsRow({ label, hint, children }: { label: string; hint: string; children: ReactNode }) {
  return (
    <div className="grid gap-3 border-b border-[var(--line)] py-3.5 last:border-b-0 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
      <div className="min-w-0">
        <p className="text-[10px] font-medium text-white/68">{label}</p>
        <p className="mt-1 text-[8px] leading-4 text-white/22">{hint}</p>
      </div>
      <div className="min-w-0 lg:justify-self-end">{children}</div>
    </div>
  );
}

function ThemeChoice({ id, active, title, description, onClick }: { id: ThemeId; active: boolean; title: string; description: string; onClick: () => void }) {
  return (
    <Pressable
      strength="medium"
      flash={false}
      onClick={onClick}
      className={`settings-theme-choice themed-card rounded-[11px] border p-3 text-left ${active ? "border-white/50" : "border-white/[0.08]"}`}
    >
      <div className={`relative z-10 mb-3 h-11 overflow-hidden rounded-[8px] border border-white/[0.08] ${id === "oled" ? "bg-black" : "settings-aero-preview"}`} />
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold text-white/82">{title}</p>
          <p className="mt-1 text-[8px] leading-4 text-white/27">{description}</p>
        </div>
        <span className={`mt-0.5 size-2 rounded-full ${active ? "bg-[var(--accent)]" : "bg-white/[0.12]"}`} />
      </div>
    </Pressable>
  );
}

function Segmented({ value, options, onChange }: { value: string; options: Array<[string, string]>; onChange: (value: string) => void }) {
  return (
    <div className="inline-flex max-w-full flex-wrap rounded-[9px] border border-[var(--line)] bg-black/20 p-1">
      {options.map(([option, label]) => (
        <Pressable
          key={option}
          strength="subtle"
          flash={false}
          highlight={false}
          onClick={() => onChange(option)}
          className={`rounded-[7px] px-2.5 py-1.5 text-[8px] font-medium transition-colors ${value === option ? "bg-white text-black" : "text-white/30 hover:text-white/62"}`}
        >
          <span className="relative z-10">{label}</span>
        </Pressable>
      ))}
    </div>
  );
}

function RangeControl({ value, min, max, step, suffix, onChange }: { value: number; min: number; max: number; step: number; suffix: string; onChange: (value: number) => void }) {
  return (
    <div className="flex min-w-[210px] items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
        className="settings-range min-w-0 flex-1"
      />
      <output className="min-w-11 text-right font-mono text-[8px] text-white/38">{value}{suffix}</output>
    </div>
  );
}

function ToggleTile({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <Pressable
      strength="subtle"
      flash={false}
      role="switch"
      ariaChecked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between gap-3 rounded-[10px] border border-[var(--line)] bg-black/15 px-3 py-2.5 text-left"
    >
      <span className="relative z-10 text-[8px] font-medium text-white/52">{label}</span>
      <ToggleVisual checked={checked} />
    </Pressable>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <Pressable
      strength="subtle"
      flash={false}
      highlight={false}
      role="switch"
      ariaChecked={checked}
      onClick={() => onChange(!checked)}
      className="rounded-full"
    >
      <ToggleVisual checked={checked} />
    </Pressable>
  );
}

function ToggleVisual({ checked }: { checked: boolean }) {
  return (
    <span className={`relative z-10 block h-5 w-9 rounded-full transition-colors ${checked ? "bg-[var(--accent)]" : "bg-white/[0.09]"}`}>
      <motion.span
        animate={{ x: checked ? 17 : 3 }}
        transition={{ type: "spring", stiffness: 520, damping: 34 }}
        className={`absolute left-0 top-0.5 size-4 rounded-full ${checked ? "bg-black" : "bg-white/65"}`}
      />
    </span>
  );
}
