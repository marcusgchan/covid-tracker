import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableFiltersSectionComponent } from './table-filters-section/table-filters-section.component';
import { SavedFiltersComponent } from './saved-filters/saved-filters.component';

const routes: Routes = [
  { path: '', component: TableFiltersSectionComponent },
  { path: 'saved-filters', component: SavedFiltersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
