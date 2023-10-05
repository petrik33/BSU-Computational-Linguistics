import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DictionaryEntry, TauriCommunicationService } from '../service/tauri-communication.service';
import { MatInput } from '@angular/material/input';

export interface EditWordData {
  entry : DictionaryEntry
}

@Component({
  selector: 'app-edit-word',
  templateUrl: './edit-word.component.html',
  styleUrls: ['./edit-word.component.css']
})
export class EditWordComponent {
  constructor(
    private service : TauriCommunicationService,
    public dialogRef: MatDialogRef<EditWordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditWordData,
  ) {}

  @ViewChild(MatInput) wordInput!: MatInput;

  isBeingEdited : boolean = false;

  removeWordFromDictionary() {
    this.service.removeWord(this.data.entry.word);
    this.dialogRef.close();
  }

  startEditting() {
    this.isBeingEdited = true;
  }

  async finishEditting() {
    this.isBeingEdited = false;
    if (await this.service.editWord(this.data.entry.word, this.wordInput.value.toLowerCase())) {
      this.data.entry.word = this.wordInput.value.toLowerCase();
    }

    this.dialogRef.close();
  }

}
