import { ViagemModel } from '@shared/models';

export class SearchViagensAction {
  static readonly type = '[viagens] search viagens';

  constructor(
    public query: { data_inicial; data_final; usuario_uid; status }
  ) {}
}

export class SearchViagensSuccessAction {
  static readonly type = '[viagens] search viagens success';

  constructor(public viagens: ViagemModel[]) {}
}

export class SearchViagensFailAction {
  static readonly type = '[viagens] search viagens fail';

  constructor(public message: string) {}
}

export class LoadRecentsViagensAction {
  static readonly type = '[viagens] load recents viagens';
}

export class LoadRecentsViagensSuccessAction {
  static readonly type = '[viagens] load recents viagens success';

  constructor(public viagens: ViagemModel[]) {}
}

export class LoadRecentsViagensFailAction {
  static readonly type = '[viagens] load recents viagens fail';

  constructor(public message: string) {}
}

export class CreateViagemAction {
  static readonly type = '[viagens] create viagem';

  constructor(
    public viagem: { origem: string; destino: string; data_agendamento: Date }
  ) {}
}

export class CreateViagemSuccessAction {
  static readonly type = '[viagens] create viagem success';

  constructor(public viagem: ViagemModel) {}
}

export class CreateViagemFailAction {
  static readonly type = '[viagens] create viagem fail';

  constructor(public message: string) {}
}

export class FinalizeViagemAction {
  static readonly type = '[viagens] finalize viagem';

  constructor(public data: { id: string; passageiros: string[] }) {}
}

export class FinalizeViagemSuccessAction {
  static readonly type = '[viagens] finalize viagem success';
}

export class FinalizeViagemFailAction {
  static readonly type = '[viagens] finalize viagem fail';

  constructor(public message: string) {}
}

export class CancelViagemAction {
  static readonly type = '[viagens] cancel viagem';

  constructor(public id: string) {}
}

export class CancelViagemSuccessAction {
  static readonly type = '[viagens] cancel viagem success';
}

export class CancelViagemFailAction {
  static readonly type = '[viagens] cancel viagem fail';

  constructor(public message: string) {}
}

export class SetViagemStartedAction {
  static readonly type = '[viagens] set viagem started';

  constructor(public viagem: ViagemModel) {}
}
