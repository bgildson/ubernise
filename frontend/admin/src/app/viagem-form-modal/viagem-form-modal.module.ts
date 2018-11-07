import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatInputModule,
  MatDatepickerModule
} from '@angular/material';

import { ViagemFormModalComponent } from './viagem-form-modal.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule
  ],
  declarations: [ViagemFormModalComponent],
  entryComponents: [ViagemFormModalComponent]
})
export class ViagemFormModalModule {}
