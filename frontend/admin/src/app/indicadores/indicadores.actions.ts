import { IndicadorModel } from '@shared/models';

export class SetIndicadoresAction {
  static readonly type = '[indicadores] set indicadores';

  constructor(public indicadores: IndicadorModel[]) {}
}
