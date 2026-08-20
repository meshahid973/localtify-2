export interface AppInfo {
  name: string;
  version: string;
  runtime: "tauri";
}

export interface HealthResponse {
  status: "ok";
  uptimeMs: number;
}
