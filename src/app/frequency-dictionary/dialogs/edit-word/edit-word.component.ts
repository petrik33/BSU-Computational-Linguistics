import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface EditWordData {
  word : string
}

@Component({
  selector: 'app-edit-word',
  templateUrl: './edit-word.component.html',
  styleUrls: ['./edit-word.component.css']
})
export class EditWordComponent {
  private edited : string = "";

  constructor(
    public dialogRef: MatDialogRef<EditWordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditWordData,
  ) {}

  onChange(event : Event) {
    const inputElement = event.target as HTMLInputElement;
    this.edited = inputElement.value
  }

}
