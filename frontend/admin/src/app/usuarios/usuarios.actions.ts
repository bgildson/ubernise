import { UsuarioModel } from '@shared/models';

export class SetLocallyUsuariosAction {
  static readonly type = '[usuarios] set locally usuarios';

  constructor(public usuarios: UsuarioModel[]) {}
}
