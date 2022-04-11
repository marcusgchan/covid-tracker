import { Component, OnInit } from '@angular/core';
import { Filters } from '../filters.interface';
import { FiltersService } from '../filters.service';

@Component({
  selector: 'app-saved-filters',
  templateUrl: './saved-filters.component.html',
  styleUrls: ['./saved-filters.component.css'],
})
export class SavedFiltersComponent implements OnInit {
  filters: Filters[] = [];

  constructor(private filterService: FiltersService) {}

  ngOnInit(): void {
    this.filterService.getFilters().subscribe((filters) => {
      this.filters = filters;
    });
  }

  onFilterLoad(filter: Filters) {
    this.filterService.selectedFilter = filter;
  }

  onDeleteFilter(id: string) {
    this.filterService.removeFilter(id).subscribe((filters) => {
      this.filters = this.filters.filter(({ key }) => key !== id);
      console.log(filters);
    });
  }
}
