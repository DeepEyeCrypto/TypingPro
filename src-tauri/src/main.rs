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
    // Load credentials at runtime
    dotenv::dotenv().ok();
    
    let google_client_id = std::env::var("GOOGLE_CLIENT_ID")
        .map_err(|_| "GOOGLE_CLIENT_ID not found in environment".to_string())?;
    let google_client_secret = std::env::var("GOOGLE_CLIENT_SECRET")
        .map_err(|_| "GOOGLE_CLIENT_SECRET not found in environment".to_string())?;

    if google_client_id.is_empty() || google_client_id.contains("your_") {
         return Err("Invalid Google Client ID. Check your .env file.".to_string());
    }

    log_to_file(&format!("Starting Google Login with Client ID: {}...", &google_client_id[..10]));

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
    let (auth_url, _csrf_token) = client
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

    // 5. Wait for Callback (with 2 min timeout)
    let start_time = std::time::Instant::now();
    let timeout = std::time::Duration::from_secs(120);
    
    listener.set_nonblocking(true).map_err(|e| e.to_string())?;

    let (mut stream, _) = loop {
        if start_time.elapsed() > timeout {
            return Err("Login timed out. Please try again.".to_string());
        }
        match listener.accept() {
            Ok(conn) => break conn,
            Err(ref e) if e.kind() == std::io::ErrorKind::WouldBlock => {
                std::thread::sleep(std::time::Duration::from_millis(100));
                continue;
            }
            Err(e) => return Err(e.to_string()),
        }
    };
    
    // Set back to blocking for reliable reading
    stream.set_nonblocking(false).map_err(|e| e.to_string())?;
    
    let mut reader = BufReader::new(&stream);
    let mut request_line = String::new();
    reader.read_line(&mut request_line).map_err(|e| e.to_string())?;
    
    let redirect_url = request_line.split_whitespace().nth(1).ok_or("Invalid request")?;
    let url = Url::parse(&format!("http://localhost{}", redirect_url)).map_err(|e| e.to_string())?;
    
    let code_pair = url.query_pairs().find(|(key, _)| key == "code")
        .ok_or("No code found in redirect")?;
    let code = oauth2::AuthorizationCode::new(code_pair.1.into_owned());

    // 6. Exchange Code
    let token_result = client
        .exchange_code(code)
        .set_pkce_verifier(pkce_verifier)
        .request_async(oauth2::reqwest::async_http_client)
        .await
        .map_err(|e| e.to_string())?;

    let access_token = token_result.access_token().secret();

    // 7. Get User Info
    let user_info_url = "https://www.googleapis.com/oauth2/v2/userinfo";
    let http_client = reqwest::Client::builder()
        .user_agent("TypingPro-App")
        .build()
        .map_err(|e| e.to_string())?;
    
    let res = http_client.get(user_info_url)
        .header("Authorization", format!("Bearer {}", access_token))
        .send()
        .await
        .map_err(|e| e.to_string())?;
        
    let user_data: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
    log_to_file(&format!("Fetched User Data: {}", user_data));

    // 8. Respond to Browser
    let response_body = r#"
        <html>
            <head>
                <style>
                    body { font-family: 'JetBrains Mono', monospace; background: #0d0d0d; color: #00f2ff; text-align: center; padding: 100px; }
                    .card { background: rgba(0, 242, 255, 0.05); border: 1px solid rgba(0, 242, 255, 0.2); border-radius: 20px; padding: 40px; display: inline-block; box-shadow: 0 0 20px rgba(0, 242, 255, 0.2); }
                    h1 { text-transform: uppercase; letter-spacing: 2px; }
                    p { color: rgba(255, 255, 255, 0.6); }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>Authentication Secured</h1>
                    <p>Profile synced successfully. You can close this window.</p>
                </div>
                <script>setTimeout(() => window.close(), 3000)</script>
            </body>
        </html>
    "#;
    let response = format!(
        "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nContent-Length: {}\r\n\r\n{}",
        response_body.len(),
        response_body
    );
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
    dotenv::dotenv().ok();

    let github_client_id = std::env::var("GITHUB_CLIENT_ID")
        .map_err(|_| "GITHUB_CLIENT_ID not found in environment".to_string())?;
    let github_client_secret = std::env::var("GITHUB_CLIENT_SECRET")
        .map_err(|_| "GITHUB_CLIENT_SECRET not found in environment".to_string())?;

    if github_client_id.is_empty() || github_client_id.contains("your_") {
        return Err("Invalid GitHub Client ID. Check your .env file.".to_string());
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

    let (auth_url, _csrf_token) = client
        .authorize_url(CsrfToken::new_random)
        .add_scope(Scope::new("read:user".to_string()))
        .add_scope(Scope::new("user:email".to_string()))
        .url();

    tauri::api::shell::open(&app_handle.shell_scope(), auth_url.as_str(), None)
        .map_err(|e| e.to_string())?;

    let start_time = std::time::Instant::now();
    let timeout = std::time::Duration::from_secs(120);
    
    listener.set_nonblocking(true).map_err(|e| e.to_string())?;

    let (mut stream, _) = loop {
        if start_time.elapsed() > timeout {
            return Err("Login timed out. Please try again.".to_string());
        }
        match listener.accept() {
            Ok(conn) => break conn,
            Err(ref e) if e.kind() == std::io::ErrorKind::WouldBlock => {
                std::thread::sleep(std::time::Duration::from_secs(1));
                continue;
            }
            Err(e) => return Err(e.to_string()),
        }
    };
    
    stream.set_nonblocking(false).map_err(|e| e.to_string())?;
    
    let mut reader = BufReader::new(&stream);
    let mut request_line = String::new();
    reader.read_line(&mut request_line).map_err(|e| e.to_string())?;
    
    let redirect_url = request_line.split_whitespace().nth(1).ok_or("Invalid request")?;
    let url = Url::parse(&format!("http://localhost{}", redirect_url)).map_err(|e| e.to_string())?;
    
    let code_pair = url.query_pairs().find(|(key, _)| key == "code")
        .ok_or("No code found in redirect")?;
    let code = oauth2::AuthorizationCode::new(code_pair.1.into_owned());

    let token_result = client
        .exchange_code(code)
        .request_async(oauth2::reqwest::async_http_client)
        .await
        .map_err(|e| e.to_string())?;

    let access_token = token_result.access_token().secret();

    let user_info_url = "https://api.github.com/user";
    let http_client = reqwest::Client::builder()
        .user_agent("TypingPro-App")
        .build()
        .map_err(|e| e.to_string())?;
    
    let res = http_client.get(user_info_url)
        .header("Authorization", format!("token {}", access_token))
        .send()
        .await
        .map_err(|e| e.to_string())?;
        
    let user_data: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
    
    let response_body = r#"
        <html>
            <head>
                <style>
                    body { font-family: 'JetBrains Mono', monospace; background: #0d0d0d; color: #00f2ff; text-align: center; padding: 100px; }
                    .card { background: rgba(0, 242, 255, 0.05); border: 1px solid rgba(0, 242, 255, 0.2); border-radius: 20px; padding: 40px; display: inline-block; box-shadow: 0 0 20px rgba(0, 242, 255, 0.2); }
                    h1 { text-transform: uppercase; letter-spacing: 2px; }
                    p { color: rgba(255, 255, 255, 0.6); }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>TypingPro: GitHub Secured</h1>
                    <p>Profile synced. Closing in 3 seconds...</p>
                </div>
                <script>setTimeout(() => window.close(), 3000)</script>
            </body>
        </html>
    "#;
    let response = format!(
        "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nContent-Length: {}\r\n\r\n{}",
        response_body.len(),
        response_body
    );
    stream.write_all(response.as_bytes()).map_err(|e| e.to_string())?;

    Ok(UserProfile {
        id: user_data["id"].as_i64().map(|i| i.to_string()).unwrap_or_default(),
        name: user_data["name"].as_str().unwrap_or(user_data["login"].as_str().unwrap_or("")).to_string(),
        email: user_data["email"].as_str().unwrap_or("").to_string(),
        picture: user_data["avatar_url"].as_str().unwrap_or("").to_string(),
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
