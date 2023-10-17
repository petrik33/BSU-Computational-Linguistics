// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{collections::HashMap, ops::AddAssign, sync::Mutex};

struct ProgressState(Mutex<HashMap<String, f64>>);

#[tauri::command]
async fn get_progress(command: &str, state: tauri::State<'_, ProgressState>) -> Result<f64, String> {
    let progress_map = state.0.lock().unwrap();
    match progress_map.get(command) {
        Some(progress) => Ok(*progress),
        None => Err(String::from("No such command is active")),
    }
}

fn is_word(token: &str) -> bool {
    token.chars().all(|c| c.is_alphabetic())
}

#[tauri::command]
async fn make_dictionary(
    text: &str,
) -> Result<HashMap<String, u32>, String> {
    let mut dictionary: HashMap<String, u32> = HashMap::new();

    let tokens = text.split_whitespace();

    for token in tokens {
        if !is_word(token) {
            continue;
        }

        if token.parse::<f64>().is_ok() {
            continue;
        }

        let lemma = token.to_lowercase();
        *dictionary.entry(lemma).or_insert(0) += 1;
    }

    Ok(dictionary)
}

fn main() {
    tauri::Builder::default()
        .manage(ProgressState(Mutex::from(HashMap::new())))
        .invoke_handler(tauri::generate_handler![make_dictionary, get_progress])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
