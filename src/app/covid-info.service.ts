import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CovidInfoService {
  constructor(private http: HttpClient) {}

  getCovidProvincialInfo(date: string[]) {
    return this.http.get(
      `https://api.opencovid.ca/summary?${this.getLocationQueryString(date)}`
    );
  }

  getCovidFederalInfo(date: string[]) {
    return this.http.get(
      `https://api.opencovid.ca/summary?loc=canada&${this.getLocationQueryString(
        date
      )}`
    );
  }

  getCovidRegionalInfo(date: string[]) {
    return this.http.get(
      `https://api.opencovid.ca/summary?loc=hr&${this.getLocationQueryString(
        date
      )}`
    );
  }

  // Array of dates
  // 1 date -> 1 day
  // 2 dates -> range data
  private getLocationQueryString(date: string[]): string {
    if (date.length === 1) {
      return `date=${date[0]}`;
    } else {
      const afterDateString = new Date(date[0]).toISOString().split('T')[0];
      const beforeDateString = new Date(date[1]).toISOString().split('T')[0];
      return `before=${beforeDateString}&after=${afterDateString}`;
    }
  }
}
