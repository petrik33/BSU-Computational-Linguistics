// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    collections::HashMap,
    error::Error,
    fs::{self, File},
    io::{BufReader, BufWriter},
    sync::Mutex,
};

use serde::Serialize;
use tauri::State;

struct Dictionary {
    mtx: Mutex<HashMap<String, u32>>,
    path: String,
}

#[tauri::command]
fn update_state(path: String, dictionary: State<Dictionary>) -> Result<(), String> {
    let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    let mut freq_map = dictionary.mtx.lock().unwrap();
    for word in content.split_whitespace() {
        *freq_map.entry(word.to_lowercase()).or_insert(0) += 1;
    }
    save_dictionary(&freq_map, &dictionary.path).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn save_state(dictionary : State<Dictionary>) -> Result<(), String> {
    let freq_map = dictionary.mtx.lock().unwrap();
    save_dictionary(&freq_map, &dictionary.path).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn load_state(dictionary : State<Dictionary>) -> Result<(), String> {
    let mut freq_map = load_dictionary(&dictionary.path).map_err(|e| e.to_string())?;
    let mut dict = dictionary.mtx.lock().unwrap();
    *dict = freq_map;
    Ok(())
}

#[tauri::command]
fn remove_word(word: String, dictionary: State<Dictionary>) -> Result<(), String> {
    let mut freq_map = dictionary.mtx.lock().unwrap();
    let count = match freq_map.get(&word.to_lowercase()) {
        Some(count) => *count,
        None => return Err(format!("Word '{}' not found in dictionary", word)),
    };
    // let confirm = tauri::dialog::ask("Delete word?", &format!("Are you sure you want to delete the word '{}' from the dictionary? It appears {} times in the text.", word, count));
    // if let Ok(true) = confirm {
    //     freq_map.remove(&word.to_lowercase());
    //     save_dictionary(&freq_map, &dictionary.path).map_err(|e| e.to_string())?;
    // }
    freq_map.remove(&word.to_lowercase());
    save_dictionary(&freq_map, &dictionary.path).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn add_word(word: String, dictionary: State<Dictionary>) -> Result<(), String> {
    let mut freq_map = dictionary.mtx.lock().unwrap();
    if freq_map.contains_key(&word.to_lowercase()) {
        return Err(format!("Word '{}' already exists in dictionary", word));
    }
    freq_map.insert(word.to_lowercase(), 0);
    save_dictionary(&freq_map, &dictionary.path).map_err(|e| e.to_string())?;
    Ok(())
}

fn main() {
    let file_path = "./dictionary.json";
    let mut freq_map = match load_dictionary(file_path) {
        Ok(d) => d,
        Err(_) => HashMap::new(), // Fall back to an empty dictionary if there was an error
    };

    tauri::Builder::default()
        .manage(Dictionary {
            mtx: Mutex::from(freq_map),
            path: String::from(file_path),
        })
        .invoke_handler(tauri::generate_handler![
            update_state,
            save_state,
            load_state,
            add_word,
            remove_word
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
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
