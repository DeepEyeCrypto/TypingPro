// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::{Manager, State};

mod engine;
use engine::{TypingEngine, TypingStats};

struct AppState {
    engine: Mutex<TypingEngine>,
}

#[tauri::command]
fn start_test(state: State<AppState>, text: String) {
    let mut engine = state.engine.lock().unwrap();
    engine.start_test(text);
}

#[tauri::command]
fn process_key(state: State<AppState>, key: char) -> TypingStats {
    let mut engine = state.engine.lock().unwrap();
    engine.process_key(key)
}

#[tauri::command]
fn get_stats(state: State<AppState>) -> TypingStats {
    let engine = state.engine.lock().unwrap();
    engine.get_stats()
}

#[tauri::command]
fn get_slow_keys(state: State<AppState>) -> Vec<(char, f64)> {
    let engine = state.engine.lock().unwrap();
    engine.get_slow_keys()
}

#[tauri::command]
fn generate_text(count: usize) -> String {
    engine::generate_words(count)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_process::init())
        .manage(AppState {
            engine: Mutex::new(TypingEngine::new()),
        })
        .invoke_handler(tauri::generate_handler![
            start_test,
            process_key,
            get_stats,
            get_slow_keys,
            generate_text
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
