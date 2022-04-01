import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CovidInfoService {
  constructor(private http: HttpClient) {}

  getCovidProvincialInfo() {
    return this.http.get('https://api.opencovid.ca/summary?date=01-09-2020');
  }

  getCovidFederalInfo() {
    return this.http.get(
      'https://api.opencovid.ca/summary?loc=canada&date=01-09-2020'
    );
  }

  getCovidRegionalInfo() {
    return this.http.get(
      'https://api.opencovid.ca/summary?loc=hrdate=01-09-2020'
    );
  }
}
