import type { BootstrapState, HealthResponse, AppInfo } from "./types";
import { invokeCommand } from "./commands";

export const appApi = {
  health: () => invokeCommand<HealthResponse>("health_check"),
  info: () => invokeCommand<AppInfo>("get_app_info"),
  bootstrap: () => invokeCommand<BootstrapState>("get_bootstrap_state"),
};
