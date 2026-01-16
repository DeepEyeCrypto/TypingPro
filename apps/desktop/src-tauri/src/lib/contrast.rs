// ═══════════════════════════════════════════════════════════════════
// CONTRAST UTILITY MODULE
// WCAG 2.1 Relative Luminance & Contrast Ratio Logic
// ═══════════════════════════════════════════════════════════════════

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Rgb {
    pub r: f64,
    pub g: f64,
    pub b: f64,
}

/// Parses a hex string (e.g., "#FFFFFF" or "FFFFFF") into RGB components (0.0 - 1.0)
pub fn hex_to_rgb(hex: &str) -> Result<Rgb, String> {
    let hex = hex.trim_start_matches('#');
    if hex.len() != 6 {
        return Err("Invalid hex color format. Expected 6 characters.".to_string());
    }

    let r = u8::from_str_radix(&hex[0..2], 16).map_err(|_| "Invalid red component")?;
    let g = u8::from_str_radix(&hex[2..4], 16).map_err(|_| "Invalid green component")?;
    let b = u8::from_str_radix(&hex[4..6], 16).map_err(|_| "Invalid blue component")?;

    Ok(Rgb {
        r: r as f64 / 255.0,
        g: g as f64 / 255.0,
        b: b as f64 / 255.0,
    })
}

/// Calculates relative luminance based on WCAG formula:
/// L = 0.2126 * R + 0.7152 * G + 0.0722 * B
/// (R, G, B normalized and gamma-corrected)
pub fn calculate_relative_luminance(rgb: &Rgb) -> f64 {
    let f = |c: f64| {
        if c <= 0.03928 {
            c / 12.92
        } else {
            ((c + 0.055) / 1.055).powf(2.4)
        }
    };

    let r = f(rgb.r);
    let g = f(rgb.g);
    let b = f(rgb.b);

    0.2126 * r + 0.7152 * g + 0.0722 * b
}

/// Determines whether black or white text should be used for a given background hex.
/// Returns "#000000" or "#FFFFFF".
pub fn get_contrast_text(bg_hex: &str) -> Result<String, String> {
    let rgb = hex_to_rgb(bg_hex)?;
    let luminance = calculate_relative_luminance(&rgb);

    // Read threshold from environment or fallback to WCAG standard 0.179
    let threshold = std::env::var("CONTRAST_THRESHOLD")
        .ok()
        .and_then(|s| s.parse::<f64>().ok())
        .unwrap_or(0.179);

    let is_debug = std::env::var("TAURI_CONTRAST_DEBUG")
        .map(|s| s.to_lowercase() == "true")
        .unwrap_or(false);

    if is_debug {
        println!(
            "[CONTRAST DEBUG] Hex: {}, Luminance: {:.4}, Threshold: {:.4}",
            bg_hex, luminance, threshold
        );
    }

    if luminance > threshold {
        Ok("#000000".to_string())
    } else {
        Ok("#FFFFFF".to_string())
    }
}

/// Tauri Command for Frontend Access
#[tauri::command]
pub fn contrast_get_text_color(bg_hex: String) -> Result<String, String> {
    get_contrast_text(&bg_hex)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_contrast_logic() {
        assert_eq!(get_contrast_text("#FFFFFF").unwrap(), "#000000"); // White bg -> Black text
        assert_eq!(get_contrast_text("#000000").unwrap(), "#FFFFFF"); // Black bg -> White text
        assert_eq!(get_contrast_text("#4a90e2").unwrap(), "#FFFFFF"); // Blue bg -> White text
        assert_eq!(get_contrast_text("#FFFF00").unwrap(), "#000000"); // Yellow bg -> Black text
    }
}
