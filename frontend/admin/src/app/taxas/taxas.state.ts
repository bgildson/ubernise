import { State, Selector, Action, StateContext } from '@ngxs/store';
import * as moment from 'moment';

import { TaxaModel, BaseStateModel } from '@shared/models';
import { TaxasService } from './taxas.service';
import {
  LoadTaxasAction,
  LoadTaxasSuccessAction,
  LoadTaxasFailAction,
  CreateTaxaAction,
  CreateTaxaSuccessAction,
  CreateTaxaFailAction,
  DeleteTaxaAction,
  DeleteTaxaFailAction,
  DeleteTaxaSuccessAction
} from './taxas.actions';
import { tap, catchError } from 'rxjs/operators';
import { ShowGlobalSnackBarAction } from '@admin/app.actions';
import { listToEntitiesOrdenation } from '@shared/functions';
import { of } from 'rxjs';

export class TaxasStateModel extends BaseStateModel<TaxaModel> {
  creating: boolean;
  deleting: boolean;
}

const defaultState: TaxasStateModel = {
  entities: {},
  ordenation: [],
  loading: false,
  creating: false,
  deleting: false
};

@State({
  name: 'taxas',
  defaults: defaultState
})
export class TaxasState {
  @Selector()
  static taxas(state: TaxasStateModel) {
    return state.ordenation.map(id => state.entities[id]);
  }
  @Selector()
  static loading(state: TaxasStateModel) {
    return state.loading;
  }
  @Selector()
  static creating(state: TaxasStateModel) {
    return state.creating;
  }
  @Selector()
  static deleting(state: TaxasStateModel) {
    return state.deleting;
  }

  constructor(public taxasService: TaxasService) {}

  @Action(LoadTaxasAction)
  loadTaxas(ctx: StateContext<TaxasStateModel>) {
    ctx.patchState({
      loading: true,
      entities: {},
      ordenation: []
    });

    return this.taxasService.getAll().pipe(
      tap(taxas => ctx.dispatch(new LoadTaxasSuccessAction(taxas))),
      catchError(message => ctx.dispatch(new LoadTaxasFailAction(message)))
    );
  }

  @Action(LoadTaxasSuccessAction)
  loadTaxasSuccess(
    ctx: StateContext<TaxasStateModel>,
    { taxas }: LoadTaxasSuccessAction
  ) {
    ctx.patchState({
      ...listToEntitiesOrdenation()(taxas),
      loading: false
    });

    return of(true);
  }

  @Action(LoadTaxasFailAction)
  loadTaxasFail(
    ctx: StateContext<TaxasStateModel>,
    { message }: LoadTaxasFailAction
  ) {
    ctx.patchState({
      loading: false
    });

    return ctx.dispatch(new ShowGlobalSnackBarAction(message));
  }

  @Action(CreateTaxaAction)
  createTaxa(ctx: StateContext<TaxasStateModel>, { taxa }: CreateTaxaAction) {
    ctx.patchState({
      creating: true
    });

    return this.taxasService.create(taxa).pipe(
      tap(taxa => ctx.dispatch(new CreateTaxaSuccessAction(taxa))),
      catchError(message => ctx.dispatch(new CreateTaxaFailAction(message)))
    );
  }

  @Action(CreateTaxaSuccessAction)
  createTaxaSuccess(
    ctx: StateContext<TaxasStateModel>,
    { taxa }: CreateTaxaSuccessAction
  ) {
    let { entities, ordenation } = ctx.getState();
    if (ordenation.length > 0)
      entities = {
        ...entities,
        [ordenation[0]]: {
          ...entities[ordenation[0]],
          data_final: moment(taxa.data_inicial)
            .subtract(1, 'days')
            .toDate()
        }
      };
    ctx.patchState({
      entities: {
        ...entities,
        [taxa.id]: taxa
      },
      ordenation: [taxa.id, ...ordenation],
      creating: false
    });

    return ctx.dispatch(new ShowGlobalSnackBarAction('Taxa criada!'));
  }

  @Action(CreateTaxaFailAction)
  createTaxaFail(
    ctx: StateContext<TaxasStateModel>,
    { message }: CreateTaxaFailAction
  ) {
    ctx.patchState({
      creating: false
    });

    return ctx.dispatch(new ShowGlobalSnackBarAction(message));
  }

  @Action(DeleteTaxaAction)
  deleteTaxa(ctx: StateContext<TaxasStateModel>, { taxaId }: DeleteTaxaAction) {
    ctx.patchState({
      deleting: true
    });

    return this.taxasService.delete(taxaId).pipe(
      tap(() => ctx.dispatch(new DeleteTaxaSuccessAction(taxaId))),
      catchError(message => ctx.dispatch(new DeleteTaxaFailAction(message)))
    );
  }

  @Action(DeleteTaxaSuccessAction)
  deleteTaxaSuccess(
    ctx: StateContext<TaxasStateModel>,
    { taxaId }: DeleteTaxaSuccessAction
  ) {
    const state = ctx.getState();
    const { entities, [taxaId]: deleted } = state;
    const ordenation = state.ordenation.splice(1); // state.ordenation.filter(o => o != taxaId);
    ctx.patchState({
      entities: {
        ...entities,
        [ordenation[0]]: {
          ...entities[ordenation[0]],
          data_final: null
        }
      },
      ordenation,
      deleting: false
    });

    return ctx.dispatch(new ShowGlobalSnackBarAction('Taxa deletada!'));
  }

  @Action(DeleteTaxaFailAction)
  deleteTaxaFail(
    ctx: StateContext<TaxasStateModel>,
    { message }: DeleteTaxaFailAction
  ) {
    ctx.patchState({
      deleting: false
    });

    return ctx.dispatch(new ShowGlobalSnackBarAction(message));
  }
}
