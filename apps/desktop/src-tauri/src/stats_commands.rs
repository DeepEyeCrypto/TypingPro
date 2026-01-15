use tauri::State;
use crate::database::Database;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
pub struct SessionSafe {
    pub wpm: i32,
    pub accuracy: f64,
    pub mode: String,
    pub mistakes: String, // JSON String
    pub user_id: String,
}

#[derive(Serialize)]
pub struct DashboardStats {
    pub avg_wpm: f64,
    pub max_wpm: i32,
    pub total_sessions: i64,
    pub total_xp: i64,
}

#[tauri::command]
pub async fn save_session(
    db: State<'_, Database>,
    wpm: i32,
    accuracy: f64,
    mode: String,
    mistakes: String,
    user_id: String
) -> Result<String, String> {
    let session_id = Uuid::new_v4().to_string();
    
    // Calculate XP (Example: WPM * Accuracy * 0.1)
    let xp_gained = (wpm as f64 * accuracy * 0.1) as i64;

    // Transaction to save session and update user XP
    let mut tx = db.pool.begin().await.map_err(|e: sqlx::Error| e.to_string())?;

    // 1. Insert Session
    sqlx::query(
        "INSERT INTO sessions (id, user_id, wpm, accuracy, mode, mistakes_json) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .bind(&session_id)
    .bind(&user_id)
    .bind(wpm)
    .bind(accuracy)
    .bind(&mode)
    .bind(&mistakes)
    .execute(&mut *tx)
    .await
    .map_err(|e: sqlx::Error| e.to_string())?;

    // 2. Update User XP (Upsert if user doesn't exist? Ideally user exists from Login)
    // Assuming User exists or we create them on the fly
    sqlx::query(
        "UPDATE users SET xp = xp + ? WHERE id = ?"
    )
    .bind(xp_gained)
    .bind(&user_id)
    .execute(&mut *tx)
    .await
    .map_err(|e: sqlx::Error| e.to_string())?;

    tx.commit().await.map_err(|e: sqlx::Error| e.to_string())?;

    Ok(format!("Session saved. XP Gained: {}", xp_gained))
}

#[tauri::command]
pub async fn get_dashboard_stats(db: State<'_, Database>, user_id: String) -> Result<DashboardStats, String> {
    let row = sqlx::query(
        r#"
        SELECT 
            AVG(wpm) as avg_wpm, 
            MAX(wpm) as max_wpm, 
            COUNT(*) as total_sessions 
        FROM sessions 
        WHERE user_id = ?
        "#
    )
    .bind(&user_id)
    .fetch_one(&db.pool)
    .await
    .map_err(|e: sqlx::Error| e.to_string())?;

    let user = sqlx::query(
        "SELECT xp FROM users WHERE id = ?"
    )
    .bind(&user_id)
    .fetch_optional(&db.pool)
    .await
    .map_err(|e: sqlx::Error| e.to_string())?;

    use sqlx::Row;
    Ok(DashboardStats {
        avg_wpm: row.get::<Option<f64>, _>("avg_wpm").unwrap_or(0.0),
        max_wpm: row.get::<Option<i32>, _>("max_wpm").unwrap_or(0),
        total_sessions: row.get::<i64, _>("total_sessions"),
        total_xp: user.map(|u| u.get::<Option<i64>, _>("xp").unwrap_or(0)).unwrap_or(0),
    })
}

#[tauri::command]
pub async fn ensure_user(
    db: State<'_, Database>,
    id: String,
    email: String,
    username: String,
    avatar_url: String
) -> Result<String, String> {
    sqlx::query(
        "INSERT INTO users (id, email, username, avatar_url) VALUES (?, ?, ?, ?) 
         ON CONFLICT(id) DO UPDATE SET username=excluded.username, avatar_url=excluded.avatar_url"
    )
    .bind(id)
    .bind(email)
    .bind(username)
    .bind(avatar_url)
    .execute(&db.pool)
    .await
    .map_err(|e: sqlx::Error| e.to_string())?;

    Ok("User synced".to_string())
}
