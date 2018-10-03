import {
  Action,
  StateContext,
  State,
  Selector,
  Store,
  NgxsOnInit
} from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { tap, catchError, switchMap } from 'rxjs/operators';

import { UsuarioModel } from '@shared/models';
import { UsuarioPerfil } from '@shared/types';
import { UsuariosService } from '@admin/usuarios/usuarios.service';
import {
  LoginAction,
  LoginSuccessAction,
  LoginFailAction,
  LoadUsuarioAction,
  LogoutAction
} from './auth.actions';
import { AuthService } from './auth.service';
import { ShowGlobalSnackBarAction } from '@admin/app.actions';

export interface AuthStateModel {
  loginLoading: boolean;
  usuario: UsuarioModel;
  usuarioLoading: boolean;
}

const defaultState: AuthStateModel = {
  loginLoading: false,
  usuario: {
    uid: '',
    email: '',
    cpf: '',
    nome_completo: '',
    nome_exibicao: '',
    imagem_url: '',
    perfil: <UsuarioPerfil>'supervisor',
    ativo: true
  },
  usuarioLoading: false
};

@State<AuthStateModel>({
  name: 'auth',
  defaults: defaultState
})
export class AuthState implements NgxsOnInit {
  @Selector()
  static usuarioUid(state: AuthStateModel) {
    return state.usuario.uid;
  }
  @Selector()
  static usuario(state: AuthStateModel) {
    return state.usuario;
  }

  constructor(
    private store: Store,
    private authService: AuthService,
    private usuariosService: UsuariosService
  ) {}

  ngxsOnInit(ctx: StateContext<AuthStateModel>) {
    const { uid } = this.authService;
    if (!uid) this.store.reset(defaultState);
  }

  @Action([LoginAction])
  login(ctx: StateContext<AuthStateModel>, { email, senha }: LoginAction) {
    ctx.patchState({
      loginLoading: true
    });
    return this.authService.entrar(email, senha).pipe(
      tap(_ => ctx.dispatch(new LoginSuccessAction())),
      catchError(error => ctx.dispatch(new LoginFailAction(error)))
    );
  }

  @Action([LoginSuccessAction])
  loginSuccess(ctx: StateContext<AuthStateModel>) {
    return ctx.dispatch(new LoadUsuarioAction()).pipe(
      switchMap(_ => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          loginLoading: false
        });
        return ctx.dispatch(new Navigate(['/']));
      })
    );
  }

  @Action([LoginFailAction])
  loginFail(ctx: StateContext<AuthStateModel>, { message }: LoginFailAction) {
    ctx.patchState({
      loginLoading: false
    });
    return ctx.dispatch(new ShowGlobalSnackBarAction(message));
  }

  @Action([LogoutAction])
  logout({ dispatch, patchState }: StateContext<AuthStateModel>) {
    return this.authService.sair().pipe(
      switchMap(_ => {
        patchState(defaultState);
        return dispatch(new Navigate(['/login']));
      })
    );
  }

  @Action([LoadUsuarioAction])
  loadUsuario(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({
      usuarioLoading: true
    });

    const { uid, email } = this.authService;

    return this.usuariosService.getByUid(uid).pipe(
      tap(data => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          usuarioLoading: false,
          usuario: {
            ...state.usuario,
            ...data,
            uid,
            email
          }
        });
      })
    );
  }
}
