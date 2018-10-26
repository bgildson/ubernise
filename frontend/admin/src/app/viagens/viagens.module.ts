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
  MatPaginatorModule
} from '@angular/material';
import { NgxsModule } from '@ngxs/store';

import { ActionbarModule } from '@admin/actionbar/actionbar.module';
import { BreadcrumbModule } from '@admin/breadcrumb/breadcrumb.module';
import { ContentSpinnerModule } from '@admin/content-spinner/content-spinner.module';
import { UsuariosState } from '@admin/usuarios/usuarios.state';
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
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule,
    ActionbarModule,
    BreadcrumbModule,
    ContentSpinnerModule
  ],
  declarations: [SearchComponent],
  providers: [ViagensService]
})
export class ViagensModule {}
