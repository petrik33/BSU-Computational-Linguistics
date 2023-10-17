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

#[tauri::command]
async fn calculate_zipf_law(frequency_dict: HashMap<String, u32>) -> Result<Vec<(u32, f64)>, String> {
    let mut dataset: Vec<(u32, f64)> = Vec::new();
    let mut freqeuncy_vec = frequency_dict
        .into_iter()
        .collect::<Vec<_>>();

    freqeuncy_vec.sort_by(|a, b| a.0.cmp(&b.0));

    let sorted_frequency: Vec<u32> = freqeuncy_vec
        .into_iter()
        .map(|(_, v)| v)
        .collect();

    // Calculate Zipf's Law coefficients
    for (rank, frequency) in sorted_frequency.iter().enumerate() {
        let f = *frequency as f64;
        let r = (rank + 1) as u32; // Adding 1 because ranks start from 1

        let c = f * r as f64;
        dataset.push((r, c));
    }

    Ok(dataset)
}


fn main() {
    tauri::Builder::default()
        .manage(ProgressState(Mutex::from(HashMap::new())))
        .invoke_handler(tauri::generate_handler![
            make_dictionary,
            get_progress,
            calculate_zipf_law
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
