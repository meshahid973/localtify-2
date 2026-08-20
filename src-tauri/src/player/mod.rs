use std::{fs::File, path::Path, sync::Mutex, time::Duration};

use rodio::{Decoder, DeviceSinkBuilder, MixerDeviceSink, Player};

use crate::{
    contracts::{PlaybackStatus, PlayerState, RepeatMode, Track},
    error::AppError,
};

struct AudioBackend {
    _device: MixerDeviceSink,
    player: Player,
}

struct PlayerInner {
    backend: Option<AudioBackend>,
    state: PlayerState,
}

pub struct PlayerManager {
    inner: Mutex<PlayerInner>,
}

impl PlayerManager {
    pub fn new() -> Self {
        let backend = DeviceSinkBuilder::open_default_sink().ok().map(|device| {
            let player = Player::connect_new(device.mixer());
            AudioBackend { _device: device, player }
        });

        Self {
            inner: Mutex::new(PlayerInner {
                backend,
                state: PlayerState::default(),
            }),
        }
    }

    pub fn state(&self) -> Result<PlayerState, AppError> {
        let mut inner = self.lock()?;

        // Read the backend into plain values first so the immutable backend borrow
        // ends before we update the mutable player state.
        let backend_state = inner.backend.as_ref().map(|backend| {
            let position_ms = backend
                .player
                .get_pos()
                .as_millis()
                .min(u128::from(u64::MAX)) as u64;
            let empty = backend.player.empty();
            let paused = backend.player.is_paused();
            (position_ms, empty, paused)
        });

        if let Some((position_ms, empty, paused)) = backend_state {
            inner.state.position_ms = position_ms;

            if inner.state.current_track.is_some() && empty {
                inner.state.status = PlaybackStatus::Stopped;
            } else if inner.state.current_track.is_some() {
                inner.state.status = if paused {
                    PlaybackStatus::Paused
                } else {
                    PlaybackStatus::Playing
                };
            }
        }

        Ok(inner.state.clone())
    }

    pub fn play(&self, track: Track, path: &Path) -> Result<PlayerState, AppError> {
        let file = File::open(path)
            .map_err(|error| AppError::audio(format!("Could not open {}: {error}", path.display())))?;
        let decoder = Decoder::try_from(file)
            .map_err(|error| AppError::audio(format!("Could not decode {}: {error}", path.display())))?;

        let mut inner = self.lock()?;
        let volume = if inner.state.muted { 0.0 } else { inner.state.volume };
        let backend = inner
            .backend
            .as_mut()
            .ok_or_else(|| AppError::audio("No audio output device is available"))?;

        backend.player.clear();
        backend.player.append(decoder);
        backend.player.set_volume(volume);
        backend.player.play();

        inner.state.current_track = Some(track.clone());
        inner.state.duration_ms = track.duration_ms;
        inner.state.position_ms = 0;
        inner.state.status = PlaybackStatus::Playing;
        Ok(inner.state.clone())
    }

    pub fn toggle(&self) -> Result<PlayerState, AppError> {
        let mut inner = self.lock()?;
        if inner.state.current_track.is_none() {
            return Ok(inner.state.clone());
        }

        let should_pause = inner.state.status == PlaybackStatus::Playing;
        let backend = inner
            .backend
            .as_mut()
            .ok_or_else(|| AppError::audio("No audio output device is available"))?;

        if should_pause {
            backend.player.pause();
            inner.state.status = PlaybackStatus::Paused;
        } else {
            backend.player.play();
            inner.state.status = PlaybackStatus::Playing;
        }
        Ok(inner.state.clone())
    }

    pub fn seek(&self, position_ms: u64) -> Result<PlayerState, AppError> {
        let mut inner = self.lock()?;
        let position = position_ms.min(inner.state.duration_ms);
        let backend = inner
            .backend
            .as_mut()
            .ok_or_else(|| AppError::audio("No audio output device is available"))?;
        backend
            .player
            .try_seek(Duration::from_millis(position))
            .map_err(|error| AppError::audio(format!("Could not seek: {error}")))?;
        inner.state.position_ms = position;
        Ok(inner.state.clone())
    }

    pub fn set_volume(&self, volume: f32) -> Result<PlayerState, AppError> {
        let mut inner = self.lock()?;
        inner.state.volume = volume.clamp(0.0, 1.0);
        inner.state.muted = false;
        let effective_volume = inner.state.volume;
        if let Some(backend) = inner.backend.as_mut() {
            backend.player.set_volume(effective_volume);
        }
        Ok(inner.state.clone())
    }

    pub fn toggle_mute(&self) -> Result<PlayerState, AppError> {
        let mut inner = self.lock()?;
        inner.state.muted = !inner.state.muted;
        let effective_volume = if inner.state.muted { 0.0 } else { inner.state.volume };
        if let Some(backend) = inner.backend.as_mut() {
            backend.player.set_volume(effective_volume);
        }
        Ok(inner.state.clone())
    }

    pub fn set_shuffle(&self, enabled: bool) -> Result<PlayerState, AppError> {
        let mut inner = self.lock()?;
        inner.state.shuffle = enabled;
        Ok(inner.state.clone())
    }

    pub fn set_repeat(&self, repeat: RepeatMode) -> Result<PlayerState, AppError> {
        let mut inner = self.lock()?;
        inner.state.repeat = repeat;
        Ok(inner.state.clone())
    }

    fn lock(&self) -> Result<std::sync::MutexGuard<'_, PlayerInner>, AppError> {
        self.inner
            .lock()
            .map_err(|_| AppError::audio("Player state lock was poisoned"))
    }
}
