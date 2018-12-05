import { firestore } from 'firebase-admin';
import * as moment from 'moment';

export class MovimentacoesService {
  static readonly basePath = 'movimentacoes';

  static createRef = () =>
    firestore()
      .collection(MovimentacoesService.basePath)
      .doc();

  static getByUsuarioUidViagemId = (usuarioUid: string, viagemId) =>
    firestore()
      .collection(MovimentacoesService.basePath)
      .where('usuario_uid', '==', usuarioUid)
      .where('viagem_id', '==', viagemId)
      .get();

  static getByAnoMes = (ano: number, mes: number) =>
    firestore()
      .collection(MovimentacoesService.basePath)
      .where('data', '>=', new Date(ano, mes, 1, 3))
      .where(
        'data',
        '<',
        moment(new Date(ano, mes, 1, 3))
          .add(1, 'month')
          .toDate()
      )
      .get();
}
