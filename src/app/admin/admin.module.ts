import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { MockCategoryComponent } from './mock-category/mock-category.component';

@NgModule({
  declarations: [
    MockCategoryComponent
  ],
  exports: [
  ],
  imports: [
    AdminRoutingModule,
    RouterModule,
    ReactiveFormsModule,

  ],
  providers: [],
  bootstrap: []
})
export class AdminModule { }
