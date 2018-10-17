import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Store, Select } from '@ngxs/store';

import { SearchMovimentacoesAction } from '@admin/movimentacoes/movimentacoes.actions';
import { MovimentacoesState } from '@admin/movimentacoes/movimentacoes.state';
import { Observable } from 'rxjs';
import { MovimentacaoModel } from '@shared/models';

@Component({
  selector: 'historico-dialog',
  templateUrl: './historico-dialog.component.html',
  styleUrls: ['./historico-dialog.component.scss']
})
export class HistoricoDialogComponent {
  @Select(MovimentacoesState.movimentacoes)
  movimentacoes$: Observable<MovimentacaoModel[]>;
  @Select(MovimentacoesState.loading)
  loading$: Observable<boolean>;

  constructor(
    private store: Store,
    @Inject(MAT_DIALOG_DATA) private dialogData: { usuario_uid }
  ) {}

  ngOnInit() {
    this.store.dispatch(new SearchMovimentacoesAction(this.dialogData));
  }
}
