import { firestore } from 'firebase-admin';
import * as moment from 'moment';
import { IndicadorTipo } from '@shared/types';

export class IndicadoresService {
  static readonly basePath = 'indicadores';

  static createRef = () =>
    firestore()
      .collection(IndicadoresService.basePath)
      .doc();

  static getByUsuarioUid = (usuarioUid: string) =>
    firestore()
      .collection(IndicadoresService.basePath)
      .where('usuario_uid', '==', usuarioUid)
      .get();

  static getByTipoUsuarioUidAnoMes = (
    tipo: IndicadorTipo,
    usuarioUid: string,
    ano: number,
    mes: number
  ) =>
    firestore()
      .collection(IndicadoresService.basePath)
      .where('tipo', '==', tipo)
      .where('usuario_uid', '==', usuarioUid)
      .where('data', '==', new Date(ano, mes, 1))
      .get();

  static getByTipoUsuarioUidAnoMesAnterior = (
    tipo: IndicadorTipo,
    usuarioUid: string,
    ano: number,
    mes: number
  ) => {
    const dataAnterior = moment(new Date(ano, mes, 1))
      .subtract(1, 'months')
      .toDate();

    return IndicadoresService.getByTipoUsuarioUidAnoMes(
      tipo,
      usuarioUid,
      dataAnterior.getFullYear(),
      dataAnterior.getMonth()
    );
  };
}
