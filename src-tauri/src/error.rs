use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum AppErrorKind {
    Database,
    Filesystem,
    Audio,
    Metadata,
    Download,
    Discord,
    InvalidInput,
    NotFound,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AppError {
    pub kind: AppErrorKind,
    pub message: String,
}

impl AppError {
    pub fn new(kind: AppErrorKind, message: impl Into<String>) -> Self {
        Self { kind, message: message.into() }
    }

    pub fn database(message: impl Into<String>) -> Self { Self::new(AppErrorKind::Database, message) }
    pub fn filesystem(message: impl Into<String>) -> Self { Self::new(AppErrorKind::Filesystem, message) }
    pub fn audio(message: impl Into<String>) -> Self { Self::new(AppErrorKind::Audio, message) }
    pub fn metadata(message: impl Into<String>) -> Self { Self::new(AppErrorKind::Metadata, message) }
    pub fn download(message: impl Into<String>) -> Self { Self::new(AppErrorKind::Download, message) }
    pub fn discord(message: impl Into<String>) -> Self { Self::new(AppErrorKind::Discord, message) }
    pub fn invalid_input(message: impl Into<String>) -> Self { Self::new(AppErrorKind::InvalidInput, message) }
    pub fn not_found(message: impl Into<String>) -> Self { Self::new(AppErrorKind::NotFound, message) }
}
