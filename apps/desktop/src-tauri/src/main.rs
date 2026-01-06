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
use tauri_plugin_global_shortcut::GlobalShortcutExt;
// use audio::AudioManager;

struct AppState {
    engine: Mutex<TypingEngine>,
}

#[tauri::command]
fn start_session(_state: State<AppState>) {
    // state.engine.lock().unwrap().start_session();
}

#[tauri::command]
fn handle_keystroke(_app: tauri::AppHandle, _char: String) -> Result<String, String> {
    // TODO: Implement typing logic
    Ok(format!("Key received: {}", _char))
}

#[tauri::command]
fn complete_session(_state: State<AppState>) -> f32 {
    // state.engine.lock().unwrap().complete_session()
    0.0
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
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};

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
