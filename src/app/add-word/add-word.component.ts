import { Component, ViewChild } from '@angular/core';
import { TauriCommunicationService } from '../service/tauri-communication.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-add-word',
  templateUrl: './add-word.component.html',
  styleUrls: ['./add-word.component.css']
})
export class AddWordComponent {
  constructor(
    private service : TauriCommunicationService,
    public dialogRef: MatDialogRef<AddWordComponent>
  ) {}

  @ViewChild(MatInput) wordInput! : MatInput;

  onAcceptAdd() {
    this.service.addWord(this.wordInput.value, 0, true);
    this.dialogRef.close();
  }
}
