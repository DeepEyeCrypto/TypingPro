// ═══════════════════════════════════════════════════════════════════
// OAUTH MODULE - Google & GitHub OAuth with PKCE / Deep Links
// TypingPro v1.2.54 - Deep Link Flow
// ═══════════════════════════════════════════════════════════════════

use serde::{Deserialize, Serialize};
use reqwest::header::{ACCEPT, USER_AGENT};
use std::collections::HashMap;
use std::sync::Mutex;
use sha2::{Sha256, Digest};
use base64::{Engine as _, engine::general_purpose::URL_SAFE_NO_PAD};
use rand::Rng;

// ═══════════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════════

// Redirect URI must match what is registered in Google/GitHub Console and tauri.conf.json
const REDIRECT_URI: &str = "typingpro://auth/callback";

pub fn get_google_client_id() -> String {
    std::env::var("GOOGLE_CLIENT_ID").unwrap_or_else(|_| "GOOGLE_CLIENT_ID_MISSING".to_string())
}

pub fn get_github_client_id() -> String {
    std::env::var("GITHUB_CLIENT_ID").unwrap_or_else(|_| "GITHUB_CLIENT_ID_MISSING".to_string())
}

pub fn get_github_client_secret() -> String {
    std::env::var("GITHUB_CLIENT_SECRET").unwrap_or_else(|_| "GITHUB_CLIENT_SECRET_MISSING".to_string())
}

pub fn get_google_client_secret() -> String {
    std::env::var("TAURI_GOOGLE_CLIENT_SECRET").unwrap_or_else(|_| "GOOGLE_CLIENT_SECRET_MISSING".to_string())
}

// ═══════════════════════════════════════════════════════════════════
// DATA STRUCTURES
// ═══════════════════════════════════════════════════════════════════

#[derive(Debug, Clone)]
pub struct PendingAuth {
    pub provider: String,
    pub code_verifier: Option<String>, // PKCE (Google only)
}

pub struct OAuthManager {
    // Map State -> PendingAuth
    pub pending: Mutex<HashMap<String, PendingAuth>>,
}

impl OAuthManager {
    pub fn new() -> Self {
        Self {
            pending: Mutex::new(HashMap::new()),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UserProfile {
    pub id: String,
    pub name: String,
    pub email: Option<String>,
    pub avatar_url: Option<String>,
    pub provider: String,
    pub token: String,
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
// CORE LOGIC
// ═══════════════════════════════════════════════════════════════════

fn generate_random_string() -> String {
    let mut rng = rand::thread_rng();
    let bytes: Vec<u8> = (0..32).map(|_| rng.gen()).collect();
    URL_SAFE_NO_PAD.encode(&bytes)
}

fn generate_code_challenge(verifier: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(verifier.as_bytes());
    let result = hasher.finalize();
    URL_SAFE_NO_PAD.encode(&result)
}

/// Generates the OAuth URL and stores the pending state
pub fn generate_auth_url(manager: &OAuthManager, provider: &str) -> Result<String, String> {
    let state = generate_random_string();
    
    match provider {
        "google" => {
            let verifier = generate_random_string();
            let challenge = generate_code_challenge(&verifier);
            
            // Store pending auth
            manager.pending.lock().unwrap().insert(state.clone(), PendingAuth {
                provider: "google".to_string(),
                code_verifier: Some(verifier),
            });

            // Construct URL
            Ok(format!(
                "https://accounts.google.com/o/oauth2/v2/auth?\
                 client_id={}\
                 &redirect_uri={}\
                 &response_type=code\
                 &scope=openid%20profile%20email\
                 &code_challenge={}\
                 &code_challenge_method=S256\
                 &state={}",
                get_google_client_id(),
                urlencoding::encode(REDIRECT_URI),
                challenge,
                state
            ))
        },
        "github" => {
            // Store pending auth (No PKCE for GitHub standard flow, but we use State)
            manager.pending.lock().unwrap().insert(state.clone(), PendingAuth {
                provider: "github".to_string(),
                code_verifier: None,
            });

            Ok(format!(
                "https://github.com/login/oauth/authorize?\
                 client_id={}\
                 &redirect_uri={}\
                 &scope=read:user%20user:email\
                 &state={}",
                get_github_client_id(),
                urlencoding::encode(REDIRECT_URI),
                state
            ))
        },
        _ => Err(format!("Unknown provider: {}", provider))
    }
}

/// Exchanges the code for a token
pub async fn exchange_code(manager: &OAuthManager, code: String, state: String) -> Result<UserProfile, String> {
    // Retrieve and remove pending auth
    let pending = {
        let mut map = manager.pending.lock().unwrap();
        map.remove(&state).ok_or("Invalid or expired OAuth state")?
    };

    match pending.provider.as_str() {
        "google" => exchange_google(code, pending.code_verifier.unwrap()).await,
        "github" => exchange_github(code).await,
        _ => Err("Unknown provider in pending state".to_string()),
    }
}

// ═══════════════════════════════════════════════════════════════════
// PROVIDER IMPLEMENTATIONS
// ═══════════════════════════════════════════════════════════════════

async fn exchange_google(code: String, verifier: String) -> Result<UserProfile, String> {
    let client = reqwest::Client::new();
    let mut params = HashMap::new();
    params.insert("code", code);
    params.insert("client_id", get_google_client_id());
    params.insert("client_secret", get_google_client_secret());
    params.insert("redirect_uri", REDIRECT_URI.to_string());
    params.insert("grant_type", "authorization_code".to_string());
    params.insert("code_verifier", verifier);

    let res = client.post("https://oauth2.googleapis.com/token")
        .form(&params)
        .send().await
        .map_err(|e| format!("Token request failed: {}", e))?;

    if !res.status().is_success() {
        return Err(format!("Google Token Exchange Failed: {}", res.text().await.unwrap_or_default()));
    }

    let token_data: GoogleTokenResponse = res.json().await.map_err(|e| e.to_string())?;

    // Get User Info
    let user: GoogleUserResponse = client.get("https://www.googleapis.com/oauth2/v2/userinfo")
        .bearer_auth(&token_data.access_token)
        .send().await
        .map_err(|e| e.to_string())?
        .json().await
        .map_err(|e| e.to_string())?;

    Ok(UserProfile {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.picture,
        provider: "google".to_string(),
        token: token_data.access_token,
    })
}

async fn exchange_github(code: String) -> Result<UserProfile, String> {
    let client = reqwest::Client::new();
    let mut params = HashMap::new();
    params.insert("code", code);
    params.insert("client_id", get_github_client_id());
    params.insert("client_secret", get_github_client_secret());
    params.insert("redirect_uri", REDIRECT_URI.to_string());

    let res = client.post("https://github.com/login/oauth/access_token")
        .header(ACCEPT, "application/json")
        .form(&params)
        .send().await
        .map_err(|e| format!("Token request failed: {}", e))?;

    if !res.status().is_success() {
        return Err(format!("GitHub Token Exchange Failed: {}", res.text().await.unwrap_or_default()));
    }

    let token_data: GithubTokenResponse = res.json().await.map_err(|e| e.to_string())?;

    // Get User Info
    let user: GithubUserResponse = client.get("https://api.github.com/user")
        .header(USER_AGENT, "TypingPro")
        .header(ACCEPT, "application/json")
        .bearer_auth(&token_data.access_token)
        .send().await
        .map_err(|e| e.to_string())?
        .json().await
        .map_err(|e| e.to_string())?;

    Ok(UserProfile {
        id: user.id.to_string(),
        name: user.login,
        email: user.email,
        avatar_url: user.avatar_url,
        provider: "github".to_string(),
        token: token_data.access_token,
    })
}
