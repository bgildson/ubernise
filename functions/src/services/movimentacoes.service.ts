import * as firebase from 'firebase-admin';

export class MovimentacoesService {
  static readonly basePath = 'movimentacoes';

  static createRef = () =>
    firebase
      .firestore()
      .collection(MovimentacoesService.basePath)
      .doc();

  static getByUsuarioUidViagemId = (usuarioUid: string, viagemId) =>
    firebase
      .firestore()
      .collection(MovimentacoesService.basePath)
      .where('usuario_uid', '==', usuarioUid)
      .where('viagem_id', '==', viagemId)
      .get();
}
