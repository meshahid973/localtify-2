export type PlaybackStatus = "stopped" | "playing" | "paused" | "loading" | "error";
export type RepeatMode = "off" | "all" | "one";
export type DownloadStatus = "queued" | "downloading" | "completed" | "failed";

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

export interface DownloadJob {
  id: string;
  source: string;
  outputDir: string;
  progress: number;
  status: DownloadStatus;
  error: string | null;
}

export interface DownloadToolsStatus {
  ytDlp: boolean;
  ffmpeg: boolean;
  ytDlpManaged: boolean;
  ytDlpPath: string | null;
  ffmpegPath: string | null;
}

export interface IntegrationStatus {
  discordConfigured: boolean;
  discordConnected: boolean;
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
