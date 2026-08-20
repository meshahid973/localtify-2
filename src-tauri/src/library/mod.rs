use std::{path::Path, sync::{Arc, Mutex}};

use notify::{Event, RecommendedWatcher, RecursiveMode, Watcher};
use walkdir::WalkDir;

use crate::{
    contracts::{ScanResult},
    database::Database,
    error::AppError,
    metadata::{read_track, supported_audio_file},
};

pub fn scan_folder(database: &Database, folder: &Path) -> Result<ScanResult, AppError> {
    if !folder.is_dir() {
        return Err(AppError::invalid_input(format!(
            "{} is not a readable music folder",
            folder.display()
        )));
    }

    let canonical = folder.canonicalize().unwrap_or_else(|_| folder.to_path_buf());
    let folder_path = canonical.to_string_lossy().into_owned();
    database.add_folder(&folder_path)?;

    let mut imported = 0usize;
    let mut skipped = 0usize;

    for entry in WalkDir::new(&canonical).follow_links(false).into_iter() {
        let Ok(entry) = entry else {
            skipped += 1;
            continue;
        };

        if !entry.file_type().is_file() || !supported_audio_file(entry.path()) {
            continue;
        }

        match read_track(entry.path()) {
            Ok(scanned) => {
                database.upsert_track(&scanned.track, &scanned.file_path, scanned.modified_at)?;
                imported += 1;
            }
            Err(_) => skipped += 1,
        }
    }

    Ok(ScanResult {
        imported,
        skipped,
        snapshot: database.snapshot()?,
    })
}

pub struct LibraryWatcher {
    watcher: Mutex<RecommendedWatcher>,
}

impl LibraryWatcher {
    pub fn new(database: Arc<Database>) -> Result<Self, AppError> {
        let callback_database = database;
        let watcher = notify::recommended_watcher(move |result: notify::Result<Event>| {
            let Ok(event) = result else {
                return;
            };

            for path in event.paths {
                if path.exists() {
                    if supported_audio_file(&path) {
                        if let Ok(scanned) = read_track(&path) {
                            let _ = callback_database.upsert_track(
                                &scanned.track,
                                &scanned.file_path,
                                scanned.modified_at,
                            );
                        }
                    }
                } else {
                    let _ = callback_database.remove_by_path(&path.to_string_lossy());
                }
            }
        })
        .map_err(|error| AppError::filesystem(format!("Could not start library watcher: {error}")))?;

        Ok(Self { watcher: Mutex::new(watcher) })
    }

    pub fn watch(&self, folder: &Path) -> Result<(), AppError> {
        let mut watcher = self
            .watcher
            .lock()
            .map_err(|_| AppError::filesystem("Library watcher lock was poisoned"))?;
        watcher
            .watch(folder, RecursiveMode::Recursive)
            .map_err(|error| AppError::filesystem(format!("Could not watch {}: {error}", folder.display())))
    }
}
