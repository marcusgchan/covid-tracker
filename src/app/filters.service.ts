import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Filters } from './filters.interface';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  private BASE_URL =
    'https://218.selfip.net/apps/pkQqUtqBmA/collections/filters/documents/';
  selectedFilter: Filters = {} as Filters;

  constructor(private http: HttpClient) {}

  getFilters(): Observable<any> {
    return this.http.get(this.BASE_URL);
  }

  addFilter(filter: Filters): Observable<any> {
    return this.http.post(this.BASE_URL, filter);
  }

  removeFilter(key: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}${key}`);
  }
}
