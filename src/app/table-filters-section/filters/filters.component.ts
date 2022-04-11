import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import StatsChecked from '../../stats-checked.type';
import DEFAULT_STATS_CHECKED from '../../config/default-stats-checked';
import DEFAULT_LOCATIONS_CHECKED from '../../config/default-locations-checked';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FiltersService } from 'src/app/filters.service';

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

  constructor(private filtersService: FiltersService) {}

  ngOnInit(): void {
    this.subscribeToDateUpdates();
    const filter = this.filtersService.selectedFilter;

    // If filter has a key, then all properties should exist
    if (filter.key) {
      this.statsChecked = filter.data.statsChecked;
      this.locationsChecked = filter.data.locationsChecked;
      this.isMultipleDaysChecked = filter.data.dateRange.length > 1;
      if (this.isMultipleDaysChecked) {
        this.rangeFormGroup.setValue({
          start: new Date(filter.data.dateRange[0]),
          end: new Date(filter.data.dateRange[1]),
        });
      } else {
        this.singleDayFormGroup.setValue({
          day: new Date(filter.data.dateRange[0]),
        });
      }
    }
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

  onAddFilter() {
    if (this.isMultipleDaysChecked) {
      this.filtersService
        .addFilter({
          key: Date.now().toString(),
          data: {
            statsChecked: this.statsChecked,
            locationsChecked: this.locationsChecked,
            dateRange: [
              this.rangeFormGroup.value.start.toISOString().split('T')[0] || '',
              this.rangeFormGroup.value.end.toISOString().split('T')[0] || '',
            ],
          },
        })
        .subscribe((res) => console.log(res));
    } else {
      this.filtersService
        .addFilter({
          key: Date.now().toString(),
          data: {
            statsChecked: this.statsChecked,
            locationsChecked: this.locationsChecked,
            dateRange: [
              this.singleDayFormGroup.value.day.toISOString().split('T')[0] ||
                '',
            ],
          },
        })
        .subscribe((res) => console.log(res));
    }
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
