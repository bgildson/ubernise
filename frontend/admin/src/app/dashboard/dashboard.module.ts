import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCardModule,
  MatButtonModule,
  MatIconModule,
  MatDialogModule
} from '@angular/material';
import { NgxsModule } from '@ngxs/store';

import { ConfirmDialogModule } from '@common/components/confirm-dialog/confirm-dialog.module';
import { ViagemResumeModule } from '@common/components/viagem-resume/viagem-resume.module';
import { IndicadoresModule } from '@admin/indicadores/indicadores.module';
import { ViagemCardModule } from '@admin/viagem-card/viagem-card.module';
import { ViagemCreateDialogModule } from '@admin/viagem-create-dialog/viagem-create-dialog.module';
import { ViagemFinalizeDialogModule } from '@admin/viagem-finalize-dialog/viagem-finalize-dialog.module';
import { ViagensState } from '@admin/viagens/viagens.state';
import { DashboardRoutingModule } from './dashbard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([ViagensState]),
    DashboardRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    ConfirmDialogModule,
    ViagemResumeModule,
    IndicadoresModule,
    ViagemCardModule,
    ViagemCreateDialogModule,
    ViagemFinalizeDialogModule
  ],
  declarations: [DashboardComponent]
})
export class DashboardModule {}
