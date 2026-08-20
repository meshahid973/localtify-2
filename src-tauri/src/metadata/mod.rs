use std::{
    path::{Path, PathBuf},
    time::UNIX_EPOCH,
};

use lofty::{prelude::*, probe::Probe};

use crate::{contracts::Track, error::AppError};

pub struct ScannedTrack {
    pub track: Track,
    pub file_path: String,
    pub modified_at: i64,
}

pub fn supported_audio_file(path: &Path) -> bool {
    path.extension()
        .and_then(|extension| extension.to_str())
        .map(|extension| {
            matches!(
                extension.to_ascii_lowercase().as_str(),
                "mp3" | "flac" | "m4a" | "mp4" | "ogg" | "wav"
            )
        })
        .unwrap_or(false)
}

pub fn read_track(path: &Path) -> Result<ScannedTrack, AppError> {
    let canonical = path.canonicalize().unwrap_or_else(|_| PathBuf::from(path));
    let file_path = canonical.to_string_lossy().into_owned();
    let tagged_file = Probe::open(&canonical)
        .map_err(|error| AppError::metadata(format!("Could not probe {}: {error}", canonical.display())))?
        .read()
        .map_err(|error| AppError::metadata(format!("Could not read metadata for {}: {error}", canonical.display())))?;

    let tag = tagged_file.primary_tag().or_else(|| tagged_file.first_tag());
    let fallback_title = canonical
        .file_stem()
        .and_then(|value| value.to_str())
        .unwrap_or("Untitled")
        .trim()
        .to_owned();

    let title = tag
        .and_then(|value| value.title().map(|text| text.into_owned()))
        .filter(|value| !value.trim().is_empty())
        .unwrap_or(fallback_title);
    let artist_name = tag
        .and_then(|value| value.artist().map(|text| text.into_owned()))
        .filter(|value| !value.trim().is_empty())
        .unwrap_or_else(|| "Unknown artist".to_owned());
    let album_title = tag
        .and_then(|value| value.album().map(|text| text.into_owned()))
        .filter(|value| !value.trim().is_empty());

    let duration_ms = tagged_file
        .properties()
        .duration()
        .as_millis()
        .min(u128::from(u64::MAX)) as u64;
    let artwork_key = album_title.clone().unwrap_or_else(|| title.clone());
    let modified_at = canonical
        .metadata()
        .ok()
        .and_then(|metadata| metadata.modified().ok())
        .and_then(|modified| modified.duration_since(UNIX_EPOCH).ok())
        .map(|duration| duration.as_secs().min(i64::MAX as u64) as i64)
        .unwrap_or(0);

    Ok(ScannedTrack {
        track: Track {
            id: stable_path_id(&file_path),
            title,
            artist_name,
            album_title,
            duration_ms,
            artwork_key,
        },
        file_path,
        modified_at,
    })
}

fn stable_path_id(value: &str) -> String {
    const OFFSET: u64 = 0xcbf29ce484222325;
    const PRIME: u64 = 0x100000001b3;
    let mut hash = OFFSET;

    for byte in value.as_bytes() {
        hash ^= u64::from(*byte);
        hash = hash.wrapping_mul(PRIME);
    }

    format!("{hash:016x}")
}
