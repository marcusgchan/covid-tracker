import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StatsChecked } from '../stats-checked.type';
@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css'],
})
export class FiltersComponent implements OnInit {
  @Input() statsChecked: StatsChecked = {
    cases: true,
    cumulativeCases: false,
    deaths: true,
    cumulativeDeaths: false,
    recovered: true,
    cumulativeRecovered: false,
  };
  @Output() statsCheckedEvent = new EventEmitter();

  constructor() {}

  onStatsChanged(e: Event) {
    if (e.target) {
      const name = (<HTMLInputElement>e.target).name;
      const value = (<HTMLInputElement>e.target).checked;
      this.statsChecked[name] = value;

      // Create a new obj to have a different reference to trigger ngOnChanges
      this.statsCheckedEvent.emit({ ...this.statsChecked });
    }
  }

  ngOnInit(): void {}
}
