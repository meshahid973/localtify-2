import { Check, Download, Gauge, Palette, RotateCcw, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";
import { useDownloadsStore } from "../downloads/downloads.store";
import {
  ACCENT_COLORS,
  type AccentPreset,
  type DensityPreference,
  type MotionPreference,
  type PlayerStyle,
  useSettingsStore,
} from "./settings.store";

export function SettingsPage() {
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
  const resetAppearance = useSettingsStore((state) => state.resetAppearance);

  const tools = useDownloadsStore((state) => state.tools);
  const installing = useDownloadsStore((state) => state.installing);
  const toolError = useDownloadsStore((state) => state.error);
  const hydrateTools = useDownloadsStore((state) => state.hydrate);
  const installTool = useDownloadsStore((state) => state.installTool);

  useEffect(() => {
    void hydrateTools();
  }, [hydrateTools]);

  return (
    <main className="mx-auto w-full max-w-[1180px] px-7 pb-16 pt-7 lg:px-10">
      <motion.header
        initial={reduceMotion ? false : { opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-end gap-4"
      >
        <div>
          <p className="text-[10px] font-medium text-white/28">Make it yours</p>
          <h1 className="mt-1 text-[32px] font-semibold tracking-[-0.055em]">Settings</h1>
        </div>
        <button
          type="button"
          onClick={resetAppearance}
          className="ml-auto flex h-9 items-center gap-2 rounded-full border border-white/[0.07] px-4 text-[10px] text-white/42 transition-colors hover:bg-white/[0.045] hover:text-white/75"
        >
          <RotateCcw className="size-3.5" />
          Reset appearance
        </button>
      </motion.header>

      <div className="mt-7 grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.34, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[18px] border border-white/[0.055] bg-[#090909] p-5"
        >
          <SectionTitle icon={Palette} title="Appearance" description="OLED stays black. These only tune the details." />

          <SettingBlock label="Accent" hint="Used for active playback and tiny status details.">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(ACCENT_COLORS) as AccentPreset[]).map((preset) => (
                <motion.button
                  key={preset}
                  type="button"
                  whileHover={reduceMotion ? undefined : { y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAccent(preset)}
                  className={`relative size-9 rounded-full border transition-colors ${
                    accent === preset ? "border-white/70" : "border-white/[0.08] hover:border-white/20"
                  }`}
                  style={{ background: ACCENT_COLORS[preset] }}
                  aria-label={`${preset} accent`}
                  title={`${preset} accent`}
                >
                  {accent === preset && <span className="absolute inset-0 m-auto size-2 rounded-full bg-black/70" />}
                </motion.button>
              ))}
            </div>
          </SettingBlock>

          <SettingBlock label="Motion" hint="Controls Localtify's page and card animation intensity.">
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

          <SettingBlock label="Density" hint="Compact mode reduces sidebar and player height.">
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

          <SettingBlock label="Artwork glow" hint="Adds a very soft accent glow around featured artwork.">
            <Toggle checked={artworkGlow} onChange={setArtworkGlow} />
          </SettingBlock>
        </motion.section>

        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.34, delay: 0.09, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[18px] border border-white/[0.055] bg-[#090909] p-5"
        >
          <SectionTitle icon={Wrench} title="Download tools" description="One-time setup for audio downloads and MP3 conversion." />

          <div className="mt-5 space-y-3">
            <ToolRow
              name="yt-dlp"
              description={tools?.ytDlpManaged ? "Managed by Localtify" : tools?.ytDlp ? "Detected on this PC" : "Not installed"}
              path={tools?.ytDlpPath ?? null}
              ready={Boolean(tools?.ytDlp)}
              busy={installing === "yt-dlp"}
              buttonLabel={tools?.ytDlpManaged ? "Ready" : tools?.ytDlp ? "Manage locally" : "Set up"}
              onInstall={() => void installTool("yt-dlp")}
            />

            <ToolRow
              name="FFmpeg"
              description={tools?.ffmpeg ? "Ready for MP3 conversion" : "Required for conversion"}
              path={tools?.ffmpegPath ?? null}
              ready={Boolean(tools?.ffmpeg)}
              busy={installing === "ffmpeg"}
              buttonLabel={tools?.ffmpeg ? "Ready" : "Set up"}
              onInstall={() => void installTool("ffmpeg")}
            />
          </div>

          <div className="mt-5 rounded-[12px] border border-white/[0.045] bg-black px-4 py-3 text-[9px] leading-5 text-white/28">
            yt-dlp is stored inside Localtify's app-data folder. On Windows, FFmpeg setup uses Windows Package Manager. Downloads only start when both tools are ready.
          </div>

          {toolError && (
            <div className="mt-3 rounded-[10px] border border-red-400/15 bg-red-500/[0.06] px-3 py-2 text-[9px] text-red-200/80">
              {toolError}
            </div>
          )}
        </motion.section>
      </div>
    </main>
  );
}

function SectionTitle({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-white/[0.045] text-white/55">
        <Icon className="size-4" />
      </span>
      <div>
        <h2 className="text-[17px] font-semibold tracking-[-0.03em]">{title}</h2>
        <p className="mt-1 text-[10px] leading-4 text-white/28">{description}</p>
      </div>
    </div>
  );
}

function SettingBlock({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 border-t border-white/[0.045] pt-4">
      <div className="mb-3">
        <p className="text-[11px] font-medium text-white/72">{label}</p>
        <p className="mt-1 text-[9px] text-white/24">{hint}</p>
      </div>
      {children}
    </div>
  );
}

function Segmented({ value, options, onChange }: { value: string; options: Array<[string, string]>; onChange: (value: string) => void }) {
  return (
    <div className="inline-flex rounded-[10px] border border-white/[0.055] bg-black p-1">
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

function ToolRow({
  name,
  description,
  path,
  ready,
  busy,
  buttonLabel,
  onInstall,
}: {
  name: string;
  description: string;
  path: string | null;
  ready: boolean;
  busy: boolean;
  buttonLabel: string;
  onInstall: () => void;
}) {
  return (
    <div className="rounded-[12px] border border-white/[0.05] bg-black p-4">
      <div className="flex items-center gap-3">
        <span className={`grid size-8 place-items-center rounded-full ${ready ? "bg-white/[0.045] text-[var(--accent)]" : "bg-white/[0.045] text-white/28"}`}>
          {ready ? <Check className="size-4" /> : name === "yt-dlp" ? <Download className="size-4" /> : <Gauge className="size-4" />}
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-white/78">{name}</p>
          <p className="mt-0.5 text-[9px] text-white/26">{description}</p>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          disabled={busy || (ready && buttonLabel === "Ready")}
          onClick={onInstall}
          className="ml-auto rounded-full border border-white/[0.07] px-3 py-2 text-[9px] text-white/48 transition-colors hover:bg-white/[0.045] hover:text-white/75 disabled:opacity-35"
        >
          {busy ? "Setting up…" : buttonLabel}
        </motion.button>
      </div>
      {path && <p className="mt-3 truncate text-[8px] text-white/16">{path}</p>}
    </div>
  );
}
