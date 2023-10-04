import { Component, ViewChild } from '@angular/core';
import { TauriCommunicationService } from '../service/tauri-communication.service';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-add-new-text',
  templateUrl: './add-new-text.component.html',
  styleUrls: ['./add-new-text.component.css']
})
export class AddNewTextComponent {

  taskInProgress$ : Observable<boolean> = of(false);
  file : File | undefined;
  
  constructor(private tauriService: TauriCommunicationService) {
    this.taskInProgress$ = tauriService.taskInProgress$
  }

  @ViewChild(MatProgressBar) progressBar!: MatProgressBar;

  async uploadFile() {
    if (this.file) {
      let text = await this.file.text()
      this.tauriService.addText(text)
        .then(() => console.log('File uploaded successfully'))
        .catch((reason) => console.log(`Error while uploading file: ${reason}`))
      // this.trackProgress()
    }
  }

  onFileChanged(event : Event) {
    const inputElement = event.target as HTMLInputElement;
    this.file = inputElement?.files?.[0];
  }

  // async trackProgress() {
  //   let interval = setInterval(async () => {
  //     this.progressBar.value = await this.tauriService.getCommandProgress('make_dictionary') * 100;
  //     if (this.progressBar.value >= 100) {
  //       clearInterval(interval);
  //     }
  //   }, 100);
  // }
}
