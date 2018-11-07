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

export class CreateViagemAgendadaAction {
  static readonly type = '[viagens] create viagem agendada';

  constructor(
    public viagem: { origem: string; destino: string; data_agendamento: Date }
  ) {}
}

export class CreateViagemAgendadaSuccessAction {
  static readonly type = '[viagens] create viagem agendada success';

  constructor(public viagem: ViagemModel) {}
}

export class CreateViagemAgendadaFailAction {
  static readonly type = '[viagens] create viagem agendada fail';

  constructor(public message: string) {}
}
