import { Component } from '@angular/core';
import { Dictionary, TauriCommunicationService } from '../service/tauri-communication.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
  frequencyDictionary$: Observable<Dictionary>;
  total : number = 0;

  constructor (service : TauriCommunicationService) {
    this.frequencyDictionary$ = service.frequencyMap$
    this.frequencyDictionary$.subscribe(map => {
      this.total = 0
      for (let key in map) {
        this.total += map[key];
      }
    })
  }
}
