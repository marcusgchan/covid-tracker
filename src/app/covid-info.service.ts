import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CovidInfoService {
  constructor(private http: HttpClient) {}

  getCovidInfo() {
    return this.http.get('https://api.opencovid.ca/summary?date=01-09-2020');
  }
}
