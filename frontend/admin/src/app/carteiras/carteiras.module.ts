import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { NgxsModule } from '@ngxs/store';

import { ActionbarModule } from '@admin/actionbar/actionbar.module';
import { BreadcrumbModule } from '@admin/breadcrumb/breadcrumb.module';
import { ContentSpinnerModule } from '@admin/content-spinner/content-spinner.module';
import { CarteirasRoutingModule } from './carteiras-routing.module';
import { CarteirasComponent } from './carteiras.component';
import { CarteirasState } from './carteiras.state';

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([CarteirasState]),
    MatButtonModule,
    MatIconModule,
    CarteirasRoutingModule,
    ActionbarModule,
    BreadcrumbModule,
    ContentSpinnerModule,
    FlexLayoutModule
  ],
  declarations: [CarteirasComponent]
})
export class CarteirasModule {}
