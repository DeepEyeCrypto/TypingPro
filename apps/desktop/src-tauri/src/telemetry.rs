use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Mutex;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct KeyTelemetry {
    pub key: String,
    pub latency_ms: u64,
    pub timestamp: u64,
    pub is_correct: bool,
}

#[derive(Debug, Serialize, Clone)]
pub struct AnalyticsSummary {
    pub average_latency: f64,
    pub accuracy: f64,
    pub heatmap: HashMap<String, f64>, // key -> mean latency
}

pub struct TelemetryManager {
    data: Mutex<Vec<KeyTelemetry>>,
}

impl TelemetryManager {
    pub fn new() -> Self {
        Self {
            data: Mutex::new(Vec::new()),
        }
    }

    pub fn record(&self, entry: KeyTelemetry) {
        let mut data = self.data.lock().unwrap();
        data.push(entry);
    }

    pub fn get_summary(&self) -> AnalyticsSummary {
        let data = self.data.lock().unwrap();
        if data.is_empty() {
            return AnalyticsSummary {
                average_latency: 0.0,
                accuracy: 0.0,
                heatmap: HashMap::new(),
            };
        }

        let total_latency: u64 = data.iter().map(|k| k.latency_ms).sum();
        let correct_count = data.iter().filter(|k| k.is_correct).count();

        let mut heatmap = HashMap::new();
        let mut key_counts = HashMap::new();

        for k in data.iter() {
            let entry = heatmap.entry(k.key.clone()).or_insert(0.0);
            *entry += k.latency_ms as f64;
            let count = key_counts.entry(k.key.clone()).or_insert(0);
            *count += 1;
        }

        for (key, total) in heatmap.iter_mut() {
            let count = key_counts.get(key).unwrap_or(&1);
            *total /= *count as f64;
        }

        AnalyticsSummary {
            average_latency: total_latency as f64 / data.len() as f64,
            accuracy: (correct_count as f64 / data.len() as f64) * 100.0,
            heatmap,
        }
    }

    pub fn reset(&self) {
        let mut data = self.data.lock().unwrap();
        data.clear();
    }
}
