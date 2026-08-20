export type PlaybackStatus = "stopped" | "playing" | "paused" | "loading" | "error";
export type RepeatMode = "off" | "all" | "one";
export type DownloadStatus =
  | "queued"
  | "resolving"
  | "downloading"
  | "converting"
  | "tagging"
  | "importing"
  | "completed"
  | "cancelled"
  | "failed";

export interface ArtistSummary {
  id: string;
  name: string;
}

export interface AlbumSummary {
  id: string;
  title: string;
  artistName: string;
  year: number | null;
  artworkKey: string;
}

export interface Track {
  id: string;
  title: string;
  artistName: string;
  albumTitle: string | null;
  durationMs: number;
  artworkKey: string;
}

export interface PlaylistSummary {
  id: string;
  name: string;
  trackCount: number;
}

export interface PlayerState {
  status: PlaybackStatus;
  currentTrackId: string | null;
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
  title: string;
  progress: number;
  status: DownloadStatus;
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
