import { Component, Input, EventEmitter, Output } from '@angular/core';

import { ViagemModel } from '@shared/models';

@Component({
  selector: 'viagem-card',
  templateUrl: './viagem-card.component.html',
  styleUrls: ['./viagem-card.component.scss']
})
export class ViagemCardComponent {
  @Input()
  viagem: ViagemModel;
  @Input()
  disabled: boolean = false;
  @Output()
  cancel = new EventEmitter();
  @Output()
  finalize = new EventEmitter();
}
