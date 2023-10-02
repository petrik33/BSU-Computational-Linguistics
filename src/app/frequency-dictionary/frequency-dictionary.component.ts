import { Component } from '@angular/core';
import { TauriCommunicationService, Dictionary, DictionaryEntry } from '../service/tauri-communication.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-frequency-dictionary',
  templateUrl: './frequency-dictionary.component.html',
  styleUrls: ['./frequency-dictionary.component.css']
})
export class FrequencyDictionaryComponent {

  frequencyDictionary$: Observable<Dictionary>;
  sortedDictionary : DictionaryEntry[] = []

  constructor(private service: TauriCommunicationService) {
    this.frequencyDictionary$ = this.service.frequencyMap$
    this.frequencyDictionary$.subscribe(
      (dictionary) => {
        this.sortedDictionary = Object.keys(dictionary).map(
          (word) => {
            return {
              frequency: dictionary[word],
              word
            }
          }
        ).sort((entryA, entryB) => entryA.frequency - entryB.frequency)
      }
    )
  }

}
