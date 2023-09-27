// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{collections::HashMap, fs::{self, File}, io::{BufReader, BufWriter}, error::Error};

use serde::Serialize;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn count_words(path: String) -> Result<HashMap<String, u32>, String> {
    let content = fs::read_to_string(path).map_err(|e| e.to_string())?;
    let mut count = HashMap::new();
    for word in content.split_whitespace() {
        *count.entry(word.to_lowercase()).or_insert(0) += 1;
    }
    Ok(count)
}

fn save_dictionary(dict: &HashMap<String, u32>, path: &str) -> Result<(), Box<dyn Error>> {
    let file = File::create(path)?;
    let writer = BufWriter::new(file);
    let mut serializer = serde_json::Serializer::new(writer);
    dict.serialize(&mut serializer)?;
    Ok(())
}

fn load_dictionary(path: &str) -> Result<HashMap<String, u32>, Box<dyn Error>> {
    let file = File::open(path)?;
    let reader = BufReader::new(file);
    let dict = serde_json::from_reader(reader)?;
    Ok(dict)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
