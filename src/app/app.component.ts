import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import DEFAULT_STATS_CHECKED from './config/default-stats-checked';
import { StatsChecked } from './stats-checked.type';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  rows = new MatTableDataSource<any>([]);
  statsChecked = DEFAULT_STATS_CHECKED;

  constructor() {}

  ngOnInit() {}

  updateStatsChecked(newStatsChecked: StatsChecked) {
    this.statsChecked = newStatsChecked;
  }
}
