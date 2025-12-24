use rand::seq::SliceRandom;
use serde::{Deserialize, Serialize};
use std::time::Instant;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct TypingStats {
    pub wpm: f64,
    pub accuracy: f64,
    pub elapsed_time: f64,
    pub correct_chars: usize,
    pub total_chars: usize,
    pub finger_latency: Vec<f64>, // Latency per key in ms
}

pub struct TypingEngine {
    pub target_text: String,
    pub user_input: String,
    pub start_time: Option<Instant>,
    pub last_key_time: Option<Instant>,
    pub latencies: Vec<f64>,
    pub is_finished: bool,
}

impl TypingEngine {
    pub fn new() -> Self {
        Self {
            target_text: String::new(),
            user_input: String::new(),
            start_time: None,
            last_key_time: None,
            latencies: Vec::new(),
            is_finished: false,
        }
    }

    pub fn start_test(&mut self, text: String) {
        self.target_text = text;
        self.user_input = String::new();
        self.start_time = None;
        self.last_key_time = None;
        self.latencies = Vec::new();
        self.is_finished = false;
    }

    pub fn process_key(&mut self, key: char) -> TypingStats {
        if self.is_finished {
            return self.get_stats();
        }

        let now = Instant::now();

        // Timer starts on first key
        if self.start_time.is_none() {
            self.start_time = Some(now);
        }

        // Calculate latency between keys
        if let Some(last) = self.last_key_time {
            let latency = now.duration_since(last).as_secs_f64() * 1000.0;
            self.latencies.push(latency);
        }
        self.last_key_time = Some(now);

        self.user_input.push(key);

        if self.user_input.len() >= self.target_text.len() {
            self.is_finished = true;
        }

        self.get_stats()
    }

    pub fn handle_backspace(&mut self) -> TypingStats {
        if !self.user_input.is_empty() && !self.is_finished {
            self.user_input.pop();
            // We don't track latency for backspaces in the same way,
            // but we update the last_key_time to avoid spikes
            self.last_key_time = Some(Instant::now());
        }
        self.get_stats()
    }

    pub fn get_stats(&self) -> TypingStats {
        let elapsed = if let Some(start) = self.start_time {
            let end = self.last_key_time.unwrap_or(Instant::now());
            end.duration_since(start).as_secs_f64()
        } else {
            0.0
        };

        let mut correct = 0;
        let target_chars: Vec<char> = self.target_text.chars().collect();
        let user_chars: Vec<char> = self.user_input.chars().collect();

        for i in 0..user_chars.len() {
            if i < target_chars.len() && user_chars[i] == target_chars[i] {
                correct += 1;
            }
        }

        let wpm = if elapsed > 0.0 {
            (correct as f64 / 5.0) / (elapsed / 60.0)
        } else {
            0.0
        };

        let accuracy = if !user_chars.is_empty() {
            (correct as f64 / user_chars.len() as f64) * 100.0
        } else {
            100.0
        };

        TypingStats {
            wpm: wpm.round(),
            accuracy: accuracy.round(),
            elapsed_time: elapsed,
            correct_chars: correct,
            total_chars: user_chars.len(),
            finger_latency: self.latencies.clone(),
        }
    }

    pub fn get_slow_keys(&self) -> Vec<(char, f64)> {
        // Simple analysis: identify keys with latency > 2x average
        if self.latencies.is_empty() {
            return Vec::new();
        }
        let avg: f64 = self.latencies.iter().sum::<f64>() / self.latencies.len() as f64;
        let mut slow = Vec::new();

        let target_chars: Vec<char> = self.target_text.chars().collect();
        for (i, latency) in self.latencies.iter().enumerate() {
            if *latency > avg * 1.5 && i < target_chars.len() {
                slow.push((target_chars[i], *latency));
            }
        }
        slow
    }
}

pub fn generate_words(count: usize) -> String {
    let pool = vec![
        "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on",
        "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we",
        "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their",
        "what",
    ];
    let mut rng = rand::thread_rng();
    let mut result = Vec::new();
    for _ in 0..count {
        if let Some(word) = pool.choose(&mut rng) {
            result.push(*word);
        }
    }
    result.join(" ")
}
