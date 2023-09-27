import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { FrequencyDictionaryComponent } from './frequency-dictionary/frequency-dictionary.component';
import { AddNewTextComponent } from './add-new-text/add-new-text.component';

@NgModule({
  declarations: [AppComponent, FrequencyDictionaryComponent, AddNewTextComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
