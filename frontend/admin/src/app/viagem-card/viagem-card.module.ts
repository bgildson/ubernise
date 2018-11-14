import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCardModule,
  MatButtonModule,
  MatDividerModule
} from '@angular/material';

import { ViagemCardComponent } from './viagem-card.component';

@NgModule({
  imports: [CommonModule, MatButtonModule, MatCardModule, MatDividerModule],
  exports: [ViagemCardComponent],
  declarations: [ViagemCardComponent]
})
export class ViagemCardModule {}
