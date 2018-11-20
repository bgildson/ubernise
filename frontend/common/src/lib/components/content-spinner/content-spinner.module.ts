import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material';

import { ContentSpinnerComponent } from './content-spinner.component';

@NgModule({
  declarations: [ContentSpinnerComponent],
  imports: [CommonModule, MatProgressSpinnerModule],
  exports: [ContentSpinnerComponent]
})
export class ContentSpinnerModule {}
