use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum AppErrorKind { Database, Filesystem, Audio, Metadata, Download, Network, Discord, InvalidInput, NotFound, Internal }

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AppError { pub kind: AppErrorKind, pub message: String }

impl AppError {
    pub fn internal(message: impl Into<String>) -> Self {
        Self { kind: AppErrorKind::Internal, message: message.into() }
    }
}
