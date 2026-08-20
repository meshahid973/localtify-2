mod app;
mod commands;
mod contracts;
mod database;
mod error;
mod library;
mod metadata;
mod player;
mod types;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            let state = app::AppState::new(app.handle()).map_err(std::io::Error::other)?;
            app.manage(state);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::health_check,
            commands::get_app_info,
            commands::get_bootstrap_state,
            commands::get_library_snapshot,
            commands::scan_library,
            commands::get_player_state,
            commands::player_play_track,
            commands::player_toggle,
            commands::player_seek,
            commands::player_set_volume,
            commands::player_toggle_mute,
            commands::player_set_shuffle,
            commands::player_set_repeat,
        ])
        .run(tauri::generate_context!())
        .expect("failed to run Localtify");
}
