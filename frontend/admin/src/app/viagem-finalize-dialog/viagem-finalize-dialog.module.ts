import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatButtonModule } from '@angular/material';

import { UsuarioTileModule } from '@admin/usuario-tile/usuario-tile.module';
import { ViagemFinalizeDialogComponent } from './viagem-finalize-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    UsuarioTileModule
  ],
  exports: [ViagemFinalizeDialogComponent],
  declarations: [ViagemFinalizeDialogComponent],
  entryComponents: [ViagemFinalizeDialogComponent]
})
export class ViagemFinalizeDialogModule {}
