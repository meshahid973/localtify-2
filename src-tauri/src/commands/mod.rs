use tauri::{AppHandle, Manager, State};

use crate::{
    app::AppState,
    contracts::{AppSettings, PlayerState},
    types::{AppInfo, BootstrapState, HealthResponse},
};

#[tauri::command]
pub fn health_check(state: State<'_, AppState>) -> HealthResponse {
    HealthResponse { status: "ok".to_owned(), uptime_ms: state.uptime_ms() }
}

#[tauri::command]
pub fn get_app_info(app: AppHandle) -> AppInfo { app_info(&app) }

#[tauri::command]
pub fn get_bootstrap_state(app: AppHandle) -> BootstrapState {
    BootstrapState { app: app_info(&app), player: PlayerState::default(), settings: AppSettings::default() }
}

fn app_info(app: &AppHandle) -> AppInfo {
    let package = app.package_info();
    AppInfo { name: package.name.clone(), version: package.version.to_string(), runtime: "tauri".to_owned() }
}
