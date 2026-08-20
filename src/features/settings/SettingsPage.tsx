import { RotateCcw } from "lucide-react";
import { PageFrame, PageHeader } from "../../components/ui/Page";
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
        description="Keep the app quiet by default, then tune the few details that matter to you."
        actions={
          <button
            type="button"
            onClick={resetAppearance}
            className="flex h-9 items-center gap-2 rounded-full border border-[var(--line)] px-4 text-[10px] text-white/40 transition-colors hover:bg-white/[0.035] hover:text-white/72"
          >
            <RotateCcw className="size-3.5" />
            Reset appearance
          </button>
        }
      />

      <div className="mt-7 grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <AppearanceSettings />
        <DownloadToolsSettings />
      </div>
    </PageFrame>
  );
}
