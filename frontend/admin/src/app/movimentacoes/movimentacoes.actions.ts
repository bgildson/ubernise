import { MovimentacaoModel } from '@shared/models';

export class SearchMovimentacoesAction {
  static readonly type = '[movimentacoes] search movimentacoes';

  constructor(public params: { usuario_uid }) {}
}

export class SearchMovimentacoesSuccessAction {
  static readonly type = '[movimentacoes] search movimentacoes success';

  constructor(public movimentacoes: MovimentacaoModel[]) {}
}

export class SearchMovimentacoesFailAction {
  static readonly type = '[movimentacoes] search movimentacoes fail';

  constructor(public message: string) {}
}
