import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCardModule,
  MatExpansionModule,
  MatButtonModule,
  MatIconModule,
  MatDialogModule
} from '@angular/material';
import { NgxsModule } from '@ngxs/store';

import { ConfirmDialogModule } from '@common/components/confirm-dialog/confirm-dialog.module';
import { UsuarioTileModule } from '@common/components/usuario-tile/usuario-tile.module';
import { ViagemCardModule } from '@admin/viagem-card/viagem-card.module';
import { ViagemCreateDialogModule } from '@admin/viagem-create-dialog/viagem-create-dialog.module';
import { ViagemFinalizeDialogModule } from '@admin/viagem-finalize-dialog/viagem-finalize-dialog.module';
import { ViagensState } from '@admin/viagens/viagens.state';
import { DashboardRoutingModule } from './dashbard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ViagemRowComponent } from './viagem-row/viagem-row.component';
import { IndicadoresModule } from '@admin/indicadores/indicadores.module';

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([ViagensState]),
    DashboardRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    ConfirmDialogModule,
    IndicadoresModule,
    UsuarioTileModule,
    ViagemCardModule,
    ViagemCreateDialogModule,
    ViagemFinalizeDialogModule
  ],
  declarations: [DashboardComponent, ViagemRowComponent]
})
export class DashboardModule {}
