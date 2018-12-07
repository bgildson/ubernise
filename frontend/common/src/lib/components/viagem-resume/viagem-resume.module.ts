import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatExpansionModule,
  MatIconModule,
  MatMenuModule
} from '@angular/material';

import { UsuarioTileModule } from '../usuario-tile/usuario-tile.module';
import { ViagemResumeComponent } from './viagem-resume.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatMenuModule,
    UsuarioTileModule
  ],
  declarations: [ViagemResumeComponent],
  exports: [ViagemResumeComponent]
})
export class ViagemResumeModule {}
