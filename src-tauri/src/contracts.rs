use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ArtistSummary { pub id: String, pub name: String }

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AlbumSummary { pub id: String, pub title: String, pub artist_name: String, pub year: Option<u16>, pub artwork_key: String }

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Track { pub id: String, pub title: String, pub artist_name: String, pub album_title: Option<String>, pub duration_ms: u64, pub artwork_key: String }

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PlaylistSummary { pub id: String, pub name: String, pub track_count: u32 }

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum PlaybackStatus { Stopped, Playing, Paused, Loading, Error }

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum RepeatMode { Off, All, One }

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PlayerState {
    pub status: PlaybackStatus,
    pub current_track_id: Option<String>,
    pub position_ms: u64,
    pub duration_ms: u64,
    pub volume: f32,
    pub muted: bool,
    pub shuffle: bool,
    pub repeat: RepeatMode,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum DownloadStatus { Queued, Resolving, Downloading, Converting, Tagging, Importing, Completed, Cancelled, Failed }

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DownloadJob { pub id: String, pub source: String, pub title: String, pub progress: f32, pub status: DownloadStatus }

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppSettings { pub theme: String, pub volume: f32, pub discord_rpc_enabled: bool, pub download_format: String }

impl Default for PlayerState {
    fn default() -> Self {
        Self { status: PlaybackStatus::Stopped, current_track_id: None, position_ms: 0, duration_ms: 0, volume: 0.72, muted: false, shuffle: false, repeat: RepeatMode::Off }
    }
}

impl Default for AppSettings {
    fn default() -> Self {
        Self { theme: "dark".to_owned(), volume: 0.72, discord_rpc_enabled: true, download_format: "mp3".to_owned() }
    }
}
