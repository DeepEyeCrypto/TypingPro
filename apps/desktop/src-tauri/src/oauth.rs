use serde::{Deserialize, Serialize};
use reqwest::header::{ACCEPT, USER_AGENT};
use std::collections::HashMap;

pub const GOOGLE_CLIENT_ID: &str = "2xxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com";
pub const GOOGLE_CLIENT_SECRET: &str = "154138a75e1266a4e8279be91e85d189d6a0dbbd";
pub const GITHUB_CLIENT_ID: &str = "0v23l1i00BXXC6qACXDuG";
pub const GITHUB_CLIENT_SECRET: &str = "cd1416b9e41edc7a5c713aff95e60ff1d1aeff47";

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


pub fn get_google_auth_url() -> String {
    let client_id = std::env::var("GOOGLE_CLIENT_ID").unwrap_or_else(|_| "2xxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com".to_string());
    format!(
        "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id={}&redirect_uri=typingpro://auth/google/callback&scope=openid%20profile%20email",
        client_id
    )
}

pub fn get_github_auth_url() -> String {
    let client_id = std::env::var("GITHUB_CLIENT_ID").unwrap_or_else(|_| "0v23l1i00BXXC6qACXDuG".to_string());
    format!(
        "https://github.com/login/oauth/authorize?client_id={}&redirect_uri=typingpro://auth/github/callback&scope=user:email",
        client_id
    )
}

pub async fn exchange_google_code(code: String) -> Result<UserProfile, String> {
    let client = reqwest::Client::new();
    let client_id = std::env::var("GOOGLE_CLIENT_ID").unwrap_or_else(|_| "2xxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com".to_string());
    let client_secret = std::env::var("GOOGLE_CLIENT_SECRET").unwrap_or_else(|_| "154138a75e1266a4e8279be91e85d189d6a0dbbd".to_string());
    
    let mut params = HashMap::new();
    params.insert("code", code);
    params.insert("client_id", client_id);
    params.insert("client_secret", client_secret);
    params.insert("redirect_uri", "typingpro://auth/google/callback".to_string());
    params.insert("grant_type", "authorization_code".to_string());

    let res: reqwest::Response = client.post("https://oauth2.googleapis.com/token")
        .form(&params)
        .send()
        .await
        .map_err(|e: reqwest::Error| e.to_string())?;

    let token_data = res.json::<GoogleTokenResponse>().await.map_err(|e: reqwest::Error| e.to_string())?;

    let user_res = client.get("https://www.googleapis.com/oauth2/v2/userinfo")
        .bearer_auth(token_data.access_token.clone())
        .send()
        .await
        .map_err(|e: reqwest::Error| e.to_string())?;

    let user_data = user_res.json::<GoogleUserResponse>().await.map_err(|e: reqwest::Error| e.to_string())?;

    Ok(UserProfile {
        id: user_data.id,
        name: user_data.name,
        email: user_data.email,
        avatar_url: user_data.picture,
        provider: "google".to_string(),
        token: token_data.access_token
    })
}

pub async fn exchange_github_code(code: String) -> Result<UserProfile, String> {
    let client = reqwest::Client::new();
    let client_id = std::env::var("GITHUB_CLIENT_ID").unwrap_or_else(|_| "0v23l1i00BXXC6qACXDuG".to_string());
    let client_secret = std::env::var("GITHUB_CLIENT_SECRET").unwrap_or_else(|_| "cd1416b9e41edc7a5c713aff95e60ff1d1aeff47".to_string());
    
    let mut params = HashMap::new();
    params.insert("code", code);
    params.insert("client_id", client_id);
    params.insert("client_secret", client_secret);
    params.insert("redirect_uri", "typingpro://auth/github/callback".to_string());

    let res: reqwest::Response = client.post("https://github.com/login/oauth/access_token")
        .header(ACCEPT, "application/json")
        .form(&params)
        .send()
        .await
        .map_err(|e: reqwest::Error| e.to_string())?;

    let token_data = res.json::<GithubTokenResponse>().await.map_err(|e: reqwest::Error| e.to_string())?;

    let user_res = client.get("https://api.github.com/user")
        .header(USER_AGENT, "DeepEyeSniper")
        .header(ACCEPT, "application/json")
        .bearer_auth(token_data.access_token.clone())
        .send()
        .await
        .map_err(|e: reqwest::Error| e.to_string())?;

    let user_data = user_res.json::<GithubUserResponse>().await.map_err(|e: reqwest::Error| e.to_string())?;

    Ok(UserProfile {
        id: user_data.id.to_string(),
        name: user_data.login,
        email: user_data.email,
        avatar_url: user_data.avatar_url,
        provider: "github".to_string(),
        token: token_data.access_token
    })
}
