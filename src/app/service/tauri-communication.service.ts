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

export enum Language {
  ENG = "english",
  RU = "russian",
  POR = "portuguesse"
}

@Injectable({
  providedIn: 'root'
})
export class TauriCommunicationService {

  private frequencyMapSubject: BehaviorSubject<Dictionary> = new BehaviorSubject<Dictionary>({});
  private taskInProgressSubject = new BehaviorSubject<boolean>(false);
  private currentLanguage : Language = Language.ENG

  constructor() {}

  async addText(text : string) {
    this.taskInProgressSubject.next(true);
    let dict = await invoke<Record<string, number>>('make_dictionary', { text })
    for (let key in dict) {
      this.addWord(key, dict[key], false);
    }
    this.frequencyMapSubject.next(this.frequencyMap);
    this.taskInProgressSubject.next(false);
  }

  async getCommandProgress(command : string) {
    return await invoke<number>('get_progress', { command });
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

  addWord(word : string, count : number, update : boolean) {
    const frequencyMap = this.frequencyMap;
    if (frequencyMap[word]) {
      frequencyMap[word] += count;
    } else {
      frequencyMap[word] = count;
    }
    if (update) {
      this.frequencyMapSubject.next(frequencyMap);
    }
  }

  clearDictionary() {
    this.frequencyMapSubject.next({});
  }

  get frequencyMap$(): Observable<Dictionary> {
    return this.frequencyMapSubject.asObservable();
  }

  get taskInProgress$(): Observable<boolean> {
    return this.taskInProgressSubject.asObservable();
  }

  private get frequencyMap(): Dictionary {
    return this.frequencyMapSubject.getValue();
  }
}
