import * as firebase from 'firebase-admin';

export class MovimentacoesService {
  static readonly basePath = 'movimentacoes';

  static createRef = () =>
    firebase
      .firestore()
      .collection(MovimentacoesService.basePath)
      .doc();
}
