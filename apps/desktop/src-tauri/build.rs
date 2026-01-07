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

    tauri_build::build()
}
