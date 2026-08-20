export type PlaybackStatus = "stopped" | "playing" | "paused" | "loading" | "error";
export type RepeatMode = "off" | "all" | "one";

export interface Track {
  id: string;
  title: string;
  artistName: string;
  albumTitle: string | null;
  durationMs: number;
  artworkKey: string;
}

export interface LibraryFolder {
  path: string;
}

export interface LibrarySnapshot {
  tracks: Track[];
  folders: LibraryFolder[];
}

export interface ScanResult {
  imported: number;
  skipped: number;
  snapshot: LibrarySnapshot;
}

export interface PlayerState {
  status: PlaybackStatus;
  currentTrack: Track | null;
  positionMs: number;
  durationMs: number;
  volume: number;
  muted: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
}

export interface AppSettings {
  theme: "dark";
  volume: number;
  discordRpcEnabled: boolean;
  downloadFormat: "mp3";
}

export interface AppInfo {
  name: string;
  version: string;
  runtime: string;
}

export interface HealthResponse {
  status: string;
  uptimeMs: number;
}

export interface AppError {
  kind: "database" | "filesystem" | "audio" | "metadata" | "invalidInput" | "notFound" | "internal";
  message: string;
}
