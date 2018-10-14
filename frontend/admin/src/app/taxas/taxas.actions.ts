import { TaxaModel } from '@shared/models';

export class LoadTaxasAction {
  static readonly type = '[taxas] load taxas';
}

export class LoadTaxasSuccessAction {
  static readonly type = '[taxas] load taxas success';

  constructor(public taxas: TaxaModel[]) {}
}

export class LoadTaxasFailAction {
  static readonly type = '[taxas] load taxas fail';

  constructor(public message: string) {}
}

export class CreateTaxaAction {
  static readonly type = '[taxas] create taxa';

  constructor(public taxa: TaxaModel) {}
}

export class CreateTaxaSuccessAction {
  static readonly type = '[taxas] create taxa success';

  constructor(public taxa: TaxaModel) {}
}

export class CreateTaxaFailAction {
  static readonly type = '[taxas] create taxa fail';

  constructor(public message: string) {}
}

export class DeleteTaxaAction {
  static readonly type = '[taxas] delete taxa';

  constructor(public taxaId: string) {}
}

export class DeleteTaxaSuccessAction {
  static readonly type = '[taxas] delete taxa success';

  constructor(public taxaId: string) {}
}

export class DeleteTaxaFailAction {
  static readonly type = '[taxas] delete taxa fail';

  constructor(public message: string) {}
}
