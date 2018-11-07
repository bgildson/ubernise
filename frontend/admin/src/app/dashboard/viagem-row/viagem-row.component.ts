import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { ViagemModel } from '@shared/models';

@Component({
  selector: 'viagem-row',
  templateUrl: './viagem-row.component.html',
  styleUrls: ['./viagem-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViagemRowComponent {
  @Input()
  viagem: ViagemModel;

  viagemStatusDescriptions = {
    aguardando: 'Aguardando',
    iniciada: 'Iniciada',
    finalizada: 'Finalizada',
    cancelada: 'Cancelada'
  };
}
