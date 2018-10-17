import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule,
  MatIconModule,
  MatTableModule,
  MatCardModule,
  MatMenuModule,
  MatInputModule,
  MatDialogModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { NgxsModule } from '@ngxs/store';

import { BreadcrumbModule } from '@admin/breadcrumb/breadcrumb.module';
import { ContentSpinnerModule } from '@admin/content-spinner/content-spinner.module';
import { MovimentacoesModule } from '@admin/movimentacoes/movimentacoes.module';
import { CarteirasRoutingModule } from './carteiras-routing.module';
import { CarteirasComponent } from './carteiras.component';
import { CarteirasState } from './carteiras.state';
import { CarteirasService } from './carteiras.service';
import { AdicionarCreditoDialogComponent } from './adicionar-credito-dialog/adicionar-credito-dialog.component';
import { HistoricoDialogComponent } from './historico-dialog/historico-dialog.component';
import { MovimentacaoRowComponent } from './movimentacao-row/movimentacao-row.component';

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([CarteirasState]),
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTableModule,
    BreadcrumbModule,
    ContentSpinnerModule,
    FlexLayoutModule,
    CarteirasRoutingModule,
    MovimentacoesModule
  ],
  declarations: [
    CarteirasComponent,
    AdicionarCreditoDialogComponent,
    HistoricoDialogComponent,
    MovimentacaoRowComponent
  ],
  providers: [CarteirasService],
  entryComponents: [AdicionarCreditoDialogComponent, HistoricoDialogComponent]
})
export class CarteirasModule {}
