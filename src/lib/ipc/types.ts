export type { AppInfo, HealthResponse } from "../contracts/domain";

export interface BootstrapState {
  app: import("../contracts/domain").AppInfo;
  player: import("../contracts/domain").PlayerState;
  settings: import("../contracts/domain").AppSettings;
  library: import("../contracts/domain").LibrarySnapshot;
}
