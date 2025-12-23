// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![allow(unused)]

use reqwest;
use serde::{Deserialize, Serialize};
use std::fs::OpenOptions;
use std::io::{BufRead, BufReader, Write};
use std::path::PathBuf;
use tauri::Manager;
use tokio;

mod config;

#[tauri::command]
async fn get_backend_config() -> Result<config::ConfigHealthSummary, String> {
    Ok(config::OAuthConfig::get_summary())
}

#[tauri::command]
async fn get_oauth_config() -> Result<config::PublicConfig, String> {
    let cfg = config::OAuthConfig::from_env()?;
    Ok(cfg.get_public_config())
}

#[tauri::command]
async fn exchange_oauth_code(provider: String, code: String) -> Result<serde_json::Value, String> {
    let cfg = config::OAuthConfig::from_env()?;
    let client = reqwest::Client::new();

    let (token_url, profile_url, auth_header) = if provider == "google" {
        (
            "https://oauth2.googleapis.com/token",
            "https://www.googleapis.com/oauth2/v2/userinfo",
            "Bearer",
        )
    } else {
        (
            "https://github.com/login/oauth/access_token",
            "https://api.github.com/user",
            "token",
        )
    };

    // 1. Exchange Code for Token
    let mut form = std::collections::HashMap::new();
    form.insert(
        "client_id".to_string(),
        if provider == "google" {
            cfg.google_client_id.clone()
        } else {
            cfg.github_client_id.clone()
        },
    );
    form.insert(
        "client_secret".to_string(),
        if provider == "google" {
            cfg.google_client_secret.clone()
        } else {
            cfg.github_client_secret.clone()
        },
    );
    form.insert("code".to_string(), code.clone());
    form.insert(
        "redirect_uri".to_string(),
        if provider == "google" {
            cfg.google_redirect_uri.clone()
        } else {
            cfg.github_redirect_uri.clone()
        },
    );

    if provider == "google" {
        form.insert("grant_type".to_string(), "authorization_code".to_string());
    }

    let res = client
        .post(token_url)
        .header("Accept", "application/json")
        .form(&form)
        .send()
        .await
        .map_err(|e| format!("Token request failed: {}", e))?;

    let status = res.status();
    let token_data: serde_json::Value = res
        .json()
        .await
        .map_err(|e| format!("Failed to parse token response: {}", e))?;

    if !status.is_success() {
        return Err(format!(
            "Token exchange failed ({}): {}",
            status,
            token_data
                .get("error_description")
                .or(token_data.get("error"))
                .and_then(|e| e.as_str())
                .unwrap_or("Unknown error")
        ));
    }

    let access_token = token_data
        .get("access_token")
        .and_then(|t| t.as_str())
        .ok_or_else(|| format!("No access token in response: {}", token_data))?;

    // 2. Fetch User Profile using the token
    let profile_res = client
        .get(profile_url)
        .header("Authorization", format!("{} {}", auth_header, access_token))
        .header("User-Agent", "TypingPro-App")
        .header("Accept", "application/json")
        .send()
        .await
        .map_err(|e| format!("Profile fetch request failed: {}", e))?;

    let profile_status = profile_res.status();
    let mut profile_data: serde_json::Value = profile_res
        .json()
        .await
        .map_err(|e| format!("Failed to parse profile JSON: {}", e))?;

    if !profile_status.is_success() {
        return Err(format!(
            "Profile fetch failed ({}): {}",
            profile_status,
            profile_data
                .get("message")
                .or(profile_data.get("error"))
                .and_then(|e| e.as_str())
                .unwrap_or("Unknown error")
        ));
    }

    // Merge token data into profile data so frontend has everything
    if let Some(obj) = profile_data.as_object_mut() {
        obj.insert(
            "access_token".to_string(),
            serde_json::Value::String(access_token.to_string()),
        );
    }

    Ok(profile_data)
}

#[tauri::command]
fn log_to_file(app_handle: tauri::AppHandle, msg: String) {
    if let Some(mut path) = app_handle.path_resolver().app_log_dir() {
        std::fs::create_dir_all(&path).ok();
        path.push("typingpro.log");
        if let Ok(mut file) = OpenOptions::new().create(true).append(true).open(path) {
            let _ = writeln!(
                file,
                "[{}] {}",
                chrono::Local::now().format("%Y-%m-%d %H:%M:%S"),
                msg
            );
        }
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            get_backend_config,
            get_oauth_config,
            exchange_oauth_code,
            log_to_file
        ])
        .setup(|app| {
            let log_dir = app
                .path_resolver()
                .app_log_dir()
                .unwrap_or(PathBuf::from("."));
            std::fs::create_dir_all(&log_dir).ok();
            let log_path = log_dir.join("typingpro.log");
            let _ = std::fs::write(
                &log_path,
                format!("TypingPro Started at {}\n", chrono::Local::now()),
            );
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
