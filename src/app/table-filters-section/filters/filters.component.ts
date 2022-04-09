import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import StatsChecked from '../../stats-checked.type';
import DEFAULT_STATS_CHECKED from '../../config/default-stats-checked';
import DEFAULT_LOCATIONS_CHECKED from '../../config/default-locations-checked';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css'],
})
export class FiltersComponent implements OnInit {
  statsChecked: StatsChecked = DEFAULT_STATS_CHECKED;
  @Output() statsCheckedEvent = new EventEmitter();

  locationsChecked = DEFAULT_LOCATIONS_CHECKED;
  @Output() locationsCheckedEvent = new EventEmitter();

  minDate = new Date(2020, 0, 25);
  maxDate = new Date(new Date().setDate(new Date().getDate() - 1)); // Day before today

  // Variables for date selection
  isMultipleDaysChecked = false;
  rangeFormGroup = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  singleDayFormGroup = new FormGroup({
    day: new FormControl(),
  });
  @Output() dateEvent = new EventEmitter<string[]>();

  ngOnInit(): void {
    this.subscribeToDateUpdates();
  }

  onStatsChanged(e: MatCheckboxChange) {
    const [name, value] = this.useCheckbox(e);
    this.statsChecked[name] = value;

    // Create a new obj to have a different reference to trigger ngOnChanges
    this.statsCheckedEvent.emit({ ...this.statsChecked });
  }

  onLocationsChanged(e: MatCheckboxChange) {
    const [name, value] = this.useCheckbox(e);
    this.locationsChecked[name] = value;

    // Create a new obj to have a different reference lto trigger ngOnChanges
    this.locationsCheckedEvent.emit({ ...this.locationsChecked });
  }

  private useCheckbox(e: MatCheckboxChange): [string, boolean] {
    const name = e.source.name || '';
    const value = e.checked;
    return [name, value];
  }

  private subscribeToDateUpdates() {
    this.rangeFormGroup.valueChanges.subscribe(
      (value: { start: Date; end: Date }) => {
        const startDate = value.start;
        const endDate = value.end;

        // Validate start and end aren't null (invalid)
        if (startDate && endDate) {
          const startDayAsString = startDate.toISOString().split('T')[0];
          const endDateAsString = endDate.toISOString().split('T')[0];
          this.dateEvent.emit([startDayAsString, endDateAsString]);
        }
      }
    );

    this.singleDayFormGroup.valueChanges.subscribe((value: { day: Date }) => {
      const date = value.day;
      let dateAsString = '';

      // Parce date into yy-mm-dd format
      // and emit to app component
      if (date) {
        dateAsString = date.toISOString().split('T')[0];
        this.dateEvent.emit([dateAsString]);
      }
    });
  }
}
