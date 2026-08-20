mod app;
mod commands;
mod types;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(app::AppState::default())
        .invoke_handler(tauri::generate_handler![
            commands::health_check,
            commands::get_app_info,
        ])
        .run(tauri::generate_context!())
        .expect("failed to run Localtify");
}
