import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from "./app.component";
import { FrequencyDictionaryComponent } from './frequency-dictionary/frequency-dictionary.component';
import { AddNewTextComponent } from './add-new-text/add-new-text.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from "@angular/material/sort";

@NgModule({
  declarations: [AppComponent, FrequencyDictionaryComponent, AddNewTextComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
