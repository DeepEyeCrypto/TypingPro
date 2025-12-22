use std::env;
use serde::Serialize;
use crate::log_to_file;

#[derive(Debug, Clone, Serialize)]
pub struct OAuthConfig {
    pub google_client_id: String,
    pub google_client_secret: String,
    pub google_redirect_uri: String,
    pub github_client_id: String,
    pub github_client_secret: String,
    pub github_redirect_uri: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct ConfigHealthSummary {
    pub google_client_id_loaded: bool,
    pub google_client_secret_loaded: bool,
    pub github_client_id_loaded: bool,
    pub github_client_secret_loaded: bool,
}

impl OAuthConfig {
    pub fn from_env(app_handle: &tauri::AppHandle) -> Result<Self, String> {
        let google_id = env::var("GOOGLE_CLIENT_ID").map_err(|_| "GOOGLE_CLIENT_ID missing".to_string())?;
        let google_secret = env::var("GOOGLE_CLIENT_SECRET").map_err(|_| "GOOGLE_CLIENT_SECRET missing".to_string())?;
        let github_id = env::var("GITHUB_CLIENT_ID").map_err(|_| "GITHUB_CLIENT_ID missing".to_string())?;
        let github_secret = env::var("GITHUB_CLIENT_SECRET").map_err(|_| "GITHUB_CLIENT_SECRET missing".to_string())?;
        
        // Use suggested redirect URIs from prompt
        let google_redirect = env::var("VITE_GOOGLE_REDIRECT_URI").unwrap_or_else(|_| "http://localhost:1420/auth/google/callback".to_string());
        let github_redirect = env::var("VITE_GITHUB_REDIRECT_URI").unwrap_or_else(|_| "http://localhost:1420/auth/github/callback".to_string());

        Ok(Self {
            google_client_id: google_id,
            google_client_secret: google_secret,
            google_redirect_uri: google_redirect,
            github_client_id: github_id,
            github_client_secret: github_secret,
            github_redirect_uri: github_redirect,
        })
    }

    pub fn get_summary() -> ConfigHealthSummary {
        ConfigHealthSummary {
            google_client_id_loaded: env::var("GOOGLE_CLIENT_ID").is_ok(),
            google_client_secret_loaded: env::var("GOOGLE_CLIENT_SECRET").is_ok(),
            github_client_id_loaded: env::var("GITHUB_CLIENT_ID").is_ok(),
            github_client_secret_loaded: env::var("GITHUB_CLIENT_SECRET").is_ok(),
        }
    }
}
