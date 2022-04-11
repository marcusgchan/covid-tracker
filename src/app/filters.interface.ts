import LocationsChecked from './locations-checked.type';
import StatsChecked from './stats-checked.type';

export interface Filters {
  key: string;
  data: Data;
}

interface Data {
  statsChecked: StatsChecked;
  locationsChecked: LocationsChecked;
  dateRange: string[];
}
