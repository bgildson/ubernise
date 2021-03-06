import { State, Selector, Action, StateContext, NgxsOnInit } from '@ngxs/store';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { listToEntitiesOrdenation } from '@shared/functions';
import { BaseStateModel, ViagemModel } from '@shared/models';
import { ShowGlobalSnackBarAction } from '@admin/app.actions';
import {
  LoadRecentsViagensAction,
  LoadRecentsViagensFailAction,
  LoadRecentsViagensSuccessAction,
  SearchViagensAction,
  SearchViagensSuccessAction,
  SearchViagensFailAction,
  CreateViagemAction,
  CreateViagemSuccessAction,
  CreateViagemFailAction,
  FinalizeViagemAction,
  FinalizeViagemFailAction,
  FinalizeViagemSuccessAction,
  CancelViagemAction,
  CancelViagemSuccessAction,
  CancelViagemFailAction,
  SetViagemStartedAction
} from './viagens.actions';
import { ViagensService } from './viagens.service';

export class ViagensStateModel extends BaseStateModel<ViagemModel> {
  recents: ViagemModel[];
  recentsLoading: boolean;
  started: ViagemModel;
  creating: boolean;
  finalizing: boolean;
  canceling: boolean;
}

export const defaultState: ViagensStateModel = {
  entities: {},
  ordenation: [],
  loading: false,
  recents: [],
  recentsLoading: false,
  started: null,
  creating: false,
  finalizing: false,
  canceling: false
};

@State({
  name: 'viagens',
  defaults: defaultState
})
export class ViagensState implements NgxsOnInit {
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
  @Selector()
  static finalizing({ finalizing }: ViagensStateModel) {
    return finalizing;
  }
  @Selector()
  static started({ started }: ViagensStateModel) {
    return started;
  }
  @Selector()
  static waiting({
    loading,
    creating,
    finalizing,
    canceling
  }: ViagensStateModel) {
    return loading || creating || finalizing || canceling;
  }

  constructor(private viagensService: ViagensService) {}

  ngxsOnInit(ctx: StateContext<ViagensStateModel>) {
    this.viagensService
      .listenStarted()
      .subscribe(([viagem]) =>
        ctx.dispatch(new SetViagemStartedAction(viagem))
      );
  }

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

  @Action(CreateViagemAction)
  createViagem(
    ctx: StateContext<ViagensStateModel>,
    { viagem }: CreateViagemAction
  ) {
    ctx.patchState({
      creating: true
    });

    return this.viagensService.create(viagem).pipe(
      tap(v => ctx.dispatch(new CreateViagemSuccessAction(v))),
      catchError(message => ctx.dispatch(new CreateViagemFailAction(message)))
    );
  }

  @Action(CreateViagemSuccessAction)
  createViagemSuccess(ctx: StateContext<ViagensStateModel>) {
    ctx.patchState({
      creating: false
    });

    return ctx.dispatch(new ShowGlobalSnackBarAction('Viagem criada!'));
  }

  @Action(CreateViagemFailAction)
  createViagemFail(
    ctx: StateContext<ViagensStateModel>,
    { message }: CreateViagemFailAction
  ) {
    ctx.patchState({
      creating: false
    });

    return ctx.dispatch(new ShowGlobalSnackBarAction(message));
  }

  @Action(FinalizeViagemAction)
  finalizeViagem(
    ctx: StateContext<ViagensStateModel>,
    { data }: FinalizeViagemAction
  ) {
    ctx.patchState({
      finalizing: true
    });

    return this.viagensService.finalize(data).pipe(
      tap(() => ctx.dispatch(new FinalizeViagemSuccessAction())),
      catchError(message => ctx.dispatch(new FinalizeViagemFailAction(message)))
    );
  }

  @Action(FinalizeViagemSuccessAction)
  finalizeViagemSuccess(ctx: StateContext<ViagensStateModel>) {
    ctx.patchState({
      finalizing: false
    });

    return ctx.dispatch(new ShowGlobalSnackBarAction('Viagem finalizada!'));
  }

  @Action(FinalizeViagemFailAction)
  finalizeViagemFail(
    ctx: StateContext<ViagensStateModel>,
    { message }: FinalizeViagemFailAction
  ) {
    ctx.patchState({
      finalizing: false
    });

    return ctx.dispatch(new ShowGlobalSnackBarAction(message));
  }

  @Action(CancelViagemAction)
  cancelViagem(
    ctx: StateContext<ViagensStateModel>,
    { id }: CancelViagemAction
  ) {
    ctx.patchState({
      canceling: true
    });

    return this.viagensService.cancel(id).pipe(
      tap(() => ctx.dispatch(new CancelViagemSuccessAction())),
      catchError(message => ctx.dispatch(new CancelViagemFailAction(message)))
    );
  }

  @Action(CancelViagemSuccessAction)
  cancelViagemSuccess(ctx: StateContext<ViagensStateModel>) {
    ctx.patchState({
      canceling: false
    });

    return ctx.dispatch(new ShowGlobalSnackBarAction('Viagem cancelada!'));
  }

  @Action(CancelViagemFailAction)
  cancelViagemFail(
    ctx: StateContext<ViagensStateModel>,
    { message }: CancelViagemFailAction
  ) {
    ctx.patchState({
      canceling: false
    });

    return ctx.dispatch(new ShowGlobalSnackBarAction(message));
  }

  @Action(SetViagemStartedAction)
  setViagemStarted(
    ctx: StateContext<ViagensStateModel>,
    { viagem }: SetViagemStartedAction
  ) {
    ctx.patchState({
      started: viagem
    });

    return of(true);
  }
}
