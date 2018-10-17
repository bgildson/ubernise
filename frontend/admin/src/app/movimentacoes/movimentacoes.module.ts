import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';

import { MovimentacoesState } from './movimentacoes.state';
import { MovimentacoesService } from './movimentacoes.service';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([MovimentacoesState])],
  declarations: [],
  providers: [MovimentacoesService]
})
export class MovimentacoesModule {}
