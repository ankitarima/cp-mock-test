import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ExamComponent } from './exam/exam.component';
import { TestConfigComponent } from './test-config/test-config.component';
import { TestRoutingModule } from './test-routing.module';
import { TestComponent } from './test.component';
import { UserComponent } from './user/user.component';
import { CommonModule } from '@angular/common';
import { CountdownModule } from 'ngx-countdown';
import { SafeHtmlPipe } from '../shared/pipe/safeHtml.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InstructionsComponent } from './instructions/instructions.component';




@NgModule({
  declarations: [
    SafeHtmlPipe,
    TestConfigComponent,
    ExamComponent,
    TestComponent,
    UserComponent,
    InstructionsComponent
  ],
  exports: [
    SafeHtmlPipe
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CountdownModule,
    TestRoutingModule,

  ],
  providers: [],
  bootstrap: []
})
export class TestModule { }
