import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatExpansionModule } from '@angular/material';
import { NgxsModule } from '@ngxs/store';

import { UsuarioTileModule } from '@admin/usuario-tile/usuario-tile.module';
import { ViagensState } from '@admin/viagens/viagens.state';
import { DashboardRoutingModule } from './dashbard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ViagemRowComponent } from './viagem-row/viagem-row.component';

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([ViagensState]),
    DashboardRoutingModule,
    MatCardModule,
    MatExpansionModule,
    UsuarioTileModule
  ],
  declarations: [DashboardComponent, ViagemRowComponent]
})
export class DashboardModule {}
