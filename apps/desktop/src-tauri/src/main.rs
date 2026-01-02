// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod engine;
mod oauth;

use std::sync::Mutex;
use tauri::State;
use engine::TypingEngine;
use oauth::{get_google_auth_url, get_github_auth_url, exchange_google_code, exchange_github_code, UserProfile};

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
fn google_auth_start() -> String {
    get_google_auth_url()
}

#[tauri::command]
fn github_auth_start() -> String {
    get_github_auth_url()
}

#[tauri::command]
async fn google_auth_finish(code: String) -> Result<UserProfile, String> {
    exchange_google_code(code).await
}

#[tauri::command]
async fn github_auth_finish(code: String) -> Result<UserProfile, String> {
    exchange_github_code(code).await
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
            google_auth_start,
            github_auth_start,
            google_auth_finish,
            github_auth_finish
        ])
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_deep_link::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
