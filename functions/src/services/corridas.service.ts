import * as firebase from 'firebase-admin';

export class CorridasService {
  static readonly basePath = 'corridas';

  static getByTaxaId = (taxaId: string) =>
    firebase
      .firestore()
      .collection(CorridasService.basePath)
      .where('taxa_id', '==', taxaId);
}
