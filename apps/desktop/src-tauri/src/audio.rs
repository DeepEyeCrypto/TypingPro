use rodio::{Decoder, OutputStream, Sink, Source};
use std::collections::HashMap;
use std::fs::File;
use std::io::BufReader;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use std::thread;
use tauri::{AppHandle, Manager};

pub enum AudioCommand {
    Play(String),
    SetVolume(f32),
}

#[derive(Clone)]
pub struct AudioManager {
    sender: std::sync::mpsc::Sender<AudioCommand>,
}

impl AudioManager {
    pub fn new(app_handle: AppHandle) -> Self {
        let (sender, receiver) = std::sync::mpsc::channel();

        // Spawn a dedicated thread for audio to handle non-Send rodio types
        thread::spawn(move || {
            let (_stream, stream_handle) =
                OutputStream::try_default().expect("Failed to get output stream");
            let sink = Sink::try_new(&stream_handle).expect("Failed to create sink");

            // Preload sounds into memory for low latency
            let mut sound_cache: HashMap<String, Vec<u8>> = HashMap::new();

            // Resolve resources directory
            let resource_path = app_handle
                .path()
                .resource_dir()
                .unwrap_or_else(|_| PathBuf::from("."))
                .join("assets")
                .join("sounds");

            println!(
                "Audio Manager Initialized. Looking for sounds at: {:?}",
                resource_path
            );

            // List of known sound files to preload and their cache keys
            let sound_mappings = vec![
                ("mechanical", "mechanical.wav"),
                ("backspace", "backspace.wav"),
                ("error", "error.wav"),
                ("click", "click.wav"),
                ("success", "success.wav"),
            ];

            for (key, filename) in sound_mappings {
                let path = resource_path.join(filename);
                if path.exists() {
                    if let Ok(bytes) = std::fs::read(&path) {
                        sound_cache.insert(key.to_string(), bytes);
                    }
                } else {
                    println!("Warning: Sound file not found: {:?}", path);
                }
            }

            while let Ok(command) = receiver.recv() {
                match command {
                    AudioCommand::Play(name) => {
                        if let Some(data) = sound_cache.get(&name) {
                            let cursor = std::io::Cursor::new(data.clone());
                            if let Ok(source) = Decoder::new(cursor) {
                                sink.append(source);
                            }
                        }
                    }
                    AudioCommand::SetVolume(vol) => {
                        sink.set_volume(vol);
                    }
                }
            }
        });

        AudioManager { sender }
    }

    pub fn play(&self, name: String) {
        let _ = self.sender.send(AudioCommand::Play(name));
    }

    pub fn set_volume(&self, volume: f32) {
        let _ = self.sender.send(AudioCommand::SetVolume(volume));
    }
}
