use rand::seq::SliceRandom;
use serde::{Deserialize, Serialize};
use std::time::{Duration, Instant};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct TypingStats {
    pub wpm: f64,
    pub accuracy: f64,
    pub consistency: f64,
    pub elapsed_time: f64,
    pub correct_chars: usize,
    pub total_chars: usize,
    pub error_count: usize,
    pub finger_latency: Vec<f64>, // Latency per key in ms
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Lesson {
    pub id: usize,
    pub stage: usize,
    pub title: String,
    pub text: String,
    pub target_wpm: f64,
}

pub struct TypingEngine {
    pub current_lesson: Option<Lesson>,
    pub user_input: String,
    pub start_time: Option<Instant>,
    pub last_key_time: Option<Instant>,
    pub latencies: Vec<f64>,
    pub error_indices: Vec<usize>,
    pub is_finished: bool,
    pub lessons: Vec<Lesson>,
}

impl TypingEngine {
    pub fn new() -> Self {
        let mut engine = Self {
            current_lesson: None,
            user_input: String::new(),
            start_time: None,
            last_key_time: None,
            latencies: Vec::new(),
            error_indices: Vec::new(),
            is_finished: false,
            lessons: Vec::new(),
        };
        engine.load_scientific_curriculum();
        engine
    }

    fn load_scientific_curriculum(&mut self) {
        // Stage 1: Home Row
        let stage1 = vec![
            ("Home Row 1", "asdf jkl; asdf jkl;", 20.0),
            ("Home Row 2", "fjdks l;as fjdks l;as", 25.0),
            ("Home Row 3", "gh gh t y ty ty", 30.0),
            ("Home Row Mastery", "asdfghjkl; asdfghjkl;", 35.0),
        ];

        // Stage 2: Expansion
        let stage2 = vec![
            ("Top Row 1", "qwer uiop qwer uiop", 30.0),
            ("Bottom Row 1", "zxcv m,. zxcv m,.", 30.0),
            (
                "Full Keyboard",
                "the quick brown fox jumps over the lazy dog",
                45.0,
            ),
        ];

        // Combine into lessons
        let mut id = 1;
        for (idx, (title, text, wpm)) in stage1.into_iter().enumerate() {
            self.lessons.push(Lesson {
                id,
                stage: 1,
                title: title.to_string(),
                text: text.to_string(),
                target_wpm: wpm,
            });
            id += 1;
        }
        for (idx, (title, text, wpm)) in stage2.into_iter().enumerate() {
            self.lessons.push(Lesson {
                id,
                stage: 2,
                title: title.to_string(),
                text: text.to_string(),
                target_wpm: wpm,
            });
            id += 1;
        }

        // Placeholder for the rest of the 100 lessons
        for i in 8..=100 {
            self.lessons.push(Lesson {
                id: i,
                stage: (i / 10) + 1,
                title: format!("Mastery Level {}", i),
                text:
                    "The precision of Rust combined with the fluidity of design creates TypingPro."
                        .to_string(),
                target_wpm: 50.0 + (i as f64 * 0.5),
            });
        }
    }

    pub fn get_lesson(&mut self, lesson_id: usize) -> Option<Lesson> {
        let lesson = self.lessons.iter().find(|l| l.id == lesson_id)?.clone();
        self.current_lesson = Some(lesson.clone());
        self.user_input = String::new();
        self.start_time = None;
        self.last_key_time = None;
        self.latencies = Vec::new();
        self.error_indices = Vec::new();
        self.is_finished = false;
        Some(lesson)
    }

    pub fn process_key(&mut self, key: char) -> TypingStats {
        if self.is_finished || self.current_lesson.is_none() {
            return self.get_stats();
        }

        let lesson_text = self.current_lesson.as_ref().unwrap().text.clone();
        let now = Instant::now();

        if self.start_time.is_none() {
            self.start_time = Some(now);
        }

        if let Some(last) = self.last_key_time {
            let latency = now.duration_since(last).as_secs_f64() * 1000.0;
            self.latencies.push(latency);
        }
        self.last_key_time = Some(now);

        let current_pos = self.user_input.len();
        if current_pos < lesson_text.len() {
            let target_char = lesson_text.chars().nth(current_pos).unwrap();
            if key != target_char {
                self.error_indices.push(current_pos);
            }
            self.user_input.push(key);
        }

        if self.user_input.len() >= lesson_text.len() {
            self.is_finished = true;
        }

        self.get_stats()
    }

    pub fn handle_backspace(&mut self) -> TypingStats {
        if !self.user_input.is_empty() && !self.is_finished {
            self.user_input.pop();
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

        let lesson_text = match &self.current_lesson {
            Some(l) => l.text.as_str(),
            None => "",
        };

        let mut correct = 0;
        let user_chars: Vec<char> = self.user_input.chars().collect();
        let target_chars: Vec<char> = lesson_text.chars().collect();

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

        // Consistency calculation (SD of latencies)
        let consistency = if self.latencies.len() > 1 {
            let avg: f64 = self.latencies.iter().sum::<f64>() / self.latencies.len() as f64;
            let variance: f64 = self
                .latencies
                .iter()
                .map(|l| (l - avg).powi(2))
                .sum::<f64>()
                / self.latencies.len() as f64;
            let sd = variance.sqrt();
            (100.0 - (sd / 10.0)).max(0.0).min(100.0)
        } else {
            100.0
        };

        TypingStats {
            wpm: wpm.round(),
            accuracy: accuracy.round(),
            consistency: consistency.round(),
            elapsed_time: elapsed,
            correct_chars: correct,
            total_chars: user_chars.len(),
            error_count: self.error_indices.len(),
            finger_latency: self.latencies.clone(),
        }
    }
}
