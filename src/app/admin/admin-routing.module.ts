import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MockCategoryComponent } from './mock-category/mock-category.component';

const routes: Routes = [
  {
    path: 'category',
    component:MockCategoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
