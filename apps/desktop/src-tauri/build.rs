use std::fs;
use std::path::Path;

fn main() {
    // Read .env from one directory up (apps/desktop/.env)
    let env_path = Path::new("../.env");
    println!("cargo:rerun-if-changed={}", env_path.display());

    if env_path.exists() {
        if let Ok(contents) = fs::read_to_string(env_path) {
            for line in contents.lines() {
                // simple parse, ignore comments
                let line = line.trim();
                if line.is_empty() || line.starts_with('#') {
                    continue;
                }
                if let Some((key, value)) = line.split_once('=') {
                    let key = key.trim();
                    let value = value.trim();
                    if key == "TAURI_GOOGLE_CLIENT_SECRET" {
                        println!("cargo:rustc-env={}={}", key, value);
                    }
                }
            }
        }
    }

    // Inject Git Hash
    let git_hash = std::process::Command::new("git")
        .args(&["rev-parse", "--short", "HEAD"])
        .output()
        .ok()
        .and_then(|output| String::from_utf8(output.stdout).ok())
        .map(|s| s.trim().to_string())
        .unwrap_or_else(|| "unknown".to_string());
    println!("cargo:rustc-env=GIT_HASH={}", git_hash);

    tauri_build::build()
}
