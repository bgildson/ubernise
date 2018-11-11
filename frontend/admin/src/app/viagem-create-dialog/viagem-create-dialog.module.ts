import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatInputModule,
  MatButtonModule,
  MatDialogModule
} from '@angular/material';

import { ViagemCreateDialogComponent } from './viagem-create-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule
  ],
  declarations: [ViagemCreateDialogComponent],
  entryComponents: [ViagemCreateDialogComponent]
})
export class ViagemCreateDialogModule {}
