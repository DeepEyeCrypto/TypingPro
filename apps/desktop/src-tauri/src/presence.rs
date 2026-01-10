use discord_presence::{client::Event, Client as DiscordClient};
use lazy_static::lazy_static;
use log::{error, info};
use std::sync::Mutex;
use tauri::AppHandle;

lazy_static! {
    static ref DISCORD_CLIENT: Mutex<Option<DiscordClient>> = Mutex::new(None);
}

pub struct PresenceManager;

impl PresenceManager {
    pub fn init() -> Result<(), String> {
        let mut client = DiscordClient::new(1326495525997412403); // Placeholder App ID - Should be replaced with real one if available

        client.on_ready(|_ctx| {
            info!("Discord RPC Connected");
        });

        client.on_error(|_ctx| {
            error!("Discord RPC Error");
        });

        client.start();

        let mut global_client = DISCORD_CLIENT.lock().unwrap();
        *global_client = Some(client);

        Ok(())
    }

    pub fn update(state: &str, details: &str) -> Result<(), String> {
        let mut client_lock = DISCORD_CLIENT.lock().unwrap();
        if let Some(client) = client_lock.as_mut() {
            let res = client.set_activity(|a| {
                a.state(state)
                    .details(details)
                    .assets(|_assets| _assets.large_image("icon")) // Assuming 'icon' asset is uploaded to Discord
            });

            if let Err(e) = res {
                return Err(format!("Failed to update Discord presence: {}", e));
            }
        }
        Ok(())
    }

    pub fn clear() -> Result<(), String> {
        let mut client_lock = DISCORD_CLIENT.lock().unwrap();
        if let Some(client) = client_lock.as_mut() {
            let _ = client.clear_activity();
        }
        Ok(())
    }
}

#[tauri::command]
pub fn update_presence(state: String, details: String) -> Result<(), String> {
    PresenceManager::update(&state, &details)
}
