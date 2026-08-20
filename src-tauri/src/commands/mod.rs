use std::path::Path;

use tauri::{AppHandle, State};

use crate::{
    app::AppState,
    contracts::{
        AppSettings, DownloadJob, DownloadToolsStatus, IntegrationStatus, LibrarySnapshot,
        PlayerState, RepeatMode, ScanResult,
    },
    error::AppError,
    library::scan_folder,
    types::{AppInfo, BootstrapState, HealthResponse},
};

#[tauri::command]
pub fn health_check(state: State<'_, AppState>) -> HealthResponse {
    HealthResponse {
        status: "ok".to_owned(),
        uptime_ms: state.uptime_ms(),
    }
}

#[tauri::command]
pub fn get_app_info(app: AppHandle) -> AppInfo {
    app_info(&app)
}

#[tauri::command]
pub fn get_bootstrap_state(
    app: AppHandle,
    state: State<'_, AppState>,
) -> Result<BootstrapState, AppError> {
    Ok(BootstrapState {
        app: app_info(&app),
        player: state.player.state()?,
        settings: AppSettings::default(),
        library: state.database.snapshot()?,
    })
}

#[tauri::command]
pub fn get_library_snapshot(state: State<'_, AppState>) -> Result<LibrarySnapshot, AppError> {
    state.database.snapshot()
}

#[tauri::command]
pub fn scan_library(path: String, state: State<'_, AppState>) -> Result<ScanResult, AppError> {
    let result = scan_folder(&state.database, Path::new(&path))?;
    let _ = state.watcher.watch(Path::new(&path));
    Ok(result)
}

#[tauri::command]
pub fn get_player_state(state: State<'_, AppState>) -> Result<PlayerState, AppError> {
    state.player.state()
}

#[tauri::command]
pub fn player_play_track(
    track_id: String,
    state: State<'_, AppState>,
) -> Result<PlayerState, AppError> {
    let (track, path) = state
        .database
        .track_source(&track_id)?
        .ok_or_else(|| AppError::not_found("Track no longer exists in the library"))?;

    let player_state = state.player.play(track, Path::new(&path))?;
    if let Some(current) = player_state.current_track.as_ref() {
        state.discord.update_track(current);
    }
    Ok(player_state)
}

#[tauri::command]
pub fn player_toggle(state: State<'_, AppState>) -> Result<PlayerState, AppError> {
    state.player.toggle()
}

#[tauri::command]
pub fn player_seek(
    position_ms: u64,
    state: State<'_, AppState>,
) -> Result<PlayerState, AppError> {
    state.player.seek(position_ms)
}

#[tauri::command]
pub fn player_set_volume(
    volume: f32,
    state: State<'_, AppState>,
) -> Result<PlayerState, AppError> {
    state.player.set_volume(volume)
}

#[tauri::command]
pub fn player_toggle_mute(state: State<'_, AppState>) -> Result<PlayerState, AppError> {
    state.player.toggle_mute()
}

#[tauri::command]
pub fn player_set_shuffle(
    enabled: bool,
    state: State<'_, AppState>,
) -> Result<PlayerState, AppError> {
    state.player.set_shuffle(enabled)
}

#[tauri::command]
pub fn player_set_repeat(
    repeat: RepeatMode,
    state: State<'_, AppState>,
) -> Result<PlayerState, AppError> {
    state.player.set_repeat(repeat)
}

#[tauri::command]
pub fn get_download_tools(state: State<'_, AppState>) -> DownloadToolsStatus {
    state.downloads.tools()
}

#[tauri::command]
pub async fn install_download_tool(
    tool: String,
    state: State<'_, AppState>,
) -> Result<DownloadToolsStatus, AppError> {
    let downloads = state.downloads.clone();
    tauri::async_runtime::spawn_blocking(move || downloads.install(&tool))
        .await
        .map_err(|error| AppError::download(format!("Download tool setup task failed: {error}")))?
}

#[tauri::command]
pub fn list_downloads(state: State<'_, AppState>) -> Result<Vec<DownloadJob>, AppError> {
    state.downloads.list()
}

#[tauri::command]
pub fn start_audio_download(
    source: String,
    output_dir: String,
    state: State<'_, AppState>,
) -> Result<DownloadJob, AppError> {
    state.downloads.start(source, output_dir)
}

#[tauri::command]
pub fn get_integration_status(state: State<'_, AppState>) -> Result<IntegrationStatus, AppError> {
    state.discord.status()
}

fn app_info(app: &AppHandle) -> AppInfo {
    let package = app.package_info();
    AppInfo {
        name: package.name.clone(),
        version: package.version.to_string(),
        runtime: "tauri".to_owned(),
    }
}
