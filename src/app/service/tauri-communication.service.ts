import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/tauri';
import { BehaviorSubject, Observable, from, of } from 'rxjs'

export interface Dictionary {
  [key : string] : number
}

export interface DictionaryEntry {
  word : string,
  frequency : number
}

export const LANGUAGES = ['english', 'russian', 'portuguesse'] as const

export type Language = typeof LANGUAGES[number]

type ZipfLawData = {
  dataset: Array<[number, number]>,
  average: number
}

@Injectable({
  providedIn: 'root'
})
export class TauriCommunicationService {

  private frequencyMapSubject: BehaviorSubject<Dictionary> = new BehaviorSubject<Dictionary>({});
  private taskInProgressSubject = new BehaviorSubject<boolean>(false);
  private currentLanguage : Language = LANGUAGES[0]

  constructor() {}

  async addText(text : string) {
    this.taskInProgressSubject.next(true);
    let dict = await invoke<Record<string, number>>('make_dictionary', { text })
    for (let key in dict) {
      this.addWord(key, dict[key], false);
    }
    this.removeWord('constructor');
    this.frequencyMapSubject.next(this.frequencyMap);
    this.taskInProgressSubject.next(false);
  }

  async calculateWordFrequency() {
    try {
      const data = await invoke<ZipfLawData>('calculate_frequency', {
        frequencyDict: this.frequencyMap
      });
      return data.dataset;
    } catch (error) {
      console.error(error);
      throw new Error('Error calculating frequency.');
    }
  }

  async calculateZipfLaw() {
    try {
      const data = await invoke<ZipfLawData>('calculate_zipf_law', {
        frequencyDict: this.frequencyMap
      });
      return data.dataset;
    } catch (error) {
      console.error(error);
      throw new Error('Error calculating Zipf\'s Law coefficients.');
    }
  }

  async calculateZipfLaw2() {
    try {
      return await invoke<[number, number][]>('calculate_zipf_law2', {
        frequencyDict: this.frequencyMap
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error calculating Zipf\'s Law coefficients.');
    }
  }

  async calculateZipfEmpericLaw() {
    try {
      return await invoke<[number, number][]>('calculate_zipf_emperic_law', {
        frequencyDict: this.frequencyMap
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error calculating Zipf\'s Law coefficients.');
    }
  }

  async getCommandProgress(command : string) {
    return await invoke<number>('get_progress', { command });
  }

  changeLanguage(language : Language) {
    this.saveData();
    this.currentLanguage = language
    this.loadData();
  }

  saveData() {
    localStorage.setItem(this.currentLanguage as string, JSON.stringify(this.frequencyMap));
  }

  loadData() {
    const data = localStorage.getItem(this.currentLanguage as string);
    if (!data) {
      return
    }
    this.frequencyMapSubject.next(JSON.parse(data));
  }

  removeWord(word : string) {
    const frequencyMap = this.frequencyMap;
    if (frequencyMap[word]) {
      delete frequencyMap[word];
      this.frequencyMapSubject.next(frequencyMap);
    }
  }

  async addWord(word : string, count : number, update : boolean) {
    const frequencyMap = this.frequencyMap;
    if (frequencyMap[word]) {
      frequencyMap[word] += count;
    } else {
      frequencyMap[word] = count;
    }
    if (update) {
      this.frequencyMapSubject.next(frequencyMap);
    }
    return true;
  }

  async editWord(previous : string, edited : string) {
    return true;
  }

  getFrequency(word : string) {
    return this.frequencyMap[word] ? this.frequencyMap[word] : 0
  }

  clearDictionary() {
    this.frequencyMapSubject.next({});
  }

  get frequencyMap(): Dictionary {
    return this.frequencyMapSubject.getValue();
  }

  get frequencyMap$(): Observable<Dictionary> {
    return this.frequencyMapSubject.asObservable();
  }

  get taskInProgress$(): Observable<boolean> {
    return this.taskInProgressSubject.asObservable();
  }
}
