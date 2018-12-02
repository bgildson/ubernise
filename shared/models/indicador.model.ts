import { IndicadorTipo } from '../../shared/types';

export interface IndicadorModel {
  id?: string;
  tipo: IndicadorTipo;
  usuario_uid: string;
  data: Date;
  valor_feito: number;
  valor_recebido: number;
  valor_inadimplente: number;
}
