use serde::Serialize;
use tauri::command;

#[derive(Debug, Serialize)]
pub struct BuildInfo {
    pub version: String,
    pub commit_hash: String,
    pub target_os: String,
    pub env: String,
}

#[command]
pub fn get_build_info() -> BuildInfo {
    BuildInfo {
        version: env!("CARGO_PKG_VERSION").to_string(),
        commit_hash: env!("GIT_HASH").to_string(), // Requires GIT_HASH env var at build time
        target_os: std::env::consts::OS.to_string(),
        env: if cfg!(debug_assertions) {
            "Development".to_string()
        } else {
            "Production".to_string()
        },
    }
}
