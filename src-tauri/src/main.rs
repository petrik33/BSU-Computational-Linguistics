// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{collections::HashMap, ops::AddAssign, sync::Mutex};

use charabia::{Tokenize};

struct ProgressState(Mutex<HashMap<String, f64>>);

#[tauri::command]
async fn get_progress(command: &str, state: tauri::State<'_, ProgressState>) -> Result<f64, String> {
    let progress_map = state.0.lock().unwrap();
    match progress_map.get(command) {
        Some(progress) => Ok(*progress),
        None => Err(String::from("No such command is active")),
    }
}

#[tauri::command]
async fn make_dictionary(
    text: &str,
) -> Result<HashMap<String, u32>, String> {
    let mut dictionary: HashMap<String, u32> = HashMap::new();
    let tokens = text.tokenize();

    for token in tokens {
        if !token.is_word() {
            continue;
        }

        if token.lemma().parse::<f64>().is_ok() {
            continue;
        }

        dictionary.entry(token.lemma().to_string()).or_insert(0).add_assign(1);
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
