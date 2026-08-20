use std::{path::Path, sync::Mutex};

use rusqlite::{params, Connection, OptionalExtension};

use crate::{
    contracts::{LibraryFolder, LibrarySnapshot, Track},
    error::AppError,
};

pub struct Database {
    connection: Mutex<Connection>,
}

impl Database {
    pub fn open(path: &Path) -> Result<Self, AppError> {
        let connection = Connection::open(path)
            .map_err(|error| AppError::database(format!("Could not open library database: {error}")))?;

        connection
            .execute_batch(
                "PRAGMA journal_mode = WAL;
                 PRAGMA foreign_keys = ON;

                 CREATE TABLE IF NOT EXISTS library_folders (
                    path TEXT PRIMARY KEY NOT NULL,
                    added_at INTEGER NOT NULL DEFAULT (unixepoch())
                 );

                 CREATE TABLE IF NOT EXISTS tracks (
                    id TEXT PRIMARY KEY NOT NULL,
                    title TEXT NOT NULL,
                    artist_name TEXT NOT NULL,
                    album_title TEXT,
                    duration_ms INTEGER NOT NULL,
                    artwork_key TEXT NOT NULL,
                    file_path TEXT NOT NULL UNIQUE,
                    modified_at INTEGER NOT NULL DEFAULT 0
                 );

                 CREATE INDEX IF NOT EXISTS idx_tracks_title ON tracks(title COLLATE NOCASE);
                 CREATE INDEX IF NOT EXISTS idx_tracks_artist ON tracks(artist_name COLLATE NOCASE);",
            )
            .map_err(|error| AppError::database(format!("Could not migrate library database: {error}")))?;

        Ok(Self { connection: Mutex::new(connection) })
    }

    pub fn snapshot(&self) -> Result<LibrarySnapshot, AppError> {
        Ok(LibrarySnapshot {
            tracks: self.list_tracks()?,
            folders: self.list_folders()?,
        })
    }

    pub fn list_tracks(&self) -> Result<Vec<Track>, AppError> {
        let connection = self.lock()?;
        let mut statement = connection
            .prepare(
                "SELECT id, title, artist_name, album_title, duration_ms, artwork_key
                 FROM tracks
                 ORDER BY title COLLATE NOCASE, artist_name COLLATE NOCASE",
            )
            .map_err(|error| AppError::database(error.to_string()))?;

        let rows = statement
            .query_map([], |row| {
                let duration: i64 = row.get(4)?;
                Ok(Track {
                    id: row.get(0)?,
                    title: row.get(1)?,
                    artist_name: row.get(2)?,
                    album_title: row.get(3)?,
                    duration_ms: duration.max(0) as u64,
                    artwork_key: row.get(5)?,
                })
            })
            .map_err(|error| AppError::database(error.to_string()))?;

        rows.collect::<Result<Vec<_>, _>>()
            .map_err(|error| AppError::database(error.to_string()))
    }

    pub fn list_folders(&self) -> Result<Vec<LibraryFolder>, AppError> {
        let connection = self.lock()?;
        let mut statement = connection
            .prepare("SELECT path FROM library_folders ORDER BY added_at, path")
            .map_err(|error| AppError::database(error.to_string()))?;
        let rows = statement
            .query_map([], |row| Ok(LibraryFolder { path: row.get(0)? }))
            .map_err(|error| AppError::database(error.to_string()))?;

        rows.collect::<Result<Vec<_>, _>>()
            .map_err(|error| AppError::database(error.to_string()))
    }

    pub fn add_folder(&self, path: &str) -> Result<(), AppError> {
        let connection = self.lock()?;
        connection
            .execute(
                "INSERT OR IGNORE INTO library_folders(path) VALUES (?1)",
                params![path],
            )
            .map_err(|error| AppError::database(error.to_string()))?;
        Ok(())
    }

    pub fn upsert_track(
        &self,
        track: &Track,
        file_path: &str,
        modified_at: i64,
    ) -> Result<(), AppError> {
        let connection = self.lock()?;
        connection
            .execute(
                "INSERT INTO tracks(id, title, artist_name, album_title, duration_ms, artwork_key, file_path, modified_at)
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
                 ON CONFLICT(file_path) DO UPDATE SET
                    id = excluded.id,
                    title = excluded.title,
                    artist_name = excluded.artist_name,
                    album_title = excluded.album_title,
                    duration_ms = excluded.duration_ms,
                    artwork_key = excluded.artwork_key,
                    modified_at = excluded.modified_at",
                params![
                    track.id,
                    track.title,
                    track.artist_name,
                    track.album_title,
                    track.duration_ms as i64,
                    track.artwork_key,
                    file_path,
                    modified_at,
                ],
            )
            .map_err(|error| AppError::database(error.to_string()))?;
        Ok(())
    }

    pub fn remove_by_path(&self, file_path: &str) -> Result<(), AppError> {
        let connection = self.lock()?;
        connection
            .execute("DELETE FROM tracks WHERE file_path = ?1", params![file_path])
            .map_err(|error| AppError::database(error.to_string()))?;
        Ok(())
    }

    pub fn track_source(&self, id: &str) -> Result<Option<(Track, String)>, AppError> {
        let connection = self.lock()?;
        connection
            .query_row(
                "SELECT id, title, artist_name, album_title, duration_ms, artwork_key, file_path
                 FROM tracks WHERE id = ?1",
                params![id],
                |row| {
                    let duration: i64 = row.get(4)?;
                    Ok((
                        Track {
                            id: row.get(0)?,
                            title: row.get(1)?,
                            artist_name: row.get(2)?,
                            album_title: row.get(3)?,
                            duration_ms: duration.max(0) as u64,
                            artwork_key: row.get(5)?,
                        },
                        row.get(6)?,
                    ))
                },
            )
            .optional()
            .map_err(|error| AppError::database(error.to_string()))
    }

    fn lock(&self) -> Result<std::sync::MutexGuard<'_, Connection>, AppError> {
        self.connection
            .lock()
            .map_err(|_| AppError::database("Library database lock was poisoned"))
    }
}
