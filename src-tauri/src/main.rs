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
fn get_lesson(state: State<AppState>, lesson_id: usize) -> Option<engine::Lesson> {
    let mut engine = state.engine.lock().unwrap();
    engine.get_lesson(lesson_id)
}

#[tauri::command]
fn start_test(state: State<AppState>, text: String) {
    let mut engine = state.engine.lock().unwrap();
    // We can still support direct text for custom tests
    engine.current_lesson = Some(engine::Lesson {
        id: 0,
        stage: 0,
        title: "Custom Test".to_string(),
        text: text.clone(),
        target_wpm: 0.0,
    });
    engine.user_input = String::new();
    engine.start_time = None;
    engine.last_key_time = None;
    engine.latencies = Vec::new();
    engine.error_indices = Vec::new();
    engine.is_finished = false;
}

#[tauri::command]
fn process_key(state: State<AppState>, key: char) -> engine::TypingStats {
    let mut engine = state.engine.lock().unwrap();
    engine.process_key(key)
}

#[tauri::command]
fn handle_backspace(state: State<AppState>) -> engine::TypingStats {
    let mut engine = state.engine.lock().unwrap();
    engine.handle_backspace()
}

#[tauri::command]
fn get_stats(state: State<AppState>) -> engine::TypingStats {
    let engine = state.engine.lock().unwrap();
    engine.get_stats()
}

#[tauri::command]
fn fetch_analytics(state: State<AppState>) -> engine::TypingStats {
    let engine = state.engine.lock().unwrap();
    engine.get_stats()
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_oauth::init())
        .manage(AppState {
            engine: Mutex::new(TypingEngine::new()),
        })
        .invoke_handler(tauri::generate_handler![
            get_lesson,
            start_test,
            process_key,
            handle_backspace,
            get_stats,
            fetch_analytics
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
