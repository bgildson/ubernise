import { State, Selector, StateContext, Action } from '@ngxs/store';
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { ShowGlobalSnackBarAction } from '@admin/app.actions';
import { listToEntitiesOrdenation } from '@shared/functions';
import { CarteiraModel, BaseStateModel } from '@shared/models';
import {
  LoadCarteirasAction,
  LoadCarteirasSuccessAction,
  LoadCarteirasFailAction,
  AdicionarCreditoAction,
  AdicionarCreditoSuccessAction,
  AdicionarCreditoFailAction
} from './carteiras.actions';
import { CarteirasService } from './carteiras.service';

export class CarteirasStateModel extends BaseStateModel<CarteiraModel> {
  adicionandoCredito: boolean;
}

export const defaultState: CarteirasStateModel = {
  entities: {},
  ordenation: [],
  loading: false,
  adicionandoCredito: false
};

@State({
  name: 'carteiras',
  defaults: defaultState
})
export class CarteirasState {
  @Selector()
  static carteiras({ entities, ordenation }: CarteirasStateModel) {
    return ordenation.map(key => entities[key]);
  }
  @Selector()
  static loading({ loading }: CarteirasStateModel) {
    return loading;
  }
  @Selector()
  static adicionandoCredito({ adicionandoCredito }: CarteirasStateModel) {
    return adicionandoCredito;
  }

  constructor(private carteirasService: CarteirasService) {}

  @Action(LoadCarteirasAction)
  loadCarteira(ctx: StateContext<CarteirasStateModel>) {
    ctx.patchState({
      loading: true,
      entities: {},
      ordenation: []
    });

    return this.carteirasService.getAll().pipe(
      tap(carteiras => ctx.dispatch(new LoadCarteirasSuccessAction(carteiras))),
      catchError(message => ctx.dispatch(new LoadCarteirasFailAction(message)))
    );
  }

  @Action(LoadCarteirasSuccessAction)
  loadCarteirasSuccess(
    ctx: StateContext<CarteirasStateModel>,
    { carteiras }: LoadCarteirasSuccessAction
  ) {
    ctx.patchState({
      ...listToEntitiesOrdenation('usuario_uid')(carteiras),
      loading: false
    });

    return of(true);
  }

  @Action(LoadCarteirasFailAction)
  loadCarteirasFail(
    ctx: StateContext<CarteirasStateModel>,
    { message }: LoadCarteirasFailAction
  ) {
    ctx.patchState({
      loading: false
    });

    return ctx.dispatch(new ShowGlobalSnackBarAction(message));
  }

  @Action(AdicionarCreditoAction)
  adicionarCredito(
    ctx: StateContext<CarteirasStateModel>,
    { data }: AdicionarCreditoAction
  ) {
    ctx.patchState({
      adicionandoCredito: true
    });

    return this.carteirasService.adicionarCredito(data).pipe(
      tap(carteira =>
        ctx.dispatch(new AdicionarCreditoSuccessAction(carteira))
      ),
      catchError(message =>
        ctx.dispatch(new AdicionarCreditoFailAction(message))
      )
    );
  }

  @Action(AdicionarCreditoSuccessAction)
  adicionarCreditoSuccess(
    ctx: StateContext<CarteirasStateModel>,
    { carteira }: AdicionarCreditoSuccessAction
  ) {
    const { entities } = ctx.getState();
    ctx.patchState({
      adicionandoCredito: false,
      entities: {
        ...entities,
        [carteira.id]: carteira
      }
    });

    return ctx.dispatch(new ShowGlobalSnackBarAction('Crédito adicionado!'));
  }

  @Action(AdicionarCreditoFailAction)
  adicionarCreditoFail(
    ctx: StateContext<CarteirasStateModel>,
    { message }: AdicionarCreditoFailAction
  ) {
    ctx.patchState({
      adicionandoCredito: false
    });

    return ctx.dispatch(new ShowGlobalSnackBarAction(message));
  }
}
