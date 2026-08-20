use serde::{Deserialize, Serialize};
use crate::contracts::{AppSettings, PlayerState};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppInfo { pub name: String, pub version: String, pub runtime: String }

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HealthResponse { pub status: String, pub uptime_ms: u64 }

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BootstrapState { pub app: AppInfo, pub player: PlayerState, pub settings: AppSettings }
