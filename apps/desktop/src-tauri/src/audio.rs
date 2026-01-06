use rodio::{Decoder, OutputStream, Sink, Source};
use std::collections::HashMap;
use std::io::Cursor;
use std::sync::{Arc, Mutex};

pub struct AudioManager {
    _stream: OutputStream,
    stream_handle: rodio::OutputStreamHandle,
    sound_buffers: HashMap<String, Vec<u8>>,
    volume: Arc<Mutex<f32>>,
    enabled: Arc<Mutex<bool>>,
}

impl AudioManager {
    pub fn new() -> Self {
        let (stream, stream_handle) = OutputStream::try_default().unwrap();

        // Pre-load sound files into memory
        let mut sound_buffers = HashMap::new();

        // Using minimal embedded placeholder WAV files
        // User can replace these with actual sound files later
        sound_buffers.insert("mechanical".to_string(), Self::generate_click_sound());
        sound_buffers.insert("backspace".to_string(), Self::generate_backspace_sound());
        sound_buffers.insert("error".to_string(), Self::generate_error_sound());

        AudioManager {
            _stream: stream,
            stream_handle,
            sound_buffers,
            volume: Arc::new(Mutex::new(0.5)),
            enabled: Arc::new(Mutex::new(true)),
        }
    }

    fn generate_click_sound() -> Vec<u8> {
        // Minimal WAV header + short click sound
        // 44.1kHz, 16-bit, mono, ~10ms duration
        include_bytes!("../sounds/click.wav").to_vec()
    }

    fn generate_backspace_sound() -> Vec<u8> {
        include_bytes!("../sounds/backspace.wav").to_vec()
    }

    fn generate_error_sound() -> Vec<u8> {
        include_bytes!("../sounds/error.wav").to_vec()
    }

    pub fn play(&self, sound_type: &str) {
        if !*self.enabled.lock().unwrap() {
            return;
        }

        if let Some(buffer) = self.sound_buffers.get(sound_type) {
            let cursor = Cursor::new(buffer.clone());
            if let Ok(source) = Decoder::new(cursor) {
                let sink = Sink::try_new(&self.stream_handle).unwrap();
                let volume = *self.volume.lock().unwrap();
                sink.set_volume(volume);
                sink.append(source);
                sink.detach(); // Play in background, allow overlapping sounds
            }
        }
    }

    pub fn set_volume(&self, volume: f32) {
        *self.volume.lock().unwrap() = volume.clamp(0.0, 1.0);
    }

    pub fn set_enabled(&self, enabled: bool) {
        *self.enabled.lock().unwrap() = enabled;
    }

    pub fn get_volume(&self) -> f32 {
        *self.volume.lock().unwrap()
    }

    pub fn is_enabled(&self) -> bool {
        *self.enabled.lock().unwrap()
    }
}
