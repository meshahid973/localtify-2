use std::{
    collections::HashMap,
    path::Path,
    process::Command,
    sync::{
        atomic::{AtomicU64, Ordering},
        Arc, Mutex,
    },
    thread,
    time::{SystemTime, UNIX_EPOCH},
};

use crate::{
    contracts::{DownloadJob, DownloadStatus, DownloadToolsStatus},
    error::AppError,
};

#[derive(Clone)]
pub struct DownloadManager {
    jobs: Arc<Mutex<HashMap<String, DownloadJob>>>,
    counter: Arc<AtomicU64>,
}

impl DownloadManager {
    pub fn new() -> Self {
        Self {
            jobs: Arc::new(Mutex::new(HashMap::new())),
            counter: Arc::new(AtomicU64::new(1)),
        }
    }

    pub fn tools(&self) -> DownloadToolsStatus {
        DownloadToolsStatus {
            yt_dlp: command_available("yt-dlp", "--version"),
            ffmpeg: command_available("ffmpeg", "-version"),
        }
    }

    pub fn list(&self) -> Result<Vec<DownloadJob>, AppError> {
        let jobs = self
            .jobs
            .lock()
            .map_err(|_| AppError::download("Download queue lock was poisoned"))?;

        let mut list = jobs.values().cloned().collect::<Vec<_>>();
        list.sort_by(|left, right| right.id.cmp(&left.id));
        Ok(list)
    }

    pub fn start(&self, source: String, output_dir: String) -> Result<DownloadJob, AppError> {
        if !(source.starts_with("https://") || source.starts_with("http://")) {
            return Err(AppError::invalid_input("Enter a valid http(s) media URL"));
        }

        if !Path::new(&output_dir).is_dir() {
            return Err(AppError::invalid_input("Choose an existing download folder"));
        }

        let tools = self.tools();
        if !tools.yt_dlp || !tools.ffmpeg {
            return Err(AppError::download(
                "yt-dlp and ffmpeg must both be available on PATH for audio downloads",
            ));
        }

        let id = self.next_id();
        let job = DownloadJob {
            id: id.clone(),
            source: source.clone(),
            output_dir: output_dir.clone(),
            progress: 0.0,
            status: DownloadStatus::Queued,
            error: None,
        };

        self.jobs
            .lock()
            .map_err(|_| AppError::download("Download queue lock was poisoned"))?
            .insert(id.clone(), job.clone());

        let manager = self.clone();
        thread::spawn(move || manager.run_job(id, source, output_dir));

        Ok(job)
    }

    fn run_job(&self, id: String, source: String, output_dir: String) {
        self.update(&id, DownloadStatus::Downloading, 0.05, None);

        let result = Command::new("yt-dlp")
            .current_dir(&output_dir)
            .arg("--no-playlist")
            .arg("--extract-audio")
            .arg("--audio-format")
            .arg("mp3")
            .arg("--audio-quality")
            .arg("0")
            .arg("--embed-metadata")
            .arg("--newline")
            .arg("--output")
            .arg("%(title)s.%(ext)s")
            .arg("--")
            .arg(&source)
            .status();

        match result {
            Ok(status) if status.success() => {
                self.update(&id, DownloadStatus::Completed, 1.0, None);
            }
            Ok(status) => {
                self.update(
                    &id,
                    DownloadStatus::Failed,
                    0.0,
                    Some(format!("yt-dlp exited with status {status}")),
                );
            }
            Err(error) => {
                self.update(
                    &id,
                    DownloadStatus::Failed,
                    0.0,
                    Some(format!("Could not start yt-dlp: {error}")),
                );
            }
        }
    }

    fn update(&self, id: &str, status: DownloadStatus, progress: f32, error: Option<String>) {
        if let Ok(mut jobs) = self.jobs.lock() {
            if let Some(job) = jobs.get_mut(id) {
                job.status = status;
                job.progress = progress;
                job.error = error;
            }
        }
    }

    fn next_id(&self) -> String {
        let millis = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map(|value| value.as_millis())
            .unwrap_or_default();
        let counter = self.counter.fetch_add(1, Ordering::Relaxed);
        format!("dl-{millis:020}-{counter:06}")
    }
}

fn command_available(command: &str, version_arg: &str) -> bool {
    Command::new(command)
        .arg(version_arg)
        .output()
        .map(|output| output.status.success())
        .unwrap_or(false)
}
