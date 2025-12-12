// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::OpenOptions;
use std::io::Write;
use std::panic;
use std::path::PathBuf;
use tauri::Manager;

fn log_to_file(msg: &str) {
    if let Some(mut path) = tauri::api::path::app_log_dir(&tauri::Config::default()) {
        std::fs::create_dir_all(&path).ok();
        path.push("typingpro.log");
        if let Ok(mut file) = OpenOptions::new().create(true).append(true).open(path) {
             let _ = writeln!(file, "[{}] {}", chrono::Local::now().format("%Y-%m-%d %H:%M:%S"), msg);
        }
    }
}

fn main() {
  // Set Panic Hook
  panic::set_hook(Box::new(|info| {
      let msg = format!("PANIC: {:?}", info);
      eprintln!("{}", msg);
      // Try to log to file if possible (might fail if context is lost, but worth a try)
      // Note: simplistic path resolution here for panic context
  }));

  tauri::Builder::default()
    .setup(|app| {
        // Init Logger
        let handle = app.handle();
        let log_dir = app.path_resolver().app_log_dir().unwrap_or(PathBuf::from("."));
        std::fs::create_dir_all(&log_dir).ok();
        let log_path = log_dir.join("typingpro.log");
        
        let _ = std::fs::write(&log_path, format!("TypingPro Started at {}\n", chrono::Local::now()));
        println!("Log path: {:?}", log_path);
        
        Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
