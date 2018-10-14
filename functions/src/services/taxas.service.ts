import * as firebase from 'firebase-admin';

export class TaxasService {
  static readonly basePath = 'taxas';

  static createRef = () =>
    firebase
      .firestore()
      .collection(TaxasService.basePath)
      .doc();

  static getById = (id: string) =>
    firebase.firestore().doc(`${TaxasService.basePath}/${id}`);

  static getByDataFinal = dataFinal =>
    firebase
      .firestore()
      .collection(TaxasService.basePath)
      .where('data_final', '==', dataFinal);
}
