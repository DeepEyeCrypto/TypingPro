use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TypingMetrics {
    pub raw_wpm: f64,
    pub adjusted_wpm: f64,
    pub accuracy: f64,
    pub consistency: f64,
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

    pub fn calculate_metrics(&self) -> TypingMetrics {
        if self.timestamps.len() < 2 {
            return TypingMetrics {
                raw_wpm: 0.0,
                adjusted_wpm: 0.0,
                accuracy: 100.0,
                consistency: 100.0,
            };
        }

        let start_time = self.timestamps[0];
        let last_time = *self.timestamps.last().unwrap();
        let duration_mins = (last_time - start_time) as f64 / 60000.0;

        let total_chars = self.typed_chars.len();
        let mut correct_chars = 0;
        let target_chars: Vec<char> = self.target_text.chars().collect();

        for (i, &typed) in self.typed_chars.iter().enumerate() {
            if i < target_chars.len() && typed == target_chars[i] {
                correct_chars += 1;
            }
        }

        let raw_wpm = (total_chars as f64 / 5.0) / duration_mins;
        let adjusted_wpm = (correct_chars as f64 / 5.0) / duration_mins;
        let accuracy = (correct_chars as f64 / total_chars as f64) * 100.0;

        let mut intervals = Vec::new();
        for i in 1..self.timestamps.len() {
            intervals.push((self.timestamps[i] - self.timestamps[i - 1]) as f64);
        }

        let avg_interval = intervals.iter().sum::<f64>() / intervals.len() as f64;
        let variance = intervals
            .iter()
            .map(|&i| (i - avg_interval).powi(2))
            .sum::<f64>()
            / intervals.len() as f64;

        let consistency = (100.0 - (variance.sqrt() / 10.0)).max(0.0).min(100.0);

        TypingMetrics {
            raw_wpm,
            adjusted_wpm,
            accuracy,
            consistency,
        }
    }
}
