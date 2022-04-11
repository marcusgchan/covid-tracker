import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableSectionComponent } from './table-filters-section/table-section/table-section.component';
import { FiltersComponent } from './table-filters-section/filters/filters.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TableFiltersSectionComponent } from './table-filters-section/table-filters-section.component';
import { GraphComponent } from './table-filters-section/graph/graph.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SavedFiltersComponent } from './saved-filters/saved-filters.component';

@NgModule({
  declarations: [
    AppComponent,
    TableSectionComponent,
    FiltersComponent,
    TableFiltersSectionComponent,
    GraphComponent,
    SavedFiltersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    NgxChartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
