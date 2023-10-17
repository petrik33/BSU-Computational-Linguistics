import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Chart, ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js';
import { TauriCommunicationService } from '../service/tauri-communication.service';

@Component({
  selector: 'app-plot-view',
  templateUrl: './plot-view.component.html',
  styleUrls: ['./plot-view.component.css']
})
export class PlotViewComponent {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef;

  loading: boolean = false;
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    datasets: [
      {
        data: [],
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true
  };
  public lineChartLegend = false;

  constructor(
    public dialogRef: MatDialogRef<PlotViewComponent>,
    private tauriService: TauriCommunicationService // Inject the service here
  ) {}

  async plotData(): Promise<void> {
    try {
      this.loading = true;
      const plotData = await this.tauriService.calculateZipfLaw();

      const labels = plotData.map(item => item[0].toString());
      const values = plotData.map(item => item[1]);

      this.lineChartData = {
        labels: labels,
        datasets: [
          {
            data: values,
            label: 'Zipf Law Data',
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Customize the colors if needed
            borderColor: 'rgba(75, 192, 192, 1)', // Customize the colors if needed
            borderWidth: 1,
            pointStyle: false,
            fill: false
          }
        ]
      };
      this.lineChartLegend = true;
    } catch (error) {
      console.error('Error plotting data:', error);
    } finally {
      this.loading = false;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
