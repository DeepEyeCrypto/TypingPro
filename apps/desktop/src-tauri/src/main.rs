// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod engine;
mod oauth;
mod commands;
mod audio;

use std::sync::Mutex;
use tauri::State;
use engine::TypingEngine;
use oauth::UserProfile;
use commands::zen::toggle_zen_window;
use tauri_plugin_global_shortcut::GlobalShortcutExt;
use audio::AudioManager;

struct AppState {
    engine: Mutex<TypingEngine>,
}

#[tauri::command]
fn start_session(text: String, state: State<AppState>) {
    state.engine.lock().unwrap().start(text);
}

#[tauri::command]
fn handle_keystroke(_app: tauri::AppHandle, char_str: String, timestamp_ms: u64, state: State<AppState>) -> Result<engine::TypingMetrics, String> {
    let mut engine = state.engine.lock().unwrap();
    
    // Parse the first char from string (frontend sends string)
    if let Some(c) = char_str.chars().next() {
        let metrics = engine.push_char(c, timestamp_ms);
        Ok(metrics)
    } else {
        Err("Empty character received".to_string())
    }
}

#[tauri::command]
fn complete_session(state: State<AppState>) -> engine::TypingMetrics {
    state.engine.lock().unwrap().calculate_metrics()
}

#[tauri::command]
async fn google_login(_app: tauri::AppHandle) -> Result<UserProfile, String> {
    println!("Executing google_login command");
    oauth::perform_google_login(_app).await
}

#[tauri::command]
async fn github_login(_app: tauri::AppHandle) -> Result<UserProfile, String> {
    println!("Executing github_login command");
    oauth::perform_github_login(_app).await
}

#[tauri::command]
fn play_typing_sound(audio: State<AudioManager>, sound_type: String) {
    audio.play(sound_type);
}

#[tauri::command]
fn set_audio_volume(audio: State<AudioManager>, volume: f32) {
    audio.set_volume(volume);
}

#[tauri::command]
async fn check_network_status() -> Result<String, String> {
    use std::net::ToSocketAddrs;
    match "google.com:80".to_socket_addrs() {
        Ok(_) => Ok("Online".to_string()),
        Err(e) => Err(format!("Offline: {}", e)),
    }
}

use tauri::Manager;
#[cfg(target_os = "macos")]
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};
#[cfg(target_os = "windows")]
use window_vibrancy::apply_blur;

mod logger;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // Initialize Logger
            logger::init_logging(app).expect("Failed to initialize logger");

            let window = app.get_webview_window("main").unwrap();

            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            #[cfg(target_os = "windows")]
            apply_blur(&window, Some((18, 18, 18, 125)))
                .expect("Unsupported platform! 'apply_blur' is only supported on Windows");

            // Register global shortcut for Zen Mode (Cmd/Ctrl+Alt+T)
            app.global_shortcut().register("CmdOrCtrl+Alt+T")?;

            // Initialize Audio
            let audio_manager = AudioManager::new(app.handle().clone());
            app.manage(audio_manager);

            Ok(())
        })
        .manage(AppState {
            engine: Mutex::new(TypingEngine::new()),
        })
        .invoke_handler(tauri::generate_handler![
            start_session,
            handle_keystroke,
            complete_session,
            google_login,
            github_login,
            toggle_zen_window,
            play_typing_sound,
            set_audio_volume,
            check_network_status
        ])
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_handler(|app, shortcut, event| {
                    use tauri_plugin_global_shortcut::ShortcutState;
                    // Tauri v2: Use to_string() to match the registered shortcut
                    if shortcut.to_string().to_lowercase() == "cmdorctrl+alt+t" 
                        && event.state() == ShortcutState::Pressed 
                    {
                        let _ = toggle_zen_window(app.clone());
                    }
                })
                .build()
        )
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_oauth::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
