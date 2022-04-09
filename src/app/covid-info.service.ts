import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, zip, of, Subscriber, Observable, map } from 'rxjs';
import LocationsChecked from './locations-checked.type';
@Injectable({
  providedIn: 'root',
})
export class CovidInfoService {
  constructor(private http: HttpClient) {}

  fetchAndFilter(
    locationsChecked: LocationsChecked,
    date: string[]
  ): Observable<any[]> {
    const fetchedData: any[] = [];
    let data: any[] = [];

    return forkJoin({
      federal: locationsChecked.federal
        ? zip(this.getCovidFederalInfo(date))
        : zip(of([])),
      provincial: locationsChecked.provincial
        ? zip(this.getCovidProvincialInfo(date))
        : zip(of([])),
      regional: locationsChecked.regional
        ? zip(this.getCovidRegionalInfo(date))
        : zip(of([])),
    }).pipe(
      map((observable: any) => {
        const federal = observable.federal;
        if (
          locationsChecked.federal &&
          federal[0].summary &&
          federal.length > 0
        ) {
          fetchedData.push(...federal[0].summary);
        }

        const provincial = observable.provincial;
        if (
          locationsChecked.provincial &&
          provincial[0].summary &&
          provincial.length > 0
        ) {
          fetchedData.push(...provincial[0].summary);
        }

        const regional = observable.regional;
        if (
          locationsChecked.regional &&
          regional[0].summary &&
          regional.length > 0
        ) {
          fetchedData.push(...regional[0].summary);
        }

        if (date.length === 1) {
          return fetchedData;
        } else {
          // Range data
          const difference = this.dateRange(
            new Date(date[0]),
            new Date(date[1])
          );

          const dateRange = difference + 1;
          // Get initial cumulative data
          // Get the last cumulative data
          // Subtract cumulative to get # of new cases within the range
          // With the current API structure, the # of days to sum is equal to the date range
          // So we can sum the data in groups of the date range
          for (let i = 0; i < fetchedData.length; i += dateRange) {
            // Get stats for cases
            const initialCumulativeCases =
              data[i].cumulative_cases - data[i].cases;
            const lastCumulativeCases =
              data[i + dateRange - 1].cumulative_cases;
            const increaseInCumulativeCases =
              lastCumulativeCases - initialCumulativeCases;

            // Geet stats for deaths
            const initialCumulativeDeaths =
              data[i].cumulative_deaths - data[i].deaths;
            const lastCumulativeDeaths =
              data[i + dateRange - 1].cumulative_deaths;
            const increaseInCumulativeDeaths =
              lastCumulativeDeaths - initialCumulativeDeaths;

            // Get stats for recovered
            // NOTE: Health region does not have recovered data
            let initialCumulativeRecovered: number | undefined;
            let lastCumulativeRecovered: number | undefined;
            let increaseInCumulativeRecovered: number | undefined;

            if (!data[i].health_region) {
              initialCumulativeRecovered =
                data[i].cumulative_recovered - data[i].recovered;
              lastCumulativeRecovered =
                data[i + dateRange - 1].cumulative_recovered;

              if (lastCumulativeRecovered) {
                increaseInCumulativeRecovered =
                  lastCumulativeRecovered - initialCumulativeRecovered;
              }
            }
            data.push({
              province: data[i].province,
              health_region: data[i].health_region,
              cases: increaseInCumulativeCases,
              cumulative_cases: lastCumulativeCases,
              deaths: increaseInCumulativeDeaths,
              cumulative_deaths: lastCumulativeDeaths,
              recovered: increaseInCumulativeRecovered,
              cumulative_recovered: lastCumulativeRecovered,
            });
          }

          return data;
        }
      })
    );
  }

  private getCovidProvincialInfo(date: string[]) {
    return this.http.get(
      `https://api.opencovid.ca/summary?${this.getLocationQueryString(date)}`
    );
  }

  private getCovidFederalInfo(date: string[]) {
    return this.http.get(
      `https://api.opencovid.ca/summary?loc=canada&${this.getLocationQueryString(
        date
      )}`
    );
  }

  private getCovidRegionalInfo(date: string[]) {
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

  // Article to find the number of days between two dates
  // https://www.delftstack.com/howto/javascript/javascript-subtract-dates/
  private dateRange(date1: Date, date2: Date): number {
    const date1utc = Date.UTC(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate()
    );
    const date2utc = Date.UTC(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate()
    );
    const day = 1000 * 60 * 60 * 24;
    return (date2utc - date1utc) / day;
  }
}
