import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { TauriCommunicationService, Dictionary, DictionaryEntry } from '../service/tauri-communication.service';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EditWordComponent } from '../edit-word/edit-word.component';
import { MatDialog } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { AddWordComponent } from '../add-word/add-word.component';

@Component({
  selector: 'app-frequency-dictionary',
  templateUrl: './frequency-dictionary.component.html',
  styleUrls: ['./frequency-dictionary.component.css']
})
export class FrequencyDictionaryComponent implements AfterViewInit {

  frequencyDictionary$: Observable<Dictionary>;

  tableData = new MatTableDataSource<DictionaryEntry>();
  columnsToDisplay = ['word', 'frequency'];

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

  onFilterChange(event : Event) {
    const inputElement = event.target as HTMLInputElement;
    this.tableData.filter = inputElement.value.toLowerCase();
  }

  onAddNewWord() {
    this.dialog.open(AddWordComponent);
  }

  onWordClick(entry : DictionaryEntry) {
    this.dialog.open(EditWordComponent, {
      data: {entry : entry},
      minWidth: 480,
      minHeight: 270
    });
  }

  saveDictionary() {
    this.service.saveData();
  }

  clearData() {
    this.service.clearDictionary();
  }

}
