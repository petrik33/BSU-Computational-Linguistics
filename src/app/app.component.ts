import { Component } from "@angular/core";
import { invoke } from "@tauri-apps/api/tauri";
import { MatDialog } from "@angular/material/dialog";
import { PlotViewComponent } from "./plot-view/plot-view.component";
import { TauriCommunicationService } from "./service/tauri-communication.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  greetingMessage = "";

  constructor (private service : TauriCommunicationService, private dialog : MatDialog) {}

  greet(event: SubmitEvent, name: string): void {
    event.preventDefault();

    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    invoke<string>("greet", { name }).then((text) => {
      this.greetingMessage = text;
    });
  }

  openPlotDialog() {
      const dialogRef = this.dialog.open(PlotViewComponent, {
        width: '960px',
        height: '540px',
      });
  }
}
