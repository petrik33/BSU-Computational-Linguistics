import { Component } from '@angular/core';
import { TauriCommunicationService, Dictionary } from '../service/tauri-communication.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-frequency-dictionary',
  templateUrl: './frequency-dictionary.component.html',
  styleUrls: ['./frequency-dictionary.component.css']
})
export class FrequencyDictionaryComponent {

  frequencyDictionary$: Observable<Dictionary>;

  constructor(private service: TauriCommunicationService) {
    this.frequencyDictionary$ = this.service.frequencyMap$
  }

}
