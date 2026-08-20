use std::path::Path;

use tauri::{AppHandle, State};

use crate::{
    app::AppState,
    contracts::{AppSettings, LibrarySnapshot, PlayerState, RepeatMode, ScanResult},
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
    state.player.play(track, Path::new(&path))
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

fn app_info(app: &AppHandle) -> AppInfo {
    let package = app.package_info();
    AppInfo {
        name: package.name.clone(),
        version: package.version.to_string(),
        runtime: "tauri".to_owned(),
    }
}
