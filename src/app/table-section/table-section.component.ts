import {
  AfterViewInit,
  Component,
  DoCheck,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import DEFAULT_LOCATION_CHECKED from '../config/default-locations-checked';
import DEFAULT_STATS_CHECKED from '../config/default-stats-checked';
import CovidInfo from '../covid-info.model';
import { CovidInfoService } from '../covid-info.service';
import { forkJoin, of, zip } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-table-section',
  templateUrl: './table-section.component.html',
  styleUrls: ['./table-section.component.css'],
})
export class TableSectionComponent implements OnInit, OnChanges {
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<any>([]);

  @Input() date: string[] = [new Date().toISOString().split('T')[0]];

  displayedColumns: string[] = [
    'province',
    'health_region',
    'cases',
    'cumulative_cases',
    'deaths',
    'cumulative_deaths',
    'recovered',
    'cumulative_recovered',
  ];

  @Input() statsChecked = DEFAULT_STATS_CHECKED;
  @Input() locationsChecked = DEFAULT_LOCATION_CHECKED;

  constructor(private covidInfo: CovidInfoService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const locationChanged =
      changes['locationsChecked'] &&
      !changes['locationsChecked']['firstChange'];
    const dateChanged = changes['date'] && !changes['date']['firstChange'];
    if (locationChanged || dateChanged) {
      this.fetchAndUpdateTable();
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.fetchAndUpdateTable();
  }

  private fetchAndUpdateTable() {
    forkJoin({
      federal: this.locationsChecked.federal
        ? zip(this.covidInfo.getCovidFederalInfo(this.date))
        : zip(of([])),
      provincial: this.locationsChecked.provincial
        ? zip(this.covidInfo.getCovidProvincialInfo(this.date))
        : zip(of([])),
      regional: this.locationsChecked.regional
        ? zip(this.covidInfo.getCovidRegionalInfo(this.date))
        : zip(of([])),
    }).subscribe((observable: any) => {
      const data: any[] = [];

      const federal = observable.federal;
      if (
        this.locationsChecked.federal &&
        federal[0].summary &&
        federal.length > 0
      ) {
        data.push(...federal[0].summary);
      }

      const provincial = observable.provincial;
      if (
        this.locationsChecked.provincial &&
        provincial[0].summary &&
        provincial.length > 0
      ) {
        data.push(...provincial[0].summary);
      }

      const regional = observable.regional;
      if (
        this.locationsChecked.regional &&
        regional[0].summary &&
        regional.length > 0
      ) {
        data.push(...regional[0].summary);
      }

      // Single date
      if (this.date.length === 1) {
        this.dataSource = new MatTableDataSource(data);
      }
      // Range data
      else if (this.date.length === 2) {
        const difference = this.dateRange(
          new Date(this.date[0]),
          new Date(this.date[1])
        );

        const dateRange = difference + 1;
        console.log(data);
        const rangeData: any[] = [];
        // Get initial cumulative data
        // Get the last cumulative data
        // Subtract cumulative to get # of new cases within the range
        // With the current API structure, the # of days to sum is equal to the date range
        // So we can sum the data in groups of the date range
        for (let i = 0; i < data.length; i += dateRange) {
          // Get stats for cases
          const initialCumulativeCases =
            data[i].cumulative_cases - data[i].cases;
          const lastCumulativeCases = data[i + dateRange - 1].cumulative_cases;
          const increaseInCumulativeCases =
            lastCumulativeCases - initialCumulativeCases;

          // Geet stats for deaths
          const initialCumulativeDeaths =
            data[i].cumulative_deaths - data[i].deaths;
          const lastCumulativeDeaths =
            data[i + dateRange - 1].cumulative_deaths;
          const increaseInCumulativeDeaths =
            lastCumulativeDeaths - initialCumulativeDeaths;

          // Get stats for recovered
          // NOTE: Health region does not have recovered data
          let initialCumulativeRecovered: number | undefined;
          let lastCumulativeRecovered: number | undefined;
          let increaseInCumulativeRecovered: number | undefined;

          if (!data[i].health_region) {
            initialCumulativeRecovered =
              data[i].cumulative_recovered - data[i].recovered;
            lastCumulativeRecovered =
              data[i + dateRange - 1].cumulative_recovered;

            if (lastCumulativeRecovered) {
              increaseInCumulativeRecovered =
                lastCumulativeRecovered - initialCumulativeRecovered;
            }
          }
          rangeData.push({
            province: data[i].province,
            health_region: data[i].health_region,
            cases: increaseInCumulativeCases,
            cumulative_cases: lastCumulativeCases,
            deaths: increaseInCumulativeDeaths,
            cumulative_deaths: lastCumulativeDeaths,
            recovered: increaseInCumulativeRecovered,
            cumulative_recovered: lastCumulativeRecovered,
          });
        }
        // console.log(rangeData);
        this.dataSource = new MatTableDataSource(rangeData);
      }

      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  // Article to find the number of days between two dates
  // https://www.delftstack.com/howto/javascript/javascript-subtract-dates/
  private dateRange(date1: Date, date2: Date): number {
    const date1utc = Date.UTC(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate()
    );
    const date2utc = Date.UTC(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate()
    );
    const day = 1000 * 60 * 60 * 24;
    return (date2utc - date1utc) / day;
  }
}
