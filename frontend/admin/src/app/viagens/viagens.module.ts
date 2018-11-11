import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTableModule,
  MatPaginatorModule,
  MatDialogModule,
  MatMenuModule
} from '@angular/material';
import { NgxsModule } from '@ngxs/store';

import { ActionbarModule } from '@admin/actionbar/actionbar.module';
import { BreadcrumbModule } from '@admin/breadcrumb/breadcrumb.module';
import { ConfirmDialogModule } from '@admin/confirm-dialog/confirm-dialog.module';
import { ContentSpinnerModule } from '@admin/content-spinner/content-spinner.module';
import { UsuariosState } from '@admin/usuarios/usuarios.state';
import { ViagemCreateDialogModule } from '@admin/viagem-create-dialog/viagem-create-dialog.module';
import { ViagemFinalizeDialogModule } from '@admin/viagem-finalize-dialog/viagem-finalize-dialog.module';
import { ViagensRoutingModule } from './viagens-routing.module';
import { SearchComponent } from './search/search.component';
import { ViagensService } from './viagens.service';
import { ViagensState } from './viagens.state';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ViagensRoutingModule,
    NgxsModule.forFeature([ViagensState, UsuariosState]),
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule,
    ActionbarModule,
    BreadcrumbModule,
    ConfirmDialogModule,
    ContentSpinnerModule,
    ViagemCreateDialogModule,
    ViagemFinalizeDialogModule
  ],
  declarations: [SearchComponent],
  providers: [ViagensService]
})
export class ViagensModule {}
