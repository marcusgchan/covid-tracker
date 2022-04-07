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
    if (
      changes['locationsChecked'] &&
      !changes['locationsChecked']['firstChange']
    ) {
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
      const data: Object[] = [];

      if (this.date.length === 1) {
        const federal = observable.federal;
        if (this.locationsChecked.federal && federal.length > 0) {
          data.push(...federal[0].summary);
        }

        const provincial = observable.provincial;
        if (this.locationsChecked.provincial && provincial.length > 0) {
          data.push(...provincial[0].summary);
        }

        const regional = observable.regional;
        if (this.locationsChecked.regional && regional.length > 0) {
          data.push(...regional[0].summary);
        }

        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      } else {
      }
    });
  }
}
