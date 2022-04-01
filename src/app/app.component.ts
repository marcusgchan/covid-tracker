import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import CovidInfo from './covid-info.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'covid-tracker';
  rows = new MatTableDataSource<any>([]);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get('https://api.opencovid.ca/summary?date=01-09-2020')
      .subscribe((observer: any) => {
        this.rows = observer.summary;
      });
  }
}
