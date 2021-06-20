import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamComponent } from './exam/exam.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { TestConfigComponent } from './test-config/test-config.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: 'exam',
    component: ExamComponent
  },
  {
    path: 'user',
    component: UserComponent
  },
  {
    path: ':slug',
    component: InstructionsComponent
  },
  {
    path: 'config/:id',
    component: TestConfigComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRoutingModule { }
