import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Gauge, Layers3, Palette, Sparkles, Waves } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Pressable } from "../../../ui/motion/Pressable";
import {
  ACCENT_COLORS,
  BACKGROUND_PRESETS,
  type AccentPreset,
  type AeroEnvironment,
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
  const aeroEnvironment = useSettingsStore((state) => state.aeroEnvironment);
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
  const setAeroEnvironment = useSettingsStore((state) => state.setAeroEnvironment);
  const setAeroGlass = useSettingsStore((state) => state.setAeroGlass);
  const setAeroBubbles = useSettingsStore((state) => state.setAeroBubbles);
  const setAeroSaturation = useSettingsStore((state) => state.setAeroSaturation);
  const setAeroBackgroundMotion = useSettingsStore((state) => state.setAeroBackgroundMotion);

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="themed-panel rounded-[16px] border border-[var(--line)] bg-[var(--surface-1)] p-4 sm:p-5"
    >
      <PanelHeader title="Appearance" description="Choose the material, interaction physics and artwork atmosphere that make Localtify feel right." />

      <div className="mt-5 grid gap-3 xl:grid-cols-2">
        <SettingGroup icon={Layers3} title="Theme" description="One app, two visual materials." wide>
          <div className="grid gap-3 sm:grid-cols-2">
            <ThemeChoice
              id="oled"
              active={theme === "oled"}
              title="OLED"
              description="Pure black, restrained surfaces and album-led colour."
              onClick={() => setTheme("oled")}
            />
            <ThemeChoice
              id="aero"
              active={theme === "aero"}
              title="Frutiger Aero"
              description="Glossy glass, optimistic colour, bubbles and nature-tech atmosphere."
              onClick={() => setTheme("aero")}
            />
          </div>
        </SettingGroup>

        <SettingGroup icon={Gauge} title="Interaction physics" description="osu!-inspired hover, hold and elastic release without copying osu!'s visuals.">
          <SettingBlock label="Motion style" hint="osu! Elastic is the most tactile; Calm keeps only essential movement.">
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
          </SettingBlock>

          <SettingBlock label="Interaction bounce" hint="Controls how much hover lift, hold compression and release overshoot you feel.">
            <Segmented
              value={bounceIntensity}
              options={[
                ["subtle", "Subtle"],
                ["balanced", "Balanced"],
                ["playful", "Playful"],
              ]}
              onChange={(value) => setBounceIntensity(value as BounceIntensity)}
            />
          </SettingBlock>
        </SettingGroup>

        <SettingGroup icon={Palette} title={theme === "oled" ? "OLED canvas" : "Aero material"} description={theme === "oled" ? "Keep the canvas dark and let artwork carry the colour." : "Tune the environment and glossy material without changing the layout."}>
          {theme === "oled" ? (
            <>
              <SettingBlock label="Background" hint="OLED black stays the default.">
                <div className="flex flex-wrap items-center gap-2">
                  {(Object.entries(BACKGROUND_PRESETS) as Array<[keyof typeof BACKGROUND_PRESETS, string]>).map(([name, color]) => (
                    <Pressable
                      key={name}
                      strength="subtle"
                      flash={false}
                      onClick={() => setBackgroundColor(color)}
                      className={`relative h-9 w-12 rounded-[10px] border transition-colors ${
                        backgroundColor === color ? "border-white/70" : "border-white/[0.10] hover:border-white/28"
                      }`}
                      style={{ background: color }}
                      ariaLabel={`${name} background`}
                      title={`${name} background`}
                    >
                      {backgroundColor === color && <span className="absolute inset-x-3 bottom-1 z-10 h-0.5 rounded-full bg-white/80" />}
                    </Pressable>
                  ))}

                  <label className="flex h-9 items-center gap-2 rounded-[10px] border border-[var(--line)] bg-black/20 px-2.5 text-[9px] text-white/40">
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
            </>
          ) : (
            <>
              <SettingBlock label="Environment" hint="Change the optimistic backdrop while keeping the same interface.">
                <Segmented
                  value={aeroEnvironment}
                  options={[
                    ["sky", "Sky"],
                    ["ocean", "Ocean"],
                    ["meadow", "Meadow"],
                  ]}
                  onChange={(value) => setAeroEnvironment(value as AeroEnvironment)}
                />
              </SettingBlock>

              <SettingBlock label="Glass strength" hint="Glossy adds a stronger specular rim and deeper translucent glass.">
                <Segmented
                  value={aeroGlass}
                  options={[
                    ["light", "Light"],
                    ["balanced", "Balanced"],
                    ["glossy", "Glossy"],
                  ]}
                  onChange={(value) => setAeroGlass(value as AeroGlassStrength)}
                />
              </SettingBlock>

              <SettingBlock label="Surface saturation" hint="Tune how vivid the Aero world and glass feel.">
                <RangeControl value={aeroSaturation} min={80} max={160} step={2} suffix="%" onChange={setAeroSaturation} />
              </SettingBlock>

              <div className="grid gap-2.5 sm:grid-cols-2">
                <ToggleCard label="Bubble ambience" hint="A small transform-only bubble layer." checked={aeroBubbles} onChange={setAeroBubbles} />
                <ToggleCard label="Background motion" hint="Slow drift only; disabled by reduced-motion." checked={aeroBackgroundMotion} onChange={setAeroBackgroundMotion} />
              </div>
            </>
          )}
        </SettingGroup>

        <SettingGroup icon={Waves} title="Interface" description="Spacing and player placement stay independent from the theme.">
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

          <SettingBlock label="Accent" hint="Reserved for meaningful active states.">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(ACCENT_COLORS) as AccentPreset[]).map((preset) => (
                <Pressable
                  key={preset}
                  strength="subtle"
                  flash={false}
                  onClick={() => setAccent(preset)}
                  className={`relative h-9 w-12 rounded-[10px] border transition-colors ${
                    accent === preset ? "border-white/70" : "border-white/[0.10] hover:border-white/25"
                  }`}
                  style={{ background: ACCENT_COLORS[preset] }}
                  ariaLabel={`${preset} accent`}
                  title={`${preset} accent`}
                >
                  {accent === preset && <span className="absolute inset-x-3 bottom-1 z-10 h-0.5 rounded-full bg-black/65" />}
                </Pressable>
              ))}
            </div>
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
              <RangeControl value={heroBackdropBrightness} min={80} max={140} step={1} suffix="%" onChange={setHeroBackdropBrightness} />
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
      <p className="mt-1 text-[10px] leading-4 text-white/30">{description}</p>
    </div>
  );
}

function ThemeChoice({ id, active, title, description, onClick }: { id: ThemeId; active: boolean; title: string; description: string; onClick: () => void }) {
  return (
    <Pressable
      strength="medium"
      onClick={onClick}
      className={`themed-card min-h-28 rounded-[13px] border p-3.5 text-left ${active ? "border-white/55" : "border-white/[0.08]"}`}
    >
      <div className={`relative z-10 mb-3 h-10 overflow-hidden rounded-[9px] border border-white/[0.10] ${id === "oled" ? "bg-black" : "aero-theme-preview"}`}>
        {id === "aero" && <span className="absolute left-3 top-2 size-4 rounded-full border border-white/50 bg-white/15" />}
      </div>
      <p className="relative z-10 text-[11px] font-semibold text-white/86">{title}</p>
      <p className="relative z-10 mt-1 text-[8px] leading-4 text-white/30">{description}</p>
    </Pressable>
  );
}

function SettingGroup({ icon: Icon, title, description, children, wide = false }: { icon: LucideIcon; title: string; description: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={`themed-card rounded-[14px] border border-white/[0.07] bg-black/20 p-4 ${wide ? "xl:col-span-2" : ""}`}>
      <div className="flex items-start gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-[9px] bg-white/[0.05] text-white/52">
          <Icon className="size-3.5" />
        </span>
        <div>
          <h3 className="text-[12px] font-semibold text-white/84">{title}</h3>
          <p className="mt-1 text-[9px] leading-4 text-white/27">{description}</p>
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
        <p className="text-[10px] font-medium text-white/72">{label}</p>
        <p className="mt-1 text-[8px] leading-4 text-white/25">{hint}</p>
      </div>
      {children}
    </div>
  );
}

function Segmented({ value, options, onChange }: { value: string; options: Array<[string, string]>; onChange: (value: string) => void }) {
  return (
    <div className="inline-flex max-w-full flex-wrap gap-1 rounded-[10px] border border-[var(--line)] bg-black/20 p-1">
      {options.map(([option, label]) => (
        <Pressable
          key={option}
          strength="subtle"
          flash={false}
          onClick={() => onChange(option)}
          className={`relative rounded-[7px] px-3 py-2 text-[9px] transition-colors ${value === option ? "text-black" : "text-white/34 hover:text-white/68"}`}
        >
          {value === option && <span className="absolute inset-0 z-0 rounded-[7px] bg-[var(--accent)]" />}
          <span className="relative z-10">{label}</span>
        </Pressable>
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
      <output className="min-w-12 rounded-[8px] border border-[var(--line)] bg-black/20 px-2 py-1.5 text-center font-mono text-[8px] text-white/50">
        {value}{suffix}
      </output>
    </div>
  );
}

function ToggleCard({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <Pressable
      strength="subtle"
      flash={false}
      role="switch"
      ariaChecked={checked}
      onClick={() => onChange(!checked)}
      className="themed-card flex items-center justify-between gap-3 rounded-[11px] border border-[var(--line)] bg-white/[0.02] px-3 py-3 text-left"
    >
      <span className="relative z-10 min-w-0">
        <span className="block text-[9px] font-medium text-white/70">{label}</span>
        <span className="mt-1 block text-[8px] leading-3 text-white/25">{hint}</span>
      </span>
      <Toggle checked={checked} />
    </Pressable>
  );
}

function Toggle({ checked }: { checked: boolean }) {
  return (
    <span className={`relative z-10 h-6 w-10 shrink-0 rounded-full transition-colors ${checked ? "bg-[var(--accent)]" : "bg-white/[0.10]"}`}>
      <motion.span
        animate={{ x: checked ? 18 : 3, scale: checked ? [1, 0.9, 1] : 1 }}
        transition={{ type: "spring", stiffness: 470, damping: 25 }}
        className={`absolute left-0 top-0.5 size-5 rounded-full ${checked ? "bg-black" : "bg-white/68"}`}
      />
    </span>
  );
}
