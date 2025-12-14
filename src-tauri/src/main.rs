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

const GOOGLE_CLIENT_ID: &str = "YOUR_CLIENT_ID_HERE";
const GOOGLE_CLIENT_SECRET: &str = "YOUR_CLIENT_SECRET_HERE";

#[tauri::command]
async fn login_google(app_handle: tauri::AppHandle) -> Result<UserProfile, String> {
    // 1. Setup Client
    let client_id = ClientId::new(GOOGLE_CLIENT_ID.to_string());
    let client_secret = ClientSecret::new(GOOGLE_CLIENT_SECRET.to_string());
    
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
        .set_pkce_challenge(pkce_challenge)
        .url();

    // 4. Open Browser
    tauri::api::shell::open(&app_handle.shell_scope(), auth_url.as_str(), None)
        .map_err(|e| e.to_string())?;

    // 5. Wait for Callback
    let (mut stream, _) = tauri::async_runtime::spawn_blocking(move || {
        listener.accept()
    }).await.map_err(|e| e.to_string())?.map_err(|e| e.to_string())?;
    
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
    let http_client = reqwest::Client::new();
    let res = http_client.get(user_info_url)
        .header("Authorization", format!("Bearer {}", access_token))
        .send()
        .await
        .map_err(|e| e.to_string())?;
        
    let user_data: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;

    // 8. Respond to Browser
    let response = "HTTP/1.1 200 OK\r\n\r\n<html><body style='font-family:sans-serif;text-align:center;padding:50px;'><h1>Login Successful</h1><p>You can close this window and return to TypingPro.</p><script>window.close()</script></body></html>";
    stream.write_all(response.as_bytes()).map_err(|e| e.to_string())?;

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
