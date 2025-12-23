use serde::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Clone)]
pub struct OAuthConfig {
    pub google_client_id: String,
    pub google_client_secret: String,
    pub google_redirect_uri: String,
    pub github_client_id: String,
    pub github_client_secret: String,
    pub github_redirect_uri: String,
    pub gemini_api_key: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct PublicConfig {
    pub google_client_id: String,
    pub google_redirect_uri: String,
    pub github_client_id: String,
    pub github_redirect_uri: String,
    pub has_gemini_key: bool,
}

#[derive(Debug, Clone, Serialize)]
pub struct ConfigHealthSummary {
    pub google_client_id_loaded: bool,
    pub google_client_secret_loaded: bool,
    pub github_client_id_loaded: bool,
    pub github_client_secret_loaded: bool,
    pub gemini_key_loaded: bool,
}

impl OAuthConfig {
    pub fn from_env() -> Result<Self, String> {
        // Explicitly load .env from the executable's directory or root
        if let Ok(exe_path) = std::env::current_exe() {
            if let Some(exe_dir) = exe_path.parent() {
                dotenv::from_path(exe_dir.join(".env")).ok();
            }
        }
        dotenv::dotenv().ok(); // Fallback to current directory

        let get_var = |name: &str| -> Result<String, String> {
            env::var(name).map_err(|_| format!("Critical configuration missing: {}. Please check your .env file or GitHub Secrets.", name))
        };

        Ok(Self {
            google_client_id: get_var("GOOGLE_CLIENT_ID")?,
            google_client_secret: get_var("GOOGLE_CLIENT_SECRET")?,
            google_redirect_uri: get_var("VITE_GOOGLE_REDIRECT_URI")?,
            github_client_id: get_var("GITHUB_CLIENT_ID")?,
            github_client_secret: get_var("GITHUB_CLIENT_SECRET")?,
            github_redirect_uri: get_var("VITE_GITHUB_REDIRECT_URI")?,
            gemini_api_key: env::var("GEMINI_API_KEY").ok(),
        })
    }

    pub fn get_public_config(&self) -> PublicConfig {
        PublicConfig {
            google_client_id: self.google_client_id.clone(),
            google_redirect_uri: self.google_redirect_uri.clone(),
            github_client_id: self.github_client_id.clone(),
            github_redirect_uri: self.github_redirect_uri.clone(),
            has_gemini_key: self.gemini_api_key.is_some(),
        }
    }

    pub fn get_summary() -> ConfigHealthSummary {
        dotenv::dotenv().ok();
        ConfigHealthSummary {
            google_client_id_loaded: env::var("GOOGLE_CLIENT_ID").is_ok(),
            google_client_secret_loaded: env::var("GOOGLE_CLIENT_SECRET").is_ok(),
            github_client_id_loaded: env::var("GITHUB_CLIENT_ID").is_ok(),
            github_client_secret_loaded: env::var("GITHUB_CLIENT_SECRET").is_ok(),
            gemini_key_loaded: env::var("GEMINI_API_KEY").is_ok(),
        }
    }
}
