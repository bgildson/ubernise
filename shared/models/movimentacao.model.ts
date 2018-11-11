import { MovimentacaoTipo, MovimentacaoOperacao } from '../types';

export class MovimentacaoModel {
  id?: string;
  usuario_uid: string;
  data: Date;
  tipo: MovimentacaoTipo;
  operacao: MovimentacaoOperacao;
  valor: number;
  viagem_id?: string;
  observacao?: string;
}
