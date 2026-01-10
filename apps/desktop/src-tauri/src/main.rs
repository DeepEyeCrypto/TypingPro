// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod engine;
mod oauth;
mod commands;
mod audio;
mod presence;
mod telemetry;
mod build_info;

use std::sync::Mutex;
use tauri::{Manager, State};
use engine::TypingEngine;
use oauth::UserProfile;
use commands::zen::toggle_zen_window;
use tauri_plugin_global_shortcut::GlobalShortcutExt;
use audio::AudioManager;
use presence::update_presence;

struct AppState {
    engine: Mutex<TypingEngine>,
    telemetry: telemetry::TelemetryManager,
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
        // Record Telemetry
        let last_timestamp = engine.get_last_timestamp();
        let latency = if last_timestamp > 0 { timestamp_ms.saturating_sub(last_timestamp) } else { 0 };
        
        let metrics = engine.push_char(c, timestamp_ms);
        
        state.telemetry.record(telemetry::KeyTelemetry {
            key: c.to_string(),
            latency_ms: latency,
            timestamp: timestamp_ms,
            is_correct: metrics.accuracy > 0.0, // Simplified check
        });

        Ok(metrics)
    } else {
        Err("Empty character received".to_string())
    }
}

#[tauri::command]
fn get_analytics_summary(state: State<AppState>) -> telemetry::AnalyticsSummary {
    state.telemetry.get_summary()
}

#[tauri::command]
fn reset_telemetry(state: State<AppState>) {
    state.telemetry.reset();
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

#[tauri::command]
async fn test_connection() -> Result<String, String> {
    use std::time::Duration;
    let client = reqwest::Client::new();
    let res = client
        .get("https://httpbin.org/ip")
        .timeout(Duration::from_secs(5))
        .send()
        .await
        .map_err(|e| e.to_string())?;
    
    Ok(res.text().await.map_err(|e| e.to_string())?)
}


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

            presence::PresenceManager::init().unwrap_or_else(|e| {
                eprintln!("Failed to initialize Discord presence: {}", e);
            });
            Ok(())
        })
        .manage(AppState {
            engine: Mutex::new(TypingEngine::new()),
            telemetry: telemetry::TelemetryManager::new(),
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                // On macOS, hide the window instead of closing it so the app keeps running
                #[cfg(target_os = "macos")]
                {
                    if window.label() == "main" {
                        window.hide().unwrap();
                        api.prevent_close();
                    }
                }
            }
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
            check_network_status,
            test_connection,
            update_presence,
            get_analytics_summary,
            reset_telemetry,
            build_info::get_build_info
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
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|_app_handle, _event| {
            // ReopenRequested is handled by platform-specific logic or plugin-shell if needed,
            // or we can use on_window_event. For now, removing the non-existent variant to fix build.
        });
}
