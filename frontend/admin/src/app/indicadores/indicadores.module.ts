import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';

import { IndicadoresService } from './indicadores.service';
import { IndicadoresState } from './indicadores.state';

@NgModule({
  declarations: [],
  imports: [CommonModule, NgxsModule.forFeature([IndicadoresState])],
  providers: [IndicadoresService]
})
export class IndicadoresModule {}
