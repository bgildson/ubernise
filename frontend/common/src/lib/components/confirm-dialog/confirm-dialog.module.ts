import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatDialogModule } from '@angular/material';

import { ConfirmDialogComponent } from './confirm-dialog.component';

@NgModule({
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  declarations: [ConfirmDialogComponent],
  entryComponents: [ConfirmDialogComponent]
})
export class ConfirmDialogModule {}
