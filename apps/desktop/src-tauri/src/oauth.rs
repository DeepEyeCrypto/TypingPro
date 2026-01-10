use serde::{Deserialize, Serialize};
use reqwest::header::{ACCEPT, USER_AGENT};
use std::collections::HashMap;
use tauri_plugin_oauth::start_with_config;
use tauri::AppHandle;
// use tauri_plugin_shell::ShellExt;

pub fn get_google_client_id() -> String {
    std::env::var("GOOGLE_CLIENT_ID")
        .unwrap_or_else(|_| "GOOGLE_CLIENT_ID_MISSING".to_string())
}

pub fn get_github_client_id() -> String {
    std::env::var("GITHUB_CLIENT_ID")
        .unwrap_or_else(|_| "GITHUB_CLIENT_ID_MISSING".to_string())
}

pub fn get_github_client_secret() -> String {
    std::env::var("GITHUB_CLIENT_SECRET")
        .unwrap_or_else(|_| "GITHUB_CLIENT_SECRET_MISSING".to_string())
}

pub fn get_google_client_secret() -> String {
    std::env::var("TAURI_GOOGLE_CLIENT_SECRET")
        .unwrap_or_else(|_| "GOOGLE_CLIENT_SECRET_MISSING".to_string())
}


#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UserProfile {
    pub id: String,
    pub name: String,
    pub email: Option<String>,
    pub avatar_url: Option<String>,
    pub provider: String,
    pub token: String
}

#[derive(Deserialize)]
struct GoogleTokenResponse {
    access_token: String
}

#[derive(Deserialize)]
struct GoogleUserResponse {
    id: String,
    name: String,
    email: Option<String>,
    picture: Option<String>
}

#[derive(Deserialize)]
struct GithubTokenResponse {
    access_token: String
}

#[derive(Deserialize)]
struct GithubUserResponse {
    id: u64,
    login: String,
    email: Option<String>,
    avatar_url: Option<String>
}

pub async fn perform_google_login(_app: AppHandle) -> Result<UserProfile, String> {
    let (tx, rx): (async_channel::Sender<String>, async_channel::Receiver<String>) = async_channel::bounded(1);
    
    // Start listener on Rust side
    let port = start_with_config(tauri_plugin_oauth::OauthConfig {
        ports: Some(vec![1420]),
        response: None,
    }, move |url: String| {
        let _ = tx.try_send(url);
    }).map_err(|e| e.to_string())?;

    let url = format!(
        "https://accounts.google.com/o/oauth2/v2/auth?client_id={}&redirect_uri=http://localhost:{}/auth/google/callback&response_type=code&scope=openid%20profile%20email",
        get_google_client_id(), port
    );

    // Open browser
    // Open browser
    open::that(&url).map_err(|e| e.to_string())?;

    // Wait for code
    let uri_str = rx.recv().await.map_err(|e| e.to_string())?;
    let url_obj = url::Url::parse(&uri_str).map_err(|e| e.to_string())?;
    
    let code = url_obj
        .query_pairs()
        .find(|(key, _)| key == "code")
        .map(|(_, value)| value.to_string())
        .ok_or("No code found in redirect")?;

    exchange_google_code(code).await
}

pub async fn perform_github_login(_app: AppHandle) -> Result<UserProfile, String> {
    let (tx, rx): (async_channel::Sender<String>, async_channel::Receiver<String>) = async_channel::bounded(1);
    
    let port = start_with_config(tauri_plugin_oauth::OauthConfig {
        ports: Some(vec![1420]),
        response: None,
    }, move |url: String| {
        let _ = tx.try_send(url);
    }).map_err(|e| e.to_string())?;

    let redirect_uri = format!("http://localhost:{}/auth", port);
    
    // EXACT URL structure requested by user
    let url = format!(
        "https://github.com/login/oauth/authorize?client_id={}&redirect_uri={}&scope=user:email",
        get_github_client_id(), redirect_uri
    );

    println!("DEBUG: Opening GitHub Auth URL: {}", url);

    open::that(&url).map_err(|e| e.to_string())?;

    let uri_str = rx.recv().await.map_err(|e| e.to_string())?;
    let url_obj = url::Url::parse(&uri_str).map_err(|e| e.to_string())?;
    
    let code = url_obj
        .query_pairs()
        .find(|(key, _)| key == "code")
        .map(|(_, value)| value.to_string())
        .ok_or("No code found in redirect")?;

    exchange_github_code(code, redirect_uri).await
}

// Keep exchange functions as helpers
pub async fn exchange_google_code(code: String) -> Result<UserProfile, String> {
    let client = reqwest::Client::new();
    
    let mut params = HashMap::new();
    params.insert("code", code);
    params.insert("client_id", get_google_client_id());
    params.insert("client_secret", get_google_client_secret());
    // Use the exact redirect URI structure
    params.insert("redirect_uri", format!("http://localhost:1420/auth/google/callback"));
    params.insert("grant_type", "authorization_code".to_string());

    let res = client.post("https://oauth2.googleapis.com/token")
        .form(&params)
        .send().await.map_err(|e| e.to_string())?;
    
    let token_data: GoogleTokenResponse = res.json().await.map_err(|e| e.to_string())?;

    let user_res = client.get("https://www.googleapis.com/oauth2/v2/userinfo")
        .bearer_auth(&token_data.access_token)
        .send().await.map_err(|e| e.to_string())?;
    
    let user: GoogleUserResponse = user_res.json().await.map_err(|e| e.to_string())?;

    Ok(UserProfile {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.picture,
        provider: "google".to_string(),
        token: token_data.access_token
    })
}

pub async fn exchange_github_code(code: String, redirect_uri: String) -> Result<UserProfile, String> {
    let client = reqwest::Client::new();
    
    let mut params = HashMap::new();
    params.insert("code", code);
    params.insert("client_id", get_github_client_id());
    params.insert("client_secret", get_github_client_secret());
    params.insert("redirect_uri", redirect_uri);

    let res = client.post("https://github.com/login/oauth/access_token")
        .header(ACCEPT, "application/json")
        .form(&params)
        .send().await.map_err(|e| e.to_string())?;
    
    let token_data: GithubTokenResponse = res.json().await.map_err(|e| e.to_string())?;

    let user_res = client.get("https://api.github.com/user")
        .header(USER_AGENT, "TypingPro")
        .header(ACCEPT, "application/json")
        .bearer_auth(&token_data.access_token)
        .send().await.map_err(|e| e.to_string())?;
    
    let user: GithubUserResponse = user_res.json().await.map_err(|e| e.to_string())?;

    Ok(UserProfile {
        id: user.id.to_string(),
        name: user.login,
        email: user.email,
        avatar_url: user.avatar_url,
        provider: "github".to_string(),
        token: token_data.access_token
    })
}
