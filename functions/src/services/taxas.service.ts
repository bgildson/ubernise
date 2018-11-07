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

  static getOlderThanData = data =>
    firebase
      .firestore()
      .collection(TaxasService.basePath)
      .where('data_inicial', '<=', data)
      .orderBy('data_inicial', 'desc')
      .get();

  static getCurrent = () => TaxasService.getOlderThanData(new Date());
}
