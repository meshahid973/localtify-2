import { invokeCommand } from "./commands";

export const appApi = {
  health: () => invokeCommand("health_check"),
  info: () => invokeCommand("get_app_info"),
} as const;
