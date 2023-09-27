import { Component } from '@angular/core';
import { TauriCommunicationService } from '../service/tauri-communication.service';

@Component({
  selector: 'app-add-new-text',
  templateUrl: './add-new-text.component.html',
  styleUrls: ['./add-new-text.component.css']
})
export class AddNewTextComponent {

  constructor(private tauriService: TauriCommunicationService) { }

  async uploadFile(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement?.files?.[0];
  
    if (file) {
      let text = await file.text()
      this.tauriService.addText(text)
        .then(() => console.log('File uploaded successfully'))
        .catch((reason) => console.log(`Error while uploading file: ${reason}`))
    }
  }  
}
