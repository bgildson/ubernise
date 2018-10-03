export class LoginAction {
  static readonly type = '[auth] login';

  constructor(public email: string, public senha: string) {}
}

export class LoginSuccessAction {
  static readonly type = '[auth] login success';
}

export class LoginFailAction {
  static readonly type = '[auth] login fail';

  constructor(public message: string) {}
}

export class LogoutAction {
  static readonly type = '[auth] logout';
}

export class LoadUsuarioAction {
  static readonly type = '[auth] load usuario';
}
