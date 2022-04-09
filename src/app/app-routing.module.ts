import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableFiltersSectionComponent } from './table-filters-section/table-filters-section.component';

const routes: Routes = [
  { path: 'data-table', component: TableFiltersSectionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
