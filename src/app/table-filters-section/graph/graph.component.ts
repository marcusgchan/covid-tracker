import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { filter, map } from 'rxjs';
import DEFAULT_LOCATION_CHECKED from 'src/app/config/default-locations-checked';
import { CovidInfoService } from 'src/app/covid-info.service';
import { GraphDataModel } from './graph-data-model';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
})
export class GraphComponent implements OnInit, OnChanges {
  @Input() date = [new Date().toISOString().split('T')[0]];
  locationChecked = { federal: false, provincial: true, regional: false };
  data: GraphDataModel[] = [];

  // Options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  xAxisLabel: string = 'Province';
  showLegend: boolean = true;
  legendPosition = LegendPosition.Below;
  showXAxisLabel: boolean = true;

  constructor(private covidInfoServices: CovidInfoService) {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.covidInfoServices
      .fetchAndFilter(this.locationChecked, this.date)
      .pipe(
        map((data) => {
          return data.map(
            ({
              cases,
              deaths,
              province,
            }: {
              cases: number;
              deaths: number;
              province: string;
            }) => ({
              name: province,
              series: [
                { name: 'Cases', value: cases },
                { name: 'Deaths', value: deaths },
              ],
            })
          );
        })
      )
      .subscribe((data: any) => {
        return (this.data = data);
      });
  }
}
