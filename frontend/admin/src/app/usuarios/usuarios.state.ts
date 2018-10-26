import {
  State,
  Selector,
  Action,
  StateContext,
  NgxsOnInit,
  Store
} from '@ngxs/store';
import { BaseStateModel, UsuarioModel } from '@shared/models';
import { UsuariosService } from './usuarios.service';
import { SetLocallyUsuariosAction } from './usuarios.actions';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { listToEntitiesOrdenation } from '@shared/functions';

export class UsuariosStateModel extends BaseStateModel<UsuarioModel> {}

export const defaultState: UsuariosStateModel = {
  entities: {},
  ordenation: [],
  loading: false
};

@State({
  name: 'usuarios',
  defaults: defaultState
})
export class UsuariosState implements NgxsOnInit {
  @Selector()
  static usuarios({ ordenation, entities }: UsuariosStateModel) {
    return ordenation.map(key => entities[key]);
  }

  constructor(private usuariosService: UsuariosService, private store: Store) {}

  ngxsOnInit() {
    this.usuariosService
      .listenPassageiros()
      .pipe(
        tap((usuarios: UsuarioModel[]) =>
          this.store.dispatch(new SetLocallyUsuariosAction(usuarios))
        )
      )
      .subscribe();
  }

  @Action(SetLocallyUsuariosAction)
  setLocallyUsuario(
    ctx: StateContext<UsuariosStateModel>,
    { usuarios }: SetLocallyUsuariosAction
  ) {
    ctx.patchState({
      ...listToEntitiesOrdenation('uid')(usuarios)
    });

    return of(true);
  }
}
