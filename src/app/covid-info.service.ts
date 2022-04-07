import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CovidInfoService {
  constructor(private http: HttpClient) {}

  getCovidProvincialInfo(date: string[]) {
    return this.http.get('https://api.opencovid.ca/summary?date=01-09-2020');
  }

  getCovidFederalInfo(date: string[]) {
    return this.http.get(
      'https://api.opencovid.ca/summary?loc=canada&date=01-09-2020'
    );
  }

  getCovidRegionalInfo(date: string[]) {
    return this.http.get(
      'https://api.opencovid.ca/summary?loc=hr&date=01-09-2020'
    );
  }

  private getLocationQueryString(date: string[]): string {
    return '';
  }
}
