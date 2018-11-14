import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatInputModule,
  MatButtonModule,
  MatDialogModule
} from '@angular/material';
import { NgxsModule } from '@ngxs/store';

import { ViagensState } from '@admin/viagens/viagens.state';
import { ViagemCreateDialogComponent } from './viagem-create-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    NgxsModule.forFeature([ViagensState])
  ],
  declarations: [ViagemCreateDialogComponent],
  entryComponents: [ViagemCreateDialogComponent]
})
export class ViagemCreateDialogModule {}
