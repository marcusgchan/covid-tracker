import { Component, OnInit } from '@angular/core';
import DEFAULT_LOCATION_CHECKED from './config/default-locations-checked';
import DEFAULT_STATS_CHECKED from './config/default-stats-checked';
import LocationsChecked from './locations-checked.type';
import { StatsChecked } from './stats-checked.type';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  statsChecked = DEFAULT_STATS_CHECKED;
  locationsChecked = DEFAULT_LOCATION_CHECKED;
  date = [new Date().toISOString().split('T')[0]];

  constructor() {}

  ngOnInit() {}

  updateStatsChecked(newStatsChecked: StatsChecked) {
    this.statsChecked = newStatsChecked;
  }

  updateLocationsChecked(newLocationsChecked: LocationsChecked) {
    this.locationsChecked = newLocationsChecked;
  }

  updateDate(date: string[]) {
    this.date = date;
  }
}
