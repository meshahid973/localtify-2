use std::sync::Mutex;

use discord_rich_presence::{
    activity::{Activity, ActivityType, StatusDisplayType},
    DiscordIpc, DiscordIpcClient,
};

use crate::{
    contracts::{IntegrationStatus, Track},
    error::AppError,
};

pub struct DiscordManager {
    client_id: Option<String>,
    client: Mutex<Option<DiscordIpcClient>>,
}

impl DiscordManager {
    pub fn new() -> Self {
        let client_id = std::env::var("LOCALTIFY_DISCORD_APP_ID")
            .ok()
            .filter(|value| !value.trim().is_empty());

        Self {
            client_id,
            client: Mutex::new(None),
        }
    }

    pub fn status(&self) -> Result<IntegrationStatus, AppError> {
        let connected = self
            .client
            .lock()
            .map_err(|_| AppError::discord("Discord client lock was poisoned"))?
            .is_some();

        Ok(IntegrationStatus {
            discord_configured: self.client_id.is_some(),
            discord_connected: connected,
        })
    }

    pub fn update_track(&self, track: &Track) {
        let Some(client_id) = self.client_id.as_deref() else {
            return;
        };

        let Ok(mut client_slot) = self.client.lock() else {
            return;
        };

        if client_slot.is_none() {
            let mut client = DiscordIpcClient::new(client_id);
            if client.connect().is_err() {
                return;
            }
            *client_slot = Some(client);
        }

        if let Some(client) = client_slot.as_mut() {
            let activity = Activity::new()
                .name("Localtify")
                .details(track.title.clone())
                .state(track.artist_name.clone())
                .activity_type(ActivityType::Listening)
                .status_display_type(StatusDisplayType::Details);

            if client.set_activity(activity).is_err() {
                let _ = client.close();
                *client_slot = None;
            }
        }
    }
}
