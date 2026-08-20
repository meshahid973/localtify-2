use std::{path::Path, sync::Arc, time::Instant};

use tauri::{AppHandle, Manager};

use crate::{
    database::Database,
    discord::DiscordManager,
    downloads::DownloadManager,
    library::LibraryWatcher,
    player::PlayerManager,
};

pub struct AppState {
    started_at: Instant,
    pub(crate) database: Arc<Database>,
    pub(crate) player: PlayerManager,
    pub(crate) watcher: LibraryWatcher,
    pub(crate) downloads: DownloadManager,
    pub(crate) discord: DiscordManager,
}

impl AppState {
    pub fn new(app: &AppHandle) -> Result<Self, String> {
        let data_dir = app
            .path()
            .app_data_dir()
            .map_err(|error| format!("Could not resolve Localtify app-data directory: {error}"))?;

        std::fs::create_dir_all(&data_dir)
            .map_err(|error| format!("Could not create {}: {error}", data_dir.display()))?;

        let database = Arc::new(
            Database::open(&data_dir.join("localtify.sqlite3"))
                .map_err(|error| error.message)?,
        );
        let watcher = LibraryWatcher::new(database.clone()).map_err(|error| error.message)?;

        if let Ok(folders) = database.list_folders() {
            for folder in folders {
                let _ = watcher.watch(Path::new(&folder.path));
            }
        }

        Ok(Self {
            started_at: Instant::now(),
            database,
            player: PlayerManager::new(),
            watcher,
            downloads: DownloadManager::new(),
            discord: DiscordManager::new(),
        })
    }

    pub fn uptime_ms(&self) -> u64 {
        self.started_at
            .elapsed()
            .as_millis()
            .min(u128::from(u64::MAX)) as u64
    }
}
