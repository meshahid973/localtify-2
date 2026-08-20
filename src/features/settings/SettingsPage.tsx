import { useState } from "react";
import { Palette, RotateCcw, Wrench } from "lucide-react";
import { PageFrame, PageHeader } from "../../components/ui/Page";
import { Pressable } from "../../ui/motion/Pressable";
import { AppearanceSettings } from "./components/AppearanceSettings";
import { DownloadToolsSettings } from "./components/DownloadToolsSettings";
import { useSettingsStore } from "./settings.store";

type SettingsSection = "appearance" | "tools";

export function SettingsPage() {
  const [section, setSection] = useState<SettingsSection>("appearance");
  const resetAppearance = useSettingsStore((state) => state.resetAppearance);

  return (
    <PageFrame width="medium">
      <PageHeader
        eyebrow="Localtify"
        title="Settings"
        description="A few useful controls, kept out of the way."
        actions={
          section === "appearance" ? (
            <Pressable
              strength="subtle"
              onClick={resetAppearance}
              className="themed-button flex h-9 items-center gap-2 rounded-full border border-[var(--line)] px-4 text-[10px] text-white/44"
            >
              <span className="relative z-10 flex items-center gap-2">
                <RotateCcw className="size-3.5" />
                Reset
              </span>
            </Pressable>
          ) : undefined
        }
      />

      <div className="mt-6 inline-flex rounded-[12px] border border-[var(--line)] bg-[var(--surface-1)] p-1">
        <SettingsTab
          active={section === "appearance"}
          icon={Palette}
          label="Appearance"
          onClick={() => setSection("appearance")}
        />
        <SettingsTab
          active={section === "tools"}
          icon={Wrench}
          label="Download tools"
          onClick={() => setSection("tools")}
        />
      </div>

      <div className="mt-4">
        {section === "appearance" ? <AppearanceSettings /> : <DownloadToolsSettings />}
      </div>
    </PageFrame>
  );
}

function SettingsTab({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof Palette;
  label: string;
  onClick: () => void;
}) {
  return (
    <Pressable
      strength="subtle"
      flash={false}
      onClick={onClick}
      className={`min-w-[128px] rounded-[9px] px-3 py-2.5 text-[9px] font-semibold transition-colors ${
        active ? "bg-white text-black" : "text-white/34 hover:text-white/70"
      }`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        <Icon className="size-3.5" />
        {label}
      </span>
    </Pressable>
  );
}
