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
import DEFAULT_STATS_CHECKED from '../config/default-stats-checked';
import CovidInfo from '../covid-info.model';
import { CovidInfoService } from '../covid-info.service';

@Component({
  selector: 'app-table-section',
  templateUrl: './table-section.component.html',
  styleUrls: ['./table-section.component.css'],
})
export class TableSectionComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<any>([]);
  // dataSource: any = [];

  @Input() statsChecked = DEFAULT_STATS_CHECKED;
  displayedColumns: string[] = [
    'province',
    'cases',
    'cumulative_cases',
    'deaths',
    'cumulative_deaths',
    'recovered',
    'cumulative_recovered',
  ];

  constructor(private covidInfo: CovidInfoService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.covidInfo.getCovidProvincialInfo().subscribe((observer: any) => {
      this.dataSource = new MatTableDataSource(observer.summary);
      this.dataSource.sort = this.sort;
    });
  }
}
