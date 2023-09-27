import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/tauri';
import { BehaviorSubject, Observable, from, of } from 'rxjs'

export interface Dictionary {
  [key : string] : number
}

@Injectable({
  providedIn: 'root'
})
export class TauriCommunicationService {

  private frequencyMapSubject: BehaviorSubject<Dictionary> = new BehaviorSubject<Dictionary>({});

  constructor() {}

  async addText(text : string) {
    let dict = await invoke<Record<string, number>>('make_dictionary', { text })
    for (let key in dict) {
      this.addWord(key, dict[key]);
    }
    this.frequencyMapSubject.next(this.frequencyMap);
  }

  removeWord(word : string) {
    const frequencyMap = this.frequencyMap;
    if (frequencyMap[word]) {
      delete frequencyMap[word];
      this.frequencyMapSubject.next(frequencyMap);
    }
  }

  addWord(word : string, count : number) {
    const frequencyMap = this.frequencyMap;
    if (frequencyMap[word]) {
      frequencyMap[word] += count;
    } else {
      frequencyMap[word] = count;
    }
    this.frequencyMapSubject.next(frequencyMap);
  }

  get frequencyMap$(): Observable<Dictionary> {
    return this.frequencyMapSubject.asObservable();
  }

  private get frequencyMap(): Dictionary {
    return this.frequencyMapSubject.getValue();
  }
}
