import { CarteiraModel } from '@shared/models';

export class LoadCarteirasAction {
  static readonly type = '[carteiras] load carteiras';
}

export class LoadCarteirasSuccessAction {
  static readonly type = '[carteiras] load carteiras success';

  constructor(public carteiras: CarteiraModel[]) {}
}

export class LoadCarteirasFailAction {
  static readonly type = '[carteiras] load carteiras fail';

  constructor(public message: string) {}
}

export class AdicionarCreditoAction {
  static readonly type = '[carteiras] adicionar credito';

  constructor(public data: { usuario_uid: string; valor: number }) {}
}

export class AdicionarCreditoSuccessAction {
  static readonly type = '[carteiras] adicionar credito success';

  constructor(public carteira: CarteiraModel) {}
}

export class AdicionarCreditoFailAction {
  static readonly type = '[carteiras] adicionar credito fail';

  constructor(public message: string) {}
}
