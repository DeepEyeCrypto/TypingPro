// ═══════════════════════════════════════════════════════════════════
// OAUTH MODULE - Google & GitHub OAuth with PKCE
// TypingPro v1.2.53 - Security Enhanced
// ═══════════════════════════════════════════════════════════════════

use serde::{Deserialize, Serialize};
use reqwest::header::{ACCEPT, USER_AGENT};
use std::collections::HashMap;
use tauri_plugin_oauth::start_with_config;
use tauri::AppHandle;
use sha2::{Sha256, Digest};
use base64::{Engine as _, engine::general_purpose::URL_SAFE_NO_PAD};
use rand::Rng;

// ═══════════════════════════════════════════════════════════════════
// ENV CONFIG GETTERS
// ═══════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════
// DATA STRUCTURES
// ═══════════════════════════════════════════════════════════════════

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UserProfile {
    pub id: String,
    pub name: String,
    pub email: Option<String>,
    pub avatar_url: Option<String>,
    pub provider: String,
    pub token: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct OAuthError {
    pub code: String,
    pub message: String,
}

#[derive(Deserialize)]
struct GoogleTokenResponse {
    access_token: String,
}

#[derive(Deserialize)]
struct GoogleUserResponse {
    id: String,
    name: String,
    email: Option<String>,
    picture: Option<String>,
}

#[derive(Deserialize)]
struct GithubTokenResponse {
    access_token: String,
}

#[derive(Deserialize)]
struct GithubUserResponse {
    id: u64,
    login: String,
    email: Option<String>,
    avatar_url: Option<String>,
}

// ═══════════════════════════════════════════════════════════════════
// PKCE (Proof Key for Code Exchange) - RFC 7636
// ═══════════════════════════════════════════════════════════════════

/// Generate a cryptographically random code verifier (43-128 chars)
fn generate_code_verifier() -> String {
    let mut rng = rand::thread_rng();
    let bytes: Vec<u8> = (0..32).map(|_| rng.gen()).collect();
    URL_SAFE_NO_PAD.encode(&bytes)
}

/// Create code challenge from verifier using SHA256
fn generate_code_challenge(verifier: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(verifier.as_bytes());
    let result = hasher.finalize();
    URL_SAFE_NO_PAD.encode(&result)
}

/// Generate random state for CSRF protection
fn generate_state() -> String {
    let mut rng = rand::thread_rng();
    let bytes: Vec<u8> = (0..16).map(|_| rng.gen()).collect();
    URL_SAFE_NO_PAD.encode(&bytes)
}

// ═══════════════════════════════════════════════════════════════════
// GOOGLE LOGIN - Authorization Code + PKCE
// ═══════════════════════════════════════════════════════════════════

pub async fn perform_google_login(_app: AppHandle) -> Result<UserProfile, String> {
    let (tx, rx) = async_channel::bounded::<String>(1);
    
    // Generate PKCE values
    let code_verifier = generate_code_verifier();
    let code_challenge = generate_code_challenge(&code_verifier);
    let state = generate_state();
    
    // Start OAuth listener
    let port = start_with_config(tauri_plugin_oauth::OauthConfig {
        ports: Some(vec![1420, 8787, 9999]), // Try multiple ports
        response: Some("<html><body><h1>✅ Login successful!</h1><p>You can close this window.</p></body></html>".into()),
    }, move |url: String| {
        let _ = tx.try_send(url);
    }).map_err(|e| format!("Failed to start OAuth listener: {}", e))?;

    let redirect_uri = format!("http://127.0.0.1:{}/callback", port);
    
    // Build authorization URL with PKCE
    let url = format!(
        "https://accounts.google.com/o/oauth2/v2/auth?\
         client_id={}\
         &redirect_uri={}\
         &response_type=code\
         &scope=openid%20profile%20email\
         &code_challenge={}\
         &code_challenge_method=S256\
         &state={}",
        get_google_client_id(),
        urlencoding::encode(&redirect_uri),
        code_challenge,
        state
    );

    println!("[OAuth] Opening Google login: {}", url);
    open::that(&url).map_err(|e| format!("Failed to open browser: {}", e))?;

    // Wait for callback
    let uri_str = rx.recv().await.map_err(|e| format!("Failed to receive callback: {}", e))?;
    let url_obj = url::Url::parse(&uri_str).map_err(|e| format!("Invalid callback URL: {}", e))?;
    
    // Verify state
    let returned_state = url_obj.query_pairs()
        .find(|(key, _)| key == "state")
        .map(|(_, v)| v.to_string());
    
    if returned_state.as_deref() != Some(&state) {
        return Err("OAuth state mismatch - possible CSRF attack".to_string());
    }
    
    // Extract code
    let code = url_obj.query_pairs()
        .find(|(key, _)| key == "code")
        .map(|(_, value)| value.to_string())
        .ok_or("No authorization code in callback")?;

    exchange_google_code(code, redirect_uri, code_verifier).await
}

/// Exchange authorization code for tokens (with PKCE verifier)
async fn exchange_google_code(code: String, redirect_uri: String, code_verifier: String) -> Result<UserProfile, String> {
    let client = reqwest::Client::new();
    
    let mut params = HashMap::new();
    params.insert("code", code);
    params.insert("client_id", get_google_client_id());
    params.insert("client_secret", get_google_client_secret());
    params.insert("redirect_uri", redirect_uri);
    params.insert("grant_type", "authorization_code".to_string());
    params.insert("code_verifier", code_verifier);

    let res = client.post("https://oauth2.googleapis.com/token")
        .form(&params)
        .send().await
        .map_err(|e| format!("Token request failed: {}", e))?;
    
    if !res.status().is_success() {
        let error_text = res.text().await.unwrap_or_default();
        return Err(format!("Token exchange failed: {}", error_text));
    }
    
    let token_data: GoogleTokenResponse = res.json().await
        .map_err(|e| format!("Failed to parse token response: {}", e))?;

    // Get user info
    let user_res = client.get("https://www.googleapis.com/oauth2/v2/userinfo")
        .bearer_auth(&token_data.access_token)
        .send().await
        .map_err(|e| format!("User info request failed: {}", e))?;
    
    let user: GoogleUserResponse = user_res.json().await
        .map_err(|e| format!("Failed to parse user info: {}", e))?;

    println!("[OAuth] Google login successful: {}", user.name);

    Ok(UserProfile {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.picture,
        provider: "google".to_string(),
        token: token_data.access_token,
    })
}

// ═══════════════════════════════════════════════════════════════════
// GITHUB LOGIN - Authorization Code Flow
// ═══════════════════════════════════════════════════════════════════

pub async fn perform_github_login(_app: AppHandle) -> Result<UserProfile, String> {
    let (tx, rx) = async_channel::bounded::<String>(1);
    
    let state = generate_state();
    
    // Start OAuth listener
    let port = start_with_config(tauri_plugin_oauth::OauthConfig {
        ports: Some(vec![1420, 8787, 9999]),
        response: Some("<html><body><h1>✅ Login successful!</h1><p>You can close this window.</p></body></html>".into()),
    }, move |url: String| {
        let _ = tx.try_send(url);
    }).map_err(|e| format!("Failed to start OAuth listener: {}", e))?;

    let redirect_uri = format!("http://127.0.0.1:{}/callback", port);
    
    // Build authorization URL
    let url = format!(
        "https://github.com/login/oauth/authorize?\
         client_id={}\
         &redirect_uri={}\
         &scope=read:user%20user:email\
         &state={}",
        get_github_client_id(),
        urlencoding::encode(&redirect_uri),
        state
    );

    println!("[OAuth] Opening GitHub login: {}", url);
    open::that(&url).map_err(|e| format!("Failed to open browser: {}", e))?;

    // Wait for callback
    let uri_str = rx.recv().await.map_err(|e| format!("Failed to receive callback: {}", e))?;
    let url_obj = url::Url::parse(&uri_str).map_err(|e| format!("Invalid callback URL: {}", e))?;
    
    // Verify state
    let returned_state = url_obj.query_pairs()
        .find(|(key, _)| key == "state")
        .map(|(_, v)| v.to_string());
    
    if returned_state.as_deref() != Some(&state) {
        return Err("OAuth state mismatch - possible CSRF attack".to_string());
    }
    
    // Extract code
    let code = url_obj.query_pairs()
        .find(|(key, _)| key == "code")
        .map(|(_, value)| value.to_string())
        .ok_or("No authorization code in callback")?;

    exchange_github_code(code, redirect_uri).await
}

/// Exchange authorization code for tokens
async fn exchange_github_code(code: String, redirect_uri: String) -> Result<UserProfile, String> {
    let client = reqwest::Client::new();
    
    let mut params = HashMap::new();
    params.insert("code", code);
    params.insert("client_id", get_github_client_id());
    params.insert("client_secret", get_github_client_secret());
    params.insert("redirect_uri", redirect_uri);

    let res = client.post("https://github.com/login/oauth/access_token")
        .header(ACCEPT, "application/json")
        .form(&params)
        .send().await
        .map_err(|e| format!("Token request failed: {}", e))?;
    
    if !res.status().is_success() {
        let error_text = res.text().await.unwrap_or_default();
        return Err(format!("Token exchange failed: {}", error_text));
    }
    
    let token_data: GithubTokenResponse = res.json().await
        .map_err(|e| format!("Failed to parse token response: {}", e))?;

    // Get user info
    let user_res = client.get("https://api.github.com/user")
        .header(USER_AGENT, "TypingPro")
        .header(ACCEPT, "application/json")
        .bearer_auth(&token_data.access_token)
        .send().await
        .map_err(|e| format!("User info request failed: {}", e))?;
    
    let user: GithubUserResponse = user_res.json().await
        .map_err(|e| format!("Failed to parse user info: {}", e))?;

    println!("[OAuth] GitHub login successful: {}", user.login);

    Ok(UserProfile {
        id: user.id.to_string(),
        name: user.login,
        email: user.email,
        avatar_url: user.avatar_url,
        provider: "github".to_string(),
        token: token_data.access_token,
    })
}
