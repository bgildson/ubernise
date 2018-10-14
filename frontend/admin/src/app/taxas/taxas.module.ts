import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatIconModule,
  MatButtonModule,
  MatDialogModule,
  MatDatepickerModule,
  MatInputModule,
  MatNativeDateModule
} from '@angular/material';
import { NgxsModule } from '@ngxs/store';

import { ActionbarModule } from '@admin/actionbar/actionbar.module';
import { BreadcrumbModule } from '@admin/breadcrumb/breadcrumb.module';
import { ConfirmDialogModule } from '@admin/confirm-dialog/confirm-dialog.module';
import { ContentSpinnerModule } from '@admin/content-spinner/content-spinner.module';
import { TaxasRoutingModule } from './taxas-routing.module';
import { TaxasComponent } from './taxas.component';
import { TaxaComponent } from './taxa/taxa.component';
import { TaxaDialogComponent } from './taxa-dialog/taxa-dialog.component';
import { TaxasService } from './taxas.service';
import { TaxasState } from './taxas.state';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    TaxasRoutingModule,
    ActionbarModule,
    BreadcrumbModule,
    ContentSpinnerModule,
    NgxsModule.forFeature([TaxasState]),
    ConfirmDialogModule
  ],
  declarations: [TaxasComponent, TaxaComponent, TaxaDialogComponent],
  providers: [TaxasService],
  entryComponents: [TaxaDialogComponent]
})
export class TaxasModule {}
