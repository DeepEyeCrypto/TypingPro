use std::env;
use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
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
    pub fn from_env() -> Result<Self, String> {
        // Load .env from workspace root
        dotenv::dotenv().ok();
        
        let google_id = env::var("GOOGLE_CLIENT_ID")
            .map_err(|_| { 
                let e = "GOOGLE_CLIENT_ID missing in backend env".to_string();
                println!("Config Error: {}", e);
                e 
            })?;
        let google_secret = env::var("GOOGLE_CLIENT_SECRET")
            .map_err(|_| { 
                let e = "GOOGLE_CLIENT_SECRET missing in backend env".to_string();
                println!("Config Error: {}", e);
                e 
            })?;
        let github_id = env::var("GITHUB_CLIENT_ID")
            .map_err(|_| { 
                let e = "GITHUB_CLIENT_ID missing in backend env".to_string();
                println!("Config Error: {}", e);
                e 
            })?;
        let github_secret = env::var("GITHUB_CLIENT_SECRET")
            .map_err(|_| { 
                let e = "GITHUB_CLIENT_SECRET missing in backend env".to_string();
                println!("Config Error: {}", e);
                e 
            })?;
        
        // These are also needed for redirect URLs in exchange
        let google_redirect = env::var("VITE_GOOGLE_REDIRECT_URI")
            .map_err(|_| { 
                let e = "VITE_GOOGLE_REDIRECT_URI missing".to_string();
                println!("Config Error: {}", e);
                e 
            })?;
        let github_redirect = env::var("VITE_GITHUB_REDIRECT_URI")
            .map_err(|_| { 
                let e = "VITE_GITHUB_REDIRECT_URI missing".to_string();
                println!("Config Error: {}", e);
                e 
            })?;

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
        dotenv::dotenv().ok();
        ConfigHealthSummary {
            google_client_id_loaded: env::var("GOOGLE_CLIENT_ID").is_ok(),
            google_client_secret_loaded: env::var("GOOGLE_CLIENT_SECRET").is_ok(),
            github_client_id_loaded: env::var("GITHUB_CLIENT_ID").is_ok(),
            github_client_secret_loaded: env::var("GITHUB_CLIENT_SECRET").is_ok(),
        }
    }
}
