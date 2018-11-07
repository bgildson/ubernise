import { ViagemStatus } from '../types';
import { UsuarioModel } from './usuario.model';

export class ViagemModel {
  id?: string;
  origem: string;
  destino: string;
  taxa_id: string;
  taxa_valor: number;
  data_agendamento: Date;
  data_inicial: Date;
  data_final: Date;
  status: ViagemStatus;
  passageiros: string[] | Partial<UsuarioModel>[];
}
