import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActionbarComponent } from './actionbar.component';

@NgModule({
  imports: [CommonModule],
  exports: [ActionbarComponent],
  declarations: [ActionbarComponent]
})
export class ActionbarModule {}
