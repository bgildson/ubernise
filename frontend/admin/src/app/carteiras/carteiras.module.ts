import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { NgxsModule } from '@ngxs/store';

import { CarteirasRoutingModule } from './carteiras-routing.module';
import { CarteirasComponent } from './carteiras.component';
import { CarteirasState } from './carteiras.state';
import { BreadcrumbModule } from '@admin/breadcrumb/breadcrumb.module';
import { ActionbarModule } from '@admin/actionbar/actionbar.module';

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([CarteirasState]),
    MatButtonModule,
    MatIconModule,
    CarteirasRoutingModule,
    BreadcrumbModule,
    ActionbarModule,
    FlexLayoutModule
  ],
  declarations: [CarteirasComponent]
})
export class CarteirasModule {}
