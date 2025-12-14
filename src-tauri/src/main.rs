// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::OpenOptions;
use std::io::{BufRead, BufReader, Write};
use std::net::TcpListener;
use std::path::PathBuf;
use tauri::Manager;
use oauth2::{
    basic::BasicClient, AuthUrl, ClientId, ClientSecret, CsrfToken,
    PkceCodeChallenge, RedirectUrl, Scope, TokenUrl, TokenResponse
};
use url::Url;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct UserProfile {
    id: String,
    name: String,
    email: String,
    picture: String,
    token: String,
}

// ... (constants)

#[tauri::command]
async fn login_google(app_handle: tauri::AppHandle) -> Result<UserProfile, String> {
    // ... (rest of the function unti extracting user_data)
      
    // 7. Get User Info
    // ...
    // let user_data: serde_json::Value = res.json().await ...

    // 8. Respond to Browser
    // ...

    Ok(UserProfile {
        id: user_data["id"].as_str().unwrap_or("").to_string(),
        name: user_data["name"].as_str().unwrap_or("").to_string(),
        email: user_data["email"].as_str().unwrap_or("").to_string(),
        picture: user_data["picture"].as_str().unwrap_or("").to_string(),
        token: access_token.to_string(),
    })
}

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
  tauri::Builder::default()
    .plugin(tauri_plugin_store::Builder::default().build())
    .invoke_handler(tauri::generate_handler![login_google])
    .setup(|app| {
        // Init Logger
        let _handle = app.handle();
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
