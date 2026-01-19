use serde::{Deserialize, Serialize};
use tauri::command;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct VisualPreferences {
    pub theme: String,
    pub skin: String,
    pub font_family: String,
}

#[command]
pub fn sync_visual_preferences(
    theme: String,
    skin: String,
    font_family: String,
) -> Result<(), String> {
    // This command acts as a bridge to ensure the Rust backend is aware of the current UI state.
    // In a full implementation, this could be saved to a persistent SQLite store or a config file.
    println!(
        "Backend Synced: Theme={}, Skin={}, Font={}",
        theme, skin, font_family
    );
    Ok(())
}
