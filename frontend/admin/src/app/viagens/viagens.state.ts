import { State, Selector, Action, StateContext } from '@ngxs/store';

import { BaseStateModel, ViagemModel } from '@shared/models';
import { ViagensService } from './viagens.service';
import {
  LoadRecentsViagensAction,
  LoadRecentsViagensFailAction,
  LoadRecentsViagensSuccessAction,
  SearchViagensAction,
  SearchViagensSuccessAction,
  SearchViagensFailAction,
  CreateViagemAgendadaAction,
  CreateViagemAgendadaSuccessAction,
  CreateViagemAgendadaFailAction
} from './viagens.actions';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ShowGlobalSnackBarAction } from '@admin/app.actions';
import { listToEntitiesOrdenation } from '@shared/functions';
import { CreateTaxaFailAction } from '@admin/taxas/taxas.actions';

export class ViagensStateModel extends BaseStateModel<ViagemModel> {
  recents: ViagemModel[];
  recentsLoading: boolean;
  creating: boolean;
  starting: boolean;
}

export const defaultState: ViagensStateModel = {
  entities: {},
  ordenation: [],
  loading: false,
  recents: [],
  recentsLoading: false,
  creating: false,
  starting: false
};

@State({
  name: 'viagens',
  defaults: defaultState
})
export class ViagensState {
  @Selector()
  static viagens({ ordenation, entities }: ViagensStateModel) {
    return ordenation.map(key => entities[key]);
  }
  @Selector()
  static loading({ loading }: ViagensStateModel) {
    return loading;
  }
  @Selector()
  static recentsViagens({ recents }: ViagensStateModel) {
    return recents;
  }
  @Selector()
  static creating({ creating }: ViagensStateModel) {
    return creating;
  }

  constructor(private viagensService: ViagensService) {}

  @Action(SearchViagensAction)
  searchViagens(
    ctx: StateContext<ViagensStateModel>,
    { query }: SearchViagensAction
  ) {
    ctx.patchState({
      loading: true,
      ordenation: [],
      entities: {}
    });

    return this.viagensService.search(query).pipe(
      tap(viagens => ctx.dispatch(new SearchViagensSuccessAction(viagens))),
      catchError(message => ctx.dispatch(new ShowGlobalSnackBarAction(message)))
    );
  }

  @Action(SearchViagensSuccessAction)
  searchViagensSuccess(
    ctx: StateContext<ViagensStateModel>,
    { viagens }: SearchViagensSuccessAction
  ) {
    ctx.patchState({
      ...listToEntitiesOrdenation()(viagens),
      loading: false
    });

    return of(true);
  }

  @Action(SearchViagensFailAction)
  searchViagensFail(
    ctx: StateContext<ViagensStateModel>,
    { message }: SearchViagensFailAction
  ) {
    ctx.patchState({
      loading: false
    });

    return ctx.dispatch(new ShowGlobalSnackBarAction(message));
  }

  @Action(LoadRecentsViagensAction)
  loadRecentsViagens(ctx: StateContext<ViagensStateModel>) {
    ctx.dispatch({
      recents: [],
      recentsLoading: true
    });

    return this.viagensService.searchRecents().pipe(
      tap(viagens =>
        ctx.dispatch(new LoadRecentsViagensSuccessAction(viagens))
      ),
      catchError(message =>
        ctx.dispatch(new LoadRecentsViagensFailAction(message))
      )
    );
  }

  @Action(LoadRecentsViagensSuccessAction)
  loadRecentsViagensSuccess(
    ctx: StateContext<ViagensStateModel>,
    { viagens }: LoadRecentsViagensSuccessAction
  ) {
    ctx.patchState({
      recentsLoading: false,
      recents: viagens
    });

    return of(true);
  }

  @Action(LoadRecentsViagensFailAction)
  loadRecentsViagensFail(
    ctx: StateContext<ViagensStateModel>,
    { message }: LoadRecentsViagensFailAction
  ) {
    ctx.patchState({
      recentsLoading: false
    });

    return ctx.dispatch(new ShowGlobalSnackBarAction(message));
  }

  @Action(CreateViagemAgendadaAction)
  createViagemAgendada(
    ctx: StateContext<ViagensStateModel>,
    { viagem }: CreateViagemAgendadaAction
  ) {
    ctx.patchState({
      creating: true
    });

    return this.viagensService.createAgendada(viagem).pipe(
      tap(v => ctx.dispatch(new CreateViagemAgendadaSuccessAction(v))),
      catchError(message => ctx.dispatch(new CreateTaxaFailAction(message)))
    );
  }

  @Action(CreateViagemAgendadaSuccessAction)
  createViagemSuccess(ctx: StateContext<ViagensStateModel>) {
    ctx.patchState({
      creating: false
    });

    return ctx.dispatch(new ShowGlobalSnackBarAction('Viagem criada!'));
  }

  @Action(CreateViagemAgendadaFailAction)
  createViagemFail(
    ctx: StateContext<ViagensStateModel>,
    { message }: CreateViagemAgendadaFailAction
  ) {
    ctx.patchState({
      creating: false
    });

    return ctx.dispatch(new ShowGlobalSnackBarAction(message));
  }
}
