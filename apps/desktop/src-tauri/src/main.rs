// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod engine;
mod oauth;

use std::sync::Mutex;
use tauri::State;
use engine::TypingEngine;
use oauth::{exchange_google_code, exchange_github_code, UserProfile};

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

fn main() {
    tauri::Builder::default()
        .manage(AppState {
            engine: Mutex::new(TypingEngine::new()),
        })
        .invoke_handler(tauri::generate_handler![
            start_session,
            handle_keystroke,
            complete_session,
            google_login,
            github_login
        ])
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_oauth::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
