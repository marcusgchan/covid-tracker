import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import DEFAULT_LOCATION_CHECKED from '../../config/default-locations-checked';
import DEFAULT_STATS_CHECKED from '../../config/default-stats-checked';
import { CovidInfoService } from '../../covid-info.service';
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
      this.getDataAndUpdateTable();
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.getDataAndUpdateTable();
  }

  private getDataAndUpdateTable() {
    this.covidInfo
      .fetchAndFilter(this.locationsChecked, this.date)
      .subscribe((observable: any) => {
        this.dataSource = new MatTableDataSource(observable);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }
}
