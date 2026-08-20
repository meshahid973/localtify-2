use std::{
    collections::HashMap,
    fs,
    path::{Path, PathBuf},
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

const YT_DLP_WINDOWS_URL: &str =
    "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe";

#[derive(Clone)]
pub struct DownloadManager {
    jobs: Arc<Mutex<HashMap<String, DownloadJob>>>,
    counter: Arc<AtomicU64>,
    tools_dir: Arc<PathBuf>,
}

impl DownloadManager {
    pub fn new(tools_dir: PathBuf) -> Result<Self, AppError> {
        fs::create_dir_all(&tools_dir).map_err(|error| {
            AppError::filesystem(format!(
                "Could not create download tools directory {}: {error}",
                tools_dir.display()
            ))
        })?;

        Ok(Self {
            jobs: Arc::new(Mutex::new(HashMap::new())),
            counter: Arc::new(AtomicU64::new(1)),
            tools_dir: Arc::new(tools_dir),
        })
    }

    pub fn tools(&self) -> DownloadToolsStatus {
        let yt_dlp = self.resolve_yt_dlp();
        let ffmpeg = self.resolve_ffmpeg();
        let yt_dlp_managed = yt_dlp
            .as_ref()
            .is_some_and(|path| path.starts_with(self.tools_dir.as_path()));

        DownloadToolsStatus {
            yt_dlp: yt_dlp.is_some(),
            ffmpeg: ffmpeg.is_some(),
            yt_dlp_managed,
            yt_dlp_path: path_text(yt_dlp.as_deref()),
            ffmpeg_path: path_text(ffmpeg.as_deref()),
        }
    }

    pub fn install(&self, tool: &str) -> Result<DownloadToolsStatus, AppError> {
        match tool {
            "yt-dlp" => self.install_yt_dlp()?,
            "ffmpeg" => self.install_ffmpeg()?,
            _ => return Err(AppError::invalid_input("Unknown download tool")),
        }

        Ok(self.tools())
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

        let yt_dlp = self
            .resolve_yt_dlp()
            .ok_or_else(|| AppError::download("Set up yt-dlp in Settings first"))?;
        let ffmpeg = self
            .resolve_ffmpeg()
            .ok_or_else(|| AppError::download("Set up FFmpeg in Settings first"))?;

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
        thread::spawn(move || manager.run_job(id, source, output_dir, yt_dlp, ffmpeg));

        Ok(job)
    }

    fn run_job(
        &self,
        id: String,
        source: String,
        output_dir: String,
        yt_dlp: PathBuf,
        ffmpeg: PathBuf,
    ) {
        self.update(&id, DownloadStatus::Downloading, 0.05, None);

        let mut command = Command::new(yt_dlp);
        command
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
            .arg("%(title)s.%(ext)s");

        if let Some(ffmpeg_dir) = ffmpeg.parent() {
            command.arg("--ffmpeg-location").arg(ffmpeg_dir);
        }

        let result = command.arg("--").arg(&source).status();

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

    fn resolve_yt_dlp(&self) -> Option<PathBuf> {
        let managed = self.managed_yt_dlp_path();
        if command_available_path(&managed, "--version") {
            return Some(managed);
        }

        find_command("yt-dlp").or_else(|| winget_link("yt-dlp.exe"))
    }

    fn resolve_ffmpeg(&self) -> Option<PathBuf> {
        find_command("ffmpeg").or_else(|| winget_link("ffmpeg.exe"))
    }

    #[cfg(windows)]
    fn managed_yt_dlp_path(&self) -> PathBuf {
        self.tools_dir.join("yt-dlp.exe")
    }

    #[cfg(not(windows))]
    fn managed_yt_dlp_path(&self) -> PathBuf {
        self.tools_dir.join("yt-dlp")
    }

    #[cfg(windows)]
    fn install_yt_dlp(&self) -> Result<(), AppError> {
        let destination = self.managed_yt_dlp_path();

        let mut downloaded = Command::new("curl.exe")
            .arg("-L")
            .arg("--fail")
            .arg("--silent")
            .arg("--show-error")
            .arg("-o")
            .arg(&destination)
            .arg(YT_DLP_WINDOWS_URL)
            .status()
            .map(|status| status.success())
            .unwrap_or(false);

        if !downloaded {
            let escaped_path = destination.to_string_lossy().replace('\'', "''");
            let script = format!(
                "$ProgressPreference='SilentlyContinue'; Invoke-WebRequest -UseBasicParsing -Uri '{YT_DLP_WINDOWS_URL}' -OutFile '{escaped_path}'"
            );
            downloaded = Command::new("powershell.exe")
                .arg("-NoProfile")
                .arg("-NonInteractive")
                .arg("-Command")
                .arg(script)
                .status()
                .map(|status| status.success())
                .unwrap_or(false);
        }

        if !downloaded || !command_available_path(&destination, "--version") {
            let _ = fs::remove_file(&destination);
            return Err(AppError::download(
                "Could not download a working yt-dlp executable",
            ));
        }

        Ok(())
    }

    #[cfg(not(windows))]
    fn install_yt_dlp(&self) -> Result<(), AppError> {
        Err(AppError::download(
            "Automatic yt-dlp setup is currently available on Windows",
        ))
    }

    #[cfg(windows)]
    fn install_ffmpeg(&self) -> Result<(), AppError> {
        let status = Command::new("winget.exe")
            .args([
                "install",
                "--id",
                "Gyan.FFmpeg",
                "--exact",
                "--accept-package-agreements",
                "--accept-source-agreements",
                "--silent",
            ])
            .status()
            .map_err(|error| {
                AppError::download(format!(
                    "Could not start Windows Package Manager for FFmpeg: {error}"
                ))
            })?;

        if !status.success() {
            return Err(AppError::download(format!(
                "FFmpeg setup exited with status {status}"
            )));
        }

        Ok(())
    }

    #[cfg(not(windows))]
    fn install_ffmpeg(&self) -> Result<(), AppError> {
        Err(AppError::download(
            "Automatic FFmpeg setup is currently available on Windows",
        ))
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

fn command_available_path(path: &Path, version_arg: &str) -> bool {
    path.exists()
        && Command::new(path)
            .arg(version_arg)
            .output()
            .map(|output| output.status.success())
            .unwrap_or(false)
}

#[cfg(windows)]
fn find_command(command: &str) -> Option<PathBuf> {
    let output = Command::new("where.exe").arg(command).output().ok()?;
    if !output.status.success() {
        return None;
    }

    String::from_utf8_lossy(&output.stdout)
        .lines()
        .map(str::trim)
        .find(|line| !line.is_empty())
        .map(PathBuf::from)
}

#[cfg(not(windows))]
fn find_command(command: &str) -> Option<PathBuf> {
    let output = Command::new("which").arg(command).output().ok()?;
    if !output.status.success() {
        return None;
    }

    let path = String::from_utf8_lossy(&output.stdout).trim().to_owned();
    (!path.is_empty()).then(|| PathBuf::from(path))
}

#[cfg(windows)]
fn winget_link(file_name: &str) -> Option<PathBuf> {
    let local_app_data = std::env::var_os("LOCALAPPDATA")?;
    let path = PathBuf::from(local_app_data)
        .join("Microsoft")
        .join("WinGet")
        .join("Links")
        .join(file_name);
    path.exists().then_some(path)
}

#[cfg(not(windows))]
fn winget_link(_file_name: &str) -> Option<PathBuf> {
    None
}

fn path_text(path: Option<&Path>) -> Option<String> {
    path.map(|value| value.to_string_lossy().into_owned())
}
