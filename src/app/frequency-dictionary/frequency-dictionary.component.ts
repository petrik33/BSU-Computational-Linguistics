import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { TauriCommunicationService, Dictionary, DictionaryEntry } from '../service/tauri-communication.service';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EditWordComponent } from './dialogs/edit-word/edit-word.component';
import { MatDialog } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-frequency-dictionary',
  templateUrl: './frequency-dictionary.component.html',
  styleUrls: ['./frequency-dictionary.component.css']
})
export class FrequencyDictionaryComponent implements AfterViewInit {

  frequencyDictionary$: Observable<Dictionary>;

  tableData = new MatTableDataSource<DictionaryEntry>();
  columnsToDisplay = ['word', 'frequency'];

  actionWord : string = "";

  constructor(private service: TauriCommunicationService, private dialog : MatDialog) {
    this.frequencyDictionary$ = this.service.frequencyMap$
    this.frequencyDictionary$.subscribe(
      (dictionary) => {
        this.tableData.data = Object.keys(dictionary).map(
          (word) => {
            return {
              frequency: dictionary[word],
              word
            }
          }
        );
      }
    )
  }

  @ViewChild(MatPaginator) tablePaginator!: MatPaginator;
  @ViewChild(MatSort) tableSort!: MatSort;
  @ViewChild(MatInput) actionWordInput!: MatInput;

  ngAfterViewInit() {
    this.tableData.paginator = this.tablePaginator;
    this.tableData.sort = this.tableSort;
    this.service.loadData();
  }

  onActionWordChange(event : Event) {
    const inputElement = event.target as HTMLInputElement;
    this.actionWord = inputElement.value.toLowerCase();
  }

  filterDictionary() {
    this.tableData.filter = this.actionWord
  }

  addWordToDictionary() {
    this.service.addWord(this.actionWord, 0, true);
    this.actionWordInput.value = ""
  }

  editWord() {
    const frequency = this.service.getFrequency(this.actionWord);
    const removed = this.actionWord

    const dialogRef = this.dialog.open(EditWordComponent, {
      data: {word : removed},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.service.addWord(result, frequency, true);
      this.service.removeWord(removed);
    });

    this.actionWordInput.value = ""
  }

  removeWordFromDictionary() {
    this.service.removeWord(this.actionWord);
    this.actionWordInput.value = ""
  }

  saveDictionary() {
    this.service.saveData();
  }

  clearData() {
    this.service.clearDictionary();
  }

}
