use log::LevelFilter;
use simplelog::{Config, WriteLogger};
use std::fs::File;
use tauri::{App, Manager, Runtime};

pub fn init_logging<R: Runtime>(app: &App<R>) -> Result<(), String> {
    let app_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;

    // Ensure the directory exists
    if !app_dir.exists() {
        std::fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;
    }

    let log_path = app_dir.join("typingpro_desktop.log");

    WriteLogger::init(
        LevelFilter::Info,
        Config::default(),
        File::create(log_path).map_err(|e| e.to_string())?,
    )
    .map_err(|e| e.to_string())?;

    log::info!("Logger initialized!");
    Ok(())
}
