import { invoke } from "@tauri-apps/api/core";
import type { AppInfo, HealthResponse } from "./types";

interface CommandResults {
  health_check: HealthResponse;
  get_app_info: AppInfo;
}

export type CommandName = keyof CommandResults;

export function invokeCommand<K extends CommandName>(
  command: K,
): Promise<CommandResults[K]> {
  return invoke<CommandResults[K]>(command);
}
