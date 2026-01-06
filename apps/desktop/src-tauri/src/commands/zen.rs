use tauri::AppHandle;

#[tauri::command]
pub fn toggle_zen_window(app: AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("zen") {
        match window.is_visible() {
            Ok(true) => {
                window.hide().map_err(|e| e.to_string())?;
            }
            _ => {
                window.show().map_err(|e| e.to_string())?;
                window.set_focus().map_err(|e| e.to_string())?;
            }
        }
    }
    Ok(())
}
