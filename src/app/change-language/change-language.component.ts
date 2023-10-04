import { Component } from '@angular/core';
import { LANGUAGES, Language, TauriCommunicationService } from '../service/tauri-communication.service';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-change-language',
  templateUrl: './change-language.component.html',
  styleUrls: ['./change-language.component.css']
})
export class ChangeLanguageComponent {
  available : Language[] = LANGUAGES.slice()

  constructor (private service : TauriCommunicationService) {}

  onValueChanged(event : MatRadioChange) {
    this.service.changeLanguage(event.value as Language)
  }
}
