// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod engine;
mod oauth;
mod commands;
// mod audio;  // Temporarily disabled due to thread safety issues

use std::sync::Mutex;
use tauri::State;
use engine::TypingEngine;
use oauth::UserProfile;
use commands::zen::toggle_zen_window;
// use audio::AudioManager;

struct AppState {
    engine: Mutex<TypingEngine>,
}

#[tauri::command]
fn start_session(state: State<AppState>, text: String) {
    let mut engine = state.engine.lock().unwrap();
    engine.start(text);
}

#[tauri::command]
fn handle_keystroke(state: State<AppState>, key: String, timestamp: u64) -> Result<engine::TypingMetrics, String> {
    let mut engine = state.engine.lock().unwrap();
    let char = key.chars().next().ok_or("Invalid key")?;
    Ok(engine.push_char(char, timestamp))
}

#[tauri::command]
fn complete_session(state: State<AppState>) -> engine::TypingMetrics {
    let engine = state.engine.lock().unwrap();
    engine.calculate_metrics()
}

#[tauri::command]
async fn google_login(app: tauri::AppHandle) -> Result<UserProfile, String> {
    println!("Executing google_login command");
    oauth::perform_google_login(app).await
}

#[tauri::command]
async fn github_login(app: tauri::AppHandle) -> Result<UserProfile, String> {
    println!("Executing github_login command");
    oauth::perform_github_login(app).await
}

// Temporarily disabled - audio system needs thread safety fixes
// #[tauri::command]
// fn play_typing_sound(audio: State<AudioManager>, sound_type: String) {
//     audio.play(&sound_type);
// }
//
// #[tauri::command]
// fn set_audio_volume(audio: State<AudioManager>, volume: f32) {
//     audio.set_volume(volume);
// }
//
// #[tauri::command]
// fn toggle_audio(audio: State<AudioManager>, enabled: bool) {
//     audio.set_enabled(enabled);
// }

use tauri::Manager;
use window_vibrancy::{apply_vibrancy, apply_blur, NSVisualEffectMaterial};

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
            let app_handle = app.handle().clone();
            app.global_shortcut().register(
                "CmdOrCtrl+Alt+T",
                move |_app, _shortcut, _event| {
                    let _ = toggle_zen_window(app_handle.clone());
                }
            )?;

            Ok(())
        })
        .manage(AppState {
            engine: Mutex::new(TypingEngine::new()),
        })
        // .manage(AudioManager::new())  // Disabled for now
        .invoke_handler(tauri::generate_handler![
            start_session,
            handle_keystroke,
            complete_session,
            google_login,
            github_login,
            toggle_zen_window,
            // play_typing_sound,
            // set_audio_volume,
            // toggle_audio
        ])
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_oauth::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
