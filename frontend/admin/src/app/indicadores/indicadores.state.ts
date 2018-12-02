import { State, Selector, StateContext, NgxsOnInit, Action } from '@ngxs/store';
import { BaseStateModel, IndicadorModel } from '@shared/models';
import { IndicadoresService } from './indicadores.service';
import { SetIndicadoresAction } from './indicadores.actions';
import { tap } from 'rxjs/operators';
import { listToEntitiesOrdenation } from '@shared/functions';
import { of } from 'rxjs';

export class IndicadoresStateModel extends BaseStateModel<IndicadorModel> {}

export const defaultState: IndicadoresStateModel = {
  entities: {},
  ordenation: [],
  loading: false
};

@State({
  name: 'indicadores',
  defaults: defaultState
})
export class IndicadoresState implements NgxsOnInit {
  @Selector()
  static indicadores({ ordenation, entities }: IndicadoresStateModel) {
    return ordenation.map(id => entities[id]);
  }

  constructor(private indicadoresService: IndicadoresService) {}

  ngxsOnInit(ctx: StateContext<IndicadoresStateModel>) {
    this.indicadoresService
      .listenLastFive()
      .subscribe(indicadores =>
        ctx.dispatch(new SetIndicadoresAction(indicadores))
      );
  }

  @Action(SetIndicadoresAction)
  setIndicadores(
    ctx: StateContext<IndicadoresStateModel>,
    { indicadores }: SetIndicadoresAction
  ) {
    ctx.patchState({
      ...listToEntitiesOrdenation('id')(indicadores)
    });

    return of(true);
  }
}
