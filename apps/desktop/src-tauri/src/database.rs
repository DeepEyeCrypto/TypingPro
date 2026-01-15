use sqlx::sqlite::SqlitePoolOptions;
use sqlx::{Pool, Sqlite};
use std::fs;
use std::path::PathBuf;
use tauri::AppHandle;
use tauri::Manager;

pub struct Database {
    pub pool: Pool<Sqlite>,
}

const DB_FILENAME: &str = "typingpro.db";

pub async fn init_db(app: &AppHandle) -> Result<Database, Box<dyn std::error::Error>> {
    let app_dir = app.path().app_data_dir()?;
    if !app_dir.exists() {
        fs::create_dir_all(&app_dir)?;
    }
    
    let db_path = app_dir.join(DB_FILENAME);
    let db_url = format!("sqlite://{}", db_path.to_string_lossy());
    
    if !db_path.exists() {
        fs::File::create(&db_path)?;
    }

    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&db_url)
        .await?;

    sqlx::query(
        "CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE,
            username TEXT,
            avatar_url TEXT,
            xp INTEGER DEFAULT 0,
            is_pro BOOLEAN DEFAULT 0
        );"
    )
    .execute(&pool)
    .await?;

    sqlx::query(
        "CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            wpm INTEGER,
            accuracy REAL,
            mode TEXT,
            mistakes_json TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );"
    )
    .execute(&pool)
    .await?;

    Ok(Database { pool })
}
