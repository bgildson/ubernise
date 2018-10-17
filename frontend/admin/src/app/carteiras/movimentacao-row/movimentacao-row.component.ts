import { Component, Input } from '@angular/core';
import { MovimentacaoModel } from '@shared/models';

@Component({
  selector: 'movimentacao-row',
  templateUrl: './movimentacao-row.component.html',
  styleUrls: ['./movimentacao-row.component.scss']
})
export class MovimentacaoRowComponent {
  movimentacaoOperacoesDescriptions = {
    credito: 'Crédito',
    corrida: 'Corrida',
    ajuste: 'Ajuste'
  };

  @Input()
  movimentacao: MovimentacaoModel;
}
