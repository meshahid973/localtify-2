use std::time::Instant;

pub struct AppState {
    started_at: Instant,
}

impl AppState {
    pub fn uptime_ms(&self) -> u64 {
        let elapsed = self.started_at.elapsed().as_millis();
        elapsed.min(u128::from(u64::MAX)) as u64
    }
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            started_at: Instant::now(),
        }
    }
}
