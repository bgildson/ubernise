import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatButtonModule } from '@angular/material';
import { NgxsModule } from '@ngxs/store';

import { UsuarioTileModule } from '@admin/usuario-tile/usuario-tile.module';
import { UsuariosState } from '@admin/usuarios/usuarios.state';
import { ViagensState } from '@admin/viagens/viagens.state';
import { ViagemFinalizeDialogComponent } from './viagem-finalize-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxsModule.forFeature([ViagensState, UsuariosState]),
    MatButtonModule,
    MatDialogModule,
    UsuarioTileModule
  ],
  exports: [ViagemFinalizeDialogComponent],
  declarations: [ViagemFinalizeDialogComponent],
  entryComponents: [ViagemFinalizeDialogComponent]
})
export class ViagemFinalizeDialogModule {}
