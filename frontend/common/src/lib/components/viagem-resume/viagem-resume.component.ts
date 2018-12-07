import {
  Component,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output
} from '@angular/core';

import { ViagemModel } from '@shared/models';

@Component({
  selector: 'viagem-resume',
  templateUrl: './viagem-resume.component.html',
  styleUrls: ['./viagem-resume.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViagemResumeComponent {
  @Input()
  viagem: ViagemModel;
  @Output() duplicate = new EventEmitter();
  @Output() cancel = new EventEmitter();

  viagemStatusDescriptions = {
    aguardando: 'Aguardando',
    iniciada: 'Iniciada',
    finalizada: 'Finalizada',
    cancelada: 'Cancelada'
  };
}
