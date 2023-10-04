import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { TauriCommunicationService, Dictionary, DictionaryEntry } from '../service/tauri-communication.service';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

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

  constructor(private service: TauriCommunicationService) {
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

  ngAfterViewInit() {
    this.tableData.paginator = this.tablePaginator;
    this.tableData.sort = this.tableSort;
    this.service.loadData();
  }

  onActionWordChange(event : Event) {
    const inputElement = event.target as HTMLInputElement;
    this.actionWord = inputElement.value;
  }

  filterDictionary() {
    this.tableData.filter = this.actionWord
  }

  addWordToDictionary() {
    this.service.addWord(this.actionWord, 0, true);
  }

  removeWordFromDictionary() {
    this.service.removeWord(this.actionWord);
  }

  saveDictionary() {
    this.service.saveData();
  }

  clearData() {
    this.service.clearDictionary();
  }

}
