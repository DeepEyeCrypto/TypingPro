use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TypingMetrics {
    pub gross_wpm: f64,
    pub net_wpm: f64,
    pub accuracy: f64,
    pub consistency: f64,
    pub is_bot: bool,
    pub cheat_flags: String,
}

pub struct TypingEngine {
    pub target_text: String,
    pub typed_chars: Vec<char>,
    pub timestamps: Vec<u64>,
    pub is_active: bool,
}

impl TypingEngine {
    pub fn new() -> Self {
        Self {
            target_text: String::new(),
            typed_chars: Vec::new(),
            timestamps: Vec::new(),
            is_active: false,
        }
    }

    pub fn start(&mut self, text: String) {
        self.target_text = text;
        self.typed_chars = Vec::new();
        self.timestamps = Vec::new();
        self.is_active = true;
    }

    pub fn push_char(&mut self, c: char, timestamp: u64) -> TypingMetrics {
        self.typed_chars.push(c);
        self.timestamps.push(timestamp);
        self.calculate_metrics()
    }

    pub fn get_last_timestamp(&self) -> u64 {
        *self.timestamps.last().unwrap_or(&0)
    }

    pub fn calculate_metrics(&self) -> TypingMetrics {
        if self.timestamps.len() < 2 {
            return TypingMetrics {
                gross_wpm: 0.0,
                net_wpm: 0.0,
                accuracy: 100.0,
                consistency: 100.0,
                is_bot: false,
                cheat_flags: String::new(),
            };
        }

        let start_time = self.timestamps[0];
        let last_time = *self.timestamps.last().unwrap();
        // Avoid division by zero if start == last
        let duration_mins = f64::max((last_time - start_time) as f64 / 60000.0, 0.0001);

        let total_chars = self.typed_chars.len();
        let mut correct_chars = 0;
        let mut uncorrected_errors = 0;
        let target_chars: Vec<char> = self.target_text.chars().collect();

        for (i, &typed) in self.typed_chars.iter().enumerate() {
            if i < target_chars.len() {
                if typed == target_chars[i] {
                    correct_chars += 1;
                } else {
                    uncorrected_errors += 1;
                }
            } else {
                // Extra characters typed are errors
                uncorrected_errors += 1;
            }
        }

        // Gross WPM: (All typed entries / 5) / Time (min)
        let gross_wpm = if duration_mins > 0.0001 {
            (total_chars as f64 / 5.0) / duration_mins
        } else {
            0.0
        };

        // Net WPM: Gross WPM - (Uncorrected Errors / Time (min))
        // This is the standard "Accuracy Penalty" logic.
        let penalty = if duration_mins > 0.0001 {
            uncorrected_errors as f64 / duration_mins
        } else {
            0.0
        };
        let net_wpm = f64::max(gross_wpm - penalty, 0.0);

        let accuracy = if total_chars > 0 {
            (correct_chars as f64 / total_chars as f64) * 100.0
        } else {
            100.0
        };

        // Consistency Calculation (Coefficient of Variation of Latency)
        let mut intervals = Vec::new();
        for i in 1..self.timestamps.len() {
            // Filter out potential crazy outliers if needed, currently raw
            let interval = (self.timestamps[i] - self.timestamps[i - 1]) as f64;
            if interval > 0.0 {
                // Ignore 0ms intervals to prevent skew
                intervals.push(interval);
            }
        }

        let consistency = if !intervals.is_empty() {
            let avg_interval = intervals.iter().sum::<f64>() / intervals.len() as f64;

            if avg_interval > 0.0 {
                let variance = intervals
                    .iter()
                    .map(|&i| (i - avg_interval).powi(2))
                    .sum::<f64>()
                    / intervals.len() as f64;

                let std_dev = variance.sqrt();
                let cv = std_dev / avg_interval;
                (100.0 - (cv * 100.0)).clamp(0.0, 100.0)
            } else {
                100.0
            }
        } else {
            100.0
        };

        // Anti-Cheat Heuristics
        let mut is_bot = false;
        let mut cheat_flags = Vec::new();

        // 1. Superhuman Speed (350+ NET WPM)
        if net_wpm > 350.0 {
            is_bot = true;
            cheat_flags.push("SPEED_LIMIT_EXCEEDED");
        }

        // 2. Ultrasonic Typing (Avg Latency < 20ms) & Zero Variance (Std Dev < 2.0ms)
        if !intervals.is_empty() {
            let avg_interval = intervals.iter().sum::<f64>() / intervals.len() as f64;

            // Ultrasonic
            if avg_interval < 20.0 {
                is_bot = true;
                cheat_flags.push("ULTRASONIC_INPUT");
            }

            // Zero Variance (Macro Detection)
            // Std Dev is already calculated as variance.sqrt() logic but we need the raw std_dev here.
            // Let's reuse or recalculate std_dev
            let variance = intervals
                .iter()
                .map(|&i| (i - avg_interval).powi(2))
                .sum::<f64>()
                / intervals.len() as f64;
            let std_dev = variance.sqrt();

            // Strict consistency check: If user typed > 10 chars and std_dev is insanely low (< 2ms)
            if self.typed_chars.len() > 10 && std_dev < 2.0 {
                is_bot = true;
                cheat_flags.push("MACRO_DETECTED_ZERO_VARIANCE");
            }
        }

        TypingMetrics {
            gross_wpm,
            net_wpm,
            accuracy,
            consistency,
            is_bot,
            cheat_flags: cheat_flags.join("|"),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_initial_metrics() {
        let mut engine = TypingEngine::new();
        engine.start("hello".to_string());
        let metrics = engine.calculate_metrics();
        assert_eq!(metrics.gross_wpm, 0.0);
        assert_eq!(metrics.net_wpm, 0.0);
        assert_eq!(metrics.accuracy, 100.0);
    }

    #[test]
    fn test_perfect_typing() {
        let mut engine = TypingEngine::new();
        engine.start("abc".to_string());
        // Type 'a' at 0ms, 'b' at 200ms, 'c' at 400ms
        // Total time = 400ms = 0.4s = 0.00666 min
        // Total chars = 3. Gross = (3/5) / 0.0066 = 0.6 / 0.0066 = ~90 WPM
        engine.push_char('a', 1000);
        engine.push_char('b', 1200);
        engine.push_char('c', 1400);

        let metrics = engine.calculate_metrics();
        assert!(metrics.gross_wpm > 80.0);
        assert!(metrics.net_wpm > 80.0); // No errors, so Net ~= Gross
        assert_eq!(metrics.accuracy, 100.0);
    }

    #[test]
    fn test_accuracy_penalty() {
        let mut engine = TypingEngine::new();
        engine.start("abc".to_string());
        // Type 'a' (correct), 'x' (wrong), 'c' (correct)
        // 1 Error.
        engine.push_char('a', 1000);
        engine.push_char('x', 1200);
        engine.push_char('c', 1400);

        let metrics = engine.calculate_metrics();
        // Gross should be same as perfect typing (3 chars typed)
        // Net should be significantly lower due to error penalty
        assert!(metrics.gross_wpm > 80.0);
        assert!(metrics.net_wpm < metrics.gross_wpm);
        assert!(metrics.accuracy < 100.0);
    }
}
