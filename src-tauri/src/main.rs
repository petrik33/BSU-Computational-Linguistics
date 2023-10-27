// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{collections::HashMap, ops::AddAssign, sync::Mutex, hash::Hash};

use serde::Serialize;

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

#[derive(Serialize)]
struct ZipfLawData {
    dataset: Vec<(u32, f64)>,
}

#[derive(Serialize)]
struct ZipfLaw2Data {
    dataset: Vec<(u32, u32)>,
}

#[tauri::command]
async fn calculate_frequency(frequency_dict: HashMap<String, u32>) -> Result<ZipfLawData, String> {
    let mut dataset: Vec<(u32, f64)> = Vec::new();
    let (total, mut frequency_vec) : (u32, Vec<u32>) = frequency_dict
        .into_iter()
        .fold((0, Vec::new()), |(sum, mut frequency_vec), num| {
            frequency_vec.push(num.1);
            (sum + num.1, frequency_vec)
        });

    frequency_vec.sort_by(|a, b| b.cmp(a));

    // Calculate Zipf's Law coefficients
    for (rank, frequency) in frequency_vec.iter().enumerate() {
        let f = *frequency as f64 / total as f64;
        let r = (rank + 1) as u32; // Adding 1 because ranks start from 1
        dataset.push((r, f));
    }

    Ok(ZipfLawData { dataset })
}

#[tauri::command]
async fn calculate_zipf_law(frequency_dict: HashMap<String, u32>) -> Result<ZipfLawData, String> {
    let mut dataset: Vec<(u32, f64)> = Vec::new();
    let (total, mut frequency_vec) : (u32, Vec<u32>) = frequency_dict
        .into_iter()
        .fold((0, Vec::new()), |(sum, mut frequency_vec), num| {
            frequency_vec.push(num.1);
            (sum + num.1, frequency_vec)
        });

    frequency_vec.sort_by(|a, b| b.cmp(a));

    // Calculate Zipf's Law coefficients
    for (rank, frequency) in frequency_vec.iter().enumerate() {
        let f = *frequency as f64 / total as f64;
        let r = (rank + 1) as u32; // Adding 1 because ranks start from 1
        dataset.push((r, f * r as f64));
    }

    Ok(ZipfLawData { dataset })
}

#[tauri::command]
async fn calculate_zipf_law2(frequency_dict: HashMap<String, u32>) -> Result<Vec<(u32, u32)>, String> {
    let mut frequency_map: HashMap<u32, u32> = HashMap::new();

    for (_, &frequency) in frequency_dict.iter() {
        *frequency_map.entry(frequency).or_insert(0) += 1;
    }

    let mut frequency_vec : Vec<(u32, u32)> = frequency_map
        .into_iter()
        .collect();

    frequency_vec.sort_by(|a, b| a.0.cmp(&b.0));

    Ok(frequency_vec)
}

#[tauri::command]
async fn calculate_zipf_emperic_law(frequency_dict: HashMap<String, u32>) -> Result<Vec<(u32, u32)>, String> {
    let mut frequency_vec : Vec<(u32, u32)> = frequency_dict
        .into_iter()
        .map(|(word, frequency)| (frequency, word.len() as u32))
        .collect();

    frequency_vec.sort_by(|a, b| a.0.cmp(&b.0));

    Ok(frequency_vec)
}


fn main() {
    tauri::Builder::default()
        .manage(ProgressState(Mutex::from(HashMap::new())))
        .invoke_handler(tauri::generate_handler![
            make_dictionary,
            get_progress,
            calculate_frequency,
            calculate_zipf_law,
            calculate_zipf_law2,
            calculate_zipf_emperic_law
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
