import * as firebase from 'firebase-admin';

export class ViagensService {
  static readonly basePath = 'viagens';

  static createRef = () =>
    firebase
      .firestore()
      .collection(ViagensService.basePath)
      .doc();

  static getByTaxaId = (taxaId: string) =>
    firebase
      .firestore()
      .collection(ViagensService.basePath)
      .where('taxa_id', '==', taxaId);
}
