// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![allow(unused)] // Suppress warnings for cleaner build output

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

#[tauri::command]
async fn login_google(app_handle: tauri::AppHandle) -> Result<UserProfile, String> {
    // 1. Robust Env Loading
    let mut env_loaded = false;
    if dotenv::dotenv().is_ok() {
        env_loaded = true;
    } else if let Some(resource_path) = app_handle.path_resolver().resolve_resource(".env") {
        if dotenv::from_path(resource_path).is_ok() {
            env_loaded = true;
        }
    }

    if !env_loaded {
        log_to_file(&app_handle, "Warning: .env file not found in CWD or resources");
    }

    let google_client_id = std::env::var("GOOGLE_CLIENT_ID")
        .map_err(|_| "GOOGLE_CLIENT_ID not found. Is .env bundled?".to_string())?;
    let google_client_secret = std::env::var("GOOGLE_CLIENT_SECRET")
        .map_err(|_| "GOOGLE_CLIENT_SECRET not found in environment".to_string())?;

    log_to_file(&app_handle, &format!("Google Login started (ID length: {})", google_client_id.len()));

    if google_client_id.is_empty() || google_client_id.contains("your_") {
         return Err("Invalid Google Client ID (Placeholder). Check .env".to_string());
    }

    // 1. Setup Client
    let client_id = ClientId::new(google_client_id);
    let client_secret = ClientSecret::new(google_client_secret);
    
    // 2. Start Local Server
    let listener = TcpListener::bind("127.0.0.1:0").map_err(|e| e.to_string())?;
    let port = listener.local_addr().map_err(|e| e.to_string())?.port();
    
    let redirect_url = RedirectUrl::new(format!("http://127.0.0.1:{}/callback", port)).map_err(|e| e.to_string())?;
    
    let auth_url = AuthUrl::new("https://accounts.google.com/o/oauth2/v2/auth".to_string())
        .map_err(|e| e.to_string())?;
    let token_url = TokenUrl::new("https://oauth2.googleapis.com/token".to_string())
        .map_err(|e| e.to_string())?;

    let client = BasicClient::new(
        client_id,
        Some(client_secret),
        auth_url,
        Some(token_url)
    )
    .set_redirect_uri(redirect_url);

    // 3. Generate Auth URL
    let (pkce_challenge, pkce_verifier) = PkceCodeChallenge::new_random_sha256();
    let (auth_url, csrf_token) = client
        .authorize_url(CsrfToken::new_random)
        .add_scope(Scope::new("https://www.googleapis.com/auth/userinfo.email".to_string()))
        .add_scope(Scope::new("https://www.googleapis.com/auth/userinfo.profile".to_string()))
        .add_scope(Scope::new("openid".to_string()))
        .add_extra_param("prompt", "select_account") 
        .add_extra_param("access_type", "offline")
        .set_pkce_challenge(pkce_challenge)
        .url();

    // 4. Open Browser
    tauri::api::shell::open(&app_handle.shell_scope(), auth_url.as_str(), None)
        .map_err(|e| e.to_string())?;

    // 5. Wait for Callback with Timeout
    listener.set_nonblocking(true).map_err(|e| e.to_string())?;
    let start_time = std::time::Instant::now();
    let timeout = std::time::Duration::from_secs(120);

    let (mut stream, _) = loop {
        if start_time.elapsed() > timeout {
            return Err("LOGIN_TIMEOUT".to_string());
        }
        match listener.accept() {
            Ok(conn) => break conn,
            Err(ref e) if e.kind() == std::io::ErrorKind::WouldBlock => {
                tokio::time::sleep(std::time::Duration::from_millis(100)).await;
                continue;
            }
            Err(e) => return Err(format!("AUTH_SERVER_ERROR: {}", e)),
        }
    };
    
    let mut reader = BufReader::new(&stream);
    let mut request_line = String::new();
    reader.read_line(&mut request_line).map_err(|e| e.to_string())?;
    
    let redirect_url = request_line.split_whitespace().nth(1).ok_or("INVALID_REQUEST")?;
    let url = Url::parse(&format!("http://localhost{}", redirect_url)).map_err(|e| e.to_string())?;
    
    // CSRF Validation
    let state = url.query_pairs().find(|(k, _)| k == "state").map(|(_, v)| v.into_owned());
    if state.as_deref() != Some(csrf_token.secret()) {
        return Err("CSRF_VALIDATION_FAILED".to_string());
    }

    let code_pair = url.query_pairs().find(|(key, _)| key == "code")
        .ok_or("AUTH_CODE_MISSING")?;
    let code = oauth2::AuthorizationCode::new(code_pair.1.into_owned());

    // 6. Exchange Code
    let token_result = client
        .exchange_code(code)
        .set_pkce_verifier(pkce_verifier)
        .request_async(oauth2::reqwest::async_http_client)
        .await
        .map_err(|e| format!("TOKEN_EXCHANGE_FAILED: {}", e))?;

    let access_token = token_result.access_token().secret();

    // 7. Get User Info
    let user_info_url = "https://www.googleapis.com/oauth2/v2/userinfo";
    let http_client = reqwest::Client::builder().user_agent("TypingPro").build().map_err(|e| e.to_string())?;
    let res = http_client.get(user_info_url).header("Authorization", format!("Bearer {}", access_token)).send().await.map_err(|e| e.to_string())?;
    let user_data: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;

    // 8. Premium Response
    let response_body = format!(r#"
        <html>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;800&display=swap" rel="stylesheet">
                <style>
                    body {{ background: #323437; color: #e2b714; font-family: 'JetBrains+Mono', monospace; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }}
                    .card {{ border: 2px solid #e2b714; padding: 40px; border-radius: 24px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }}
                    h1 {{ margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 4px; }}
                    p {{ color: #646669; margin-top: 10px; font-size: 14px; }}
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>TypingPro Secured</h1>
                    <p>Profile synced for {}. Close this window.</p>
                </div>
                <script>setTimeout(() => window.close(), 2000)</script>
            </body>
        </html>
    "#, user_data["name"].as_str().unwrap_or("User"));

    let response = format!("HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nContent-Length: {}\r\n\r\n{}", response_body.len(), response_body);
    stream.write_all(response.as_bytes()).map_err(|e| e.to_string())?;

    Ok(UserProfile {
        id: user_data["id"].as_str().unwrap_or("").to_string(),
        name: user_data["name"].as_str().unwrap_or("").to_string(),
        email: user_data["email"].as_str().unwrap_or("").to_string(),
        picture: user_data["picture"].as_str().unwrap_or("").to_string(),
        token: access_token.to_string(),
    })
}

#[tauri::command]
async fn login_github(app_handle: tauri::AppHandle) -> Result<UserProfile, String> {
    // 1. Robust Env Loading
    let mut env_loaded = false;
    if dotenv::dotenv().is_ok() {
        env_loaded = true;
    } else if let Some(resource_path) = app_handle.path_resolver().resolve_resource(".env") {
        if dotenv::from_path(resource_path).is_ok() {
            env_loaded = true;
        }
    }

    if !env_loaded {
        log_to_file(&app_handle, "Warning: .env file not found in CWD or resources");
    }

    let github_client_id = std::env::var("GITHUB_CLIENT_ID")
        .map_err(|_| "GITHUB_CLIENT_ID not found. Is .env bundled?".to_string())?;
    let github_client_secret = std::env::var("GITHUB_CLIENT_SECRET")
        .map_err(|_| "GITHUB_CLIENT_SECRET not found in environment".to_string())?;

    log_to_file(&app_handle, &format!("GitHub Login started (ID length: {})", github_client_id.len()));

    if github_client_id.is_empty() || github_client_id.contains("your_") {
        return Err("Invalid GitHub Client ID (Placeholder). Check .env".to_string());
    }

    let client_id = ClientId::new(github_client_id);
    let client_secret = ClientSecret::new(github_client_secret);
    
    let listener = TcpListener::bind("127.0.0.1:0").map_err(|e| e.to_string())?;
    let port = listener.local_addr().map_err(|e| e.to_string())?.port();
    
    let redirect_url = RedirectUrl::new(format!("http://127.0.0.1:{}/callback", port)).map_err(|e| e.to_string())?;
    
    let auth_url = AuthUrl::new("https://github.com/login/oauth/authorize".to_string())
        .map_err(|e| e.to_string())?;
    let token_url = TokenUrl::new("https://github.com/login/oauth/access_token".to_string())
        .map_err(|e| e.to_string())?;

    let client = BasicClient::new(
        client_id,
        Some(client_secret),
        auth_url,
        Some(token_url)
    )
    .set_redirect_uri(redirect_url);

    let (auth_url, csrf_token) = client
        .authorize_url(CsrfToken::new_random)
        .add_scope(Scope::new("read:user".to_string()))
        .add_scope(Scope::new("user:email".to_string()))
        .url();

    tauri::api::shell::open(&app_handle.shell_scope(), auth_url.as_str(), None)
        .map_err(|e| e.to_string())?;

    // Wait for Callback with Timeout
    listener.set_nonblocking(true).map_err(|e| e.to_string())?;
    let start_time = std::time::Instant::now();
    let timeout = std::time::Duration::from_secs(120);

    let (mut stream, _) = loop {
        if start_time.elapsed() > timeout {
            return Err("LOGIN_TIMEOUT".to_string());
        }
        match listener.accept() {
            Ok(conn) => break conn,
            Err(ref e) if e.kind() == std::io::ErrorKind::WouldBlock => {
                tokio::time::sleep(std::time::Duration::from_millis(100)).await;
                continue;
            }
            Err(e) => return Err(format!("AUTH_SERVER_ERROR: {}", e)),
        }
    };
    
    stream.set_nonblocking(false).map_err(|e| e.to_string())?;
    
    let mut reader = BufReader::new(&stream);
    let mut request_line = String::new();
    reader.read_line(&mut request_line).map_err(|e| e.to_string())?;
    
    let redirect_url = request_line.split_whitespace().nth(1).ok_or("INVALID_REQUEST")?;
    let url = Url::parse(&format!("http://localhost{}", redirect_url)).map_err(|e| e.to_string())?;
    
    // CSRF Validation
    let state = url.query_pairs().find(|(k, _)| k == "state").map(|(_, v)| v.into_owned());
    if state.as_deref() != Some(csrf_token.secret()) {
        return Err("CSRF_VALIDATION_FAILED".to_string());
    }

    let code_pair = url.query_pairs().find(|(key, _)| key == "code")
        .ok_or("AUTH_CODE_MISSING")?;
    let code = oauth2::AuthorizationCode::new(code_pair.1.into_owned());

    let token_result = client
        .exchange_code(code)
        .request_async(oauth2::reqwest::async_http_client)
        .await
        .map_err(|e| e.to_string())?;

    let access_token = token_result.access_token().secret();

    let user_info_url = "https://api.github.com/user";
    let http_client = reqwest::Client::builder().user_agent("TypingPro").build().map_err(|e| e.to_string())?;
    let res = http_client.get(user_info_url).header("Authorization", format!("token {}", access_token)).send().await.map_err(|e| e.to_string())?;
    let user_data: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
    
    let response_body = format!(r#"
        <html>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;800&display=swap" rel="stylesheet">
                <style>
                    body {{ background: #323437; color: #e2b714; font-family: 'JetBrains+Mono', monospace; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }}
                    .card {{ border: 2px solid #e2b714; padding: 40px; border-radius: 24px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }}
                    h1 {{ margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 4px; }}
                    p {{ color: #646669; margin-top: 10px; font-size: 14px; }}
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>GitHub Secured</h1>
                    <p>Synced with {}. Close window.</p>
                </div>
                <script>setTimeout(() => window.close(), 2000)</script>
            </body>
        </html>
    "#, user_data["login"].as_str().unwrap_or("User"));

    let response = format!("HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nContent-Length: {}\r\n\r\n{}", response_body.len(), response_body);
    stream.write_all(response.as_bytes()).map_err(|e| e.to_string())?;

    Ok(UserProfile {
        id: user_data["id"].as_u64().map(|id| id.to_string()).unwrap_or_default(),
        name: user_data["name"].as_str().unwrap_or_else(|| user_data["login"].as_str().unwrap_or("")).to_string(),
        email: user_data["email"].as_str().unwrap_or("").to_string(),
        picture: user_data["avatar_url"].as_str().unwrap_or("").to_string(),
        token: access_token.to_string(),
    })
}

fn log_to_file(app_handle: &tauri::AppHandle, msg: &str) {
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
    .invoke_handler(tauri::generate_handler![login_google, login_github])
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
