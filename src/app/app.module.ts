import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from "./app.component";
import { FrequencyDictionaryComponent } from './frequency-dictionary/frequency-dictionary.component';
import { AddNewTextComponent } from './add-new-text/add-new-text.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from "@angular/material/sort";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio'
import { ChangeLanguageComponent } from './change-language/change-language.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { EditWordComponent } from './edit-word/edit-word.component';
import { AddWordComponent } from './add-word/add-word.component';
import { MatButtonModule } from "@angular/material/button";
import { PlotViewComponent } from './plot-view/plot-view.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [AppComponent, FrequencyDictionaryComponent, AddNewTextComponent, ChangeLanguageComponent, StatisticsComponent, EditWordComponent, AddWordComponent, PlotViewComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSidenavModule,
    MatRadioModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
