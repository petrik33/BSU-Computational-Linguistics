// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{collections::HashMap, fs::read_to_string, ops::AddAssign};

use charabia::Tokenize;

#[tauri::command]
fn make_dictionary_from_file(path: &str) -> Result<HashMap<String, u32>, String> {
    read_to_string(path)
        .map(|text| make_dictionary(&text))
        .map_err(|info| info.to_string())
}

fn make_dictionary(text: &str) -> HashMap<String, u32> {
    let mut dictionary: HashMap<String, u32> = HashMap::new();
    let tokens = text.tokenize();
    for token in tokens {
        if !token.is_word() {
            continue;
        }

        let word = token.lemma().to_string();

        dictionary.entry(word).or_insert(0).add_assign(1);
    }
    dictionary
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![make_dictionary_from_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
