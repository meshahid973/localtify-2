import { isTauri } from "@tauri-apps/api/core";
import { appApi } from "../lib/ipc/app-api";
import type { AppInfo } from "../lib/ipc/types";

export type RuntimeState =
  | { kind: "checking" }
  | { kind: "browser" }
  | { kind: "ready"; app: AppInfo }
  | { kind: "error" };

export async function inspectRuntime(): Promise<RuntimeState> {
  if (!isTauri()) {
    return { kind: "browser" };
  }

  try {
    const [health, app] = await Promise.all([
      appApi.health(),
      appApi.info(),
    ]);

    if (health.status !== "ok") {
      return { kind: "error" };
    }

    return { kind: "ready", app };
  } catch (error) {
    console.error("Localtify native bridge startup check failed.", error);
    return { kind: "error" };
  }
}
