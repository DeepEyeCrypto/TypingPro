// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![allow(unused)]

use std::fs::OpenOptions;
use std::io::{BufRead, BufReader, Write};
use std::path::PathBuf;
use tauri::Manager;
use serde::{Deserialize, Serialize};
use reqwest;
use tokio;

mod config;

#[derive(Serialize)]
struct OAuthCredentials {
    client_id: String,
    redirect_uri: String,
}

#[tauri::command]
async fn get_backend_config() -> Result<config::ConfigHealthSummary, String> {
    Ok(config::OAuthConfig::get_summary())
}

#[tauri::command]
async fn get_oauth_credentials(provider: String) -> Result<OAuthCredentials, String> {
    let cfg = config::OAuthConfig::from_env()?;
    
    if provider == "google" {
        Ok(OAuthCredentials {
            client_id: cfg.google_client_id,
            redirect_uri: cfg.google_redirect_uri,
        })
    } else {
        Ok(OAuthCredentials {
            client_id: cfg.github_client_id,
            redirect_uri: cfg.github_redirect_uri,
        })
    }
}

#[tauri::command]
async fn exchange_oauth_code(provider: String, code: String) -> Result<serde_json::Value, String> {
    let cfg = config::OAuthConfig::from_env()?;
    let client = reqwest::Client::new();

    if provider == "google" {
        // Exchange code for Google Token
        let res = client.post("https://oauth2.googleapis.com/token")
            .form(&[
                ("client_id", &cfg.google_client_id),
                ("client_secret", &cfg.google_client_secret),
                ("code", &code),
                ("grant_type", "authorization_code"),
                ("redirect_uri", &cfg.google_redirect_uri),
            ])
            .send()
            .await
            .map_err(|e| e.to_string())?;
        
        let status = res.status();
        let body = res.json::<serde_json::Value>().await.map_err(|e| e.to_string())?;
        
        if status.is_success() {
            Ok(body)
        } else {
            Err(format!("Google Exchange Error ({}): {}", status, body))
        }
    } else {
        // Exchange code for GitHub Token
        let res = client.post("https://github.com/login/oauth/access_token")
            .header("Accept", "application/json")
            .form(&[
                ("client_id", &cfg.github_client_id),
                ("client_secret", &cfg.github_client_secret),
                ("code", &code),
                ("redirect_uri", &cfg.github_redirect_uri),
            ])
            .send()
            .await
            .map_err(|e| e.to_string())?;

        let status = res.status();
        let body = res.json::<serde_json::Value>().await.map_err(|e| e.to_string())?;

        if status.is_success() {
            Ok(body)
        } else {
            Err(format!("GitHub Exchange Error ({}): {}", status, body))
        }
    }
}

#[tauri::command]
fn log_to_file(app_handle: tauri::AppHandle, msg: String) {
    if let Some(mut path) = app_handle.path_resolver().app_log_dir() {
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
    .invoke_handler(tauri::generate_handler![
        get_backend_config,
        get_oauth_credentials,
        exchange_oauth_code,
        log_to_file
    ])
    .setup(|app| {
        let log_dir = app.path_resolver().app_log_dir().unwrap_or(PathBuf::from("."));
        std::fs::create_dir_all(&log_dir).ok();
        let log_path = log_dir.join("typingpro.log");
        let _ = std::fs::write(&log_path, format!("TypingPro Started at {}\n", chrono::Local::now()));
        Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
