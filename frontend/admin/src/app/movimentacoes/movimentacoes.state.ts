import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap, catchError } from 'rxjs/operators';

import { MovimentacaoModel, BaseStateModel } from '@shared/models';
import {
  SearchMovimentacoesAction,
  SearchMovimentacoesSuccessAction,
  SearchMovimentacoesFailAction
} from './movimentacoes.actions';
import { MovimentacoesService } from './movimentacoes.service';
import {
  entitiesToList,
  listToEntities,
  listToEntitiesOrdenation
} from '@shared/functions';
import { of } from 'rxjs';
import { ShowGlobalSnackBarAction } from '@admin/app.actions';

export class MovimentacoesStateModel extends BaseStateModel<
  MovimentacaoModel
> {}

export const defaultState: MovimentacoesStateModel = {
  entities: {},
  ordenation: [],
  loading: false
};

@State({
  name: 'movimentacoes',
  defaults: defaultState
})
export class MovimentacoesState {
  @Selector()
  static movimentacoes({ ordenation, entities }: MovimentacoesStateModel) {
    return ordenation.map(key => entities[key]);
  }
  @Selector()
  static loading({ loading }: MovimentacoesStateModel) {
    return loading;
  }

  constructor(private movimentacoesService: MovimentacoesService) {}

  @Action(SearchMovimentacoesAction)
  searchMovimentos(
    ctx: StateContext<MovimentacoesStateModel>,
    { params }: SearchMovimentacoesAction
  ) {
    ctx.patchState({
      entities: {},
      ordenation: [],
      loading: true
    });

    return this.movimentacoesService.search(params).pipe(
      tap(movimentacoes =>
        ctx.dispatch(new SearchMovimentacoesSuccessAction(movimentacoes))
      ),
      catchError(message =>
        ctx.dispatch(new SearchMovimentacoesFailAction(message))
      )
    );
  }

  @Action(SearchMovimentacoesSuccessAction)
  searchMovimentacoesSuccess(
    ctx: StateContext<MovimentacoesStateModel>,
    { movimentacoes }: SearchMovimentacoesSuccessAction
  ) {
    ctx.patchState({
      ...listToEntitiesOrdenation()(movimentacoes),
      loading: false
    });

    return of(true);
  }

  @Action(SearchMovimentacoesFailAction)
  searchMovimentacoesFail(
    ctx: StateContext<MovimentacoesStateModel>,
    { message }: SearchMovimentacoesFailAction
  ) {
    ctx.patchState({
      loading: false
    });

    return ctx.dispatch(new ShowGlobalSnackBarAction(message));
  }
}
