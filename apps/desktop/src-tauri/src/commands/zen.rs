use tauri::{AppHandle, Manager};

#[tauri::command]
pub fn toggle_zen_window(app: AppHandle) -> Result<String, String> {
    if let Some(window) = app.get_webview_window("zen") {
        match window.is_visible() {
            Ok(true) => {
                window.hide().map_err(|e: tauri::Error| e.to_string())?;
                Ok("Zen window hidden".to_string())
            }
            Ok(false) => {
                window.show().map_err(|e: tauri::Error| e.to_string())?;
                window
                    .set_focus()
                    .map_err(|e: tauri::Error| e.to_string())?;
                Ok("Zen window shown".to_string())
            }
            Err(e) => Err(e.to_string()),
        }
    } else {
        Err("Zen window not found".to_string())
    }
}
