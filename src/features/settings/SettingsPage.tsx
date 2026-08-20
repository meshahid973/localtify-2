import { RotateCcw } from "lucide-react";
import { PageFrame, PageHeader } from "../../components/ui/Page";
import { Pressable } from "../../ui/motion/Pressable";
import { AppearanceSettings } from "./components/AppearanceSettings";
import { DownloadToolsSettings } from "./components/DownloadToolsSettings";
import { useSettingsStore } from "./settings.store";

export function SettingsPage() {
  const resetAppearance = useSettingsStore((state) => state.resetAppearance);

  return (
    <PageFrame width="medium">
      <PageHeader
        eyebrow="Localtify"
        title="Settings"
        description="Choose the material, interaction physics and local tools that fit how you listen."
        actions={
          <Pressable
            strength="subtle"
            onClick={resetAppearance}
            className="themed-button flex h-9 items-center gap-2 rounded-full border border-[var(--line)] px-4 text-[10px] text-white/44"
          >
            <span className="relative z-10 flex items-center gap-2">
              <RotateCcw className="size-3.5" />
              Reset appearance
            </span>
          </Pressable>
        }
      />

      <div className="mt-7 grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <AppearanceSettings />
        <DownloadToolsSettings />
      </div>
    </PageFrame>
  );
}
