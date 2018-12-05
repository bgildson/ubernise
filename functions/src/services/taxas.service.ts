import { firestore } from 'firebase-admin';

export class TaxasService {
  static readonly basePath = 'taxas';

  static createRef = () =>
    firestore()
      .collection(TaxasService.basePath)
      .doc();

  static getById = (id: string) =>
    firestore().doc(`${TaxasService.basePath}/${id}`);

  static getByDataFinal = dataFinal =>
    firestore()
      .collection(TaxasService.basePath)
      .where('data_final', '==', dataFinal);

  static getOlderThanData = data =>
    firestore()
      .collection(TaxasService.basePath)
      .where('data_inicial', '<=', data)
      .orderBy('data_inicial', 'desc')
      .get();

  static getCurrent = () =>
    TaxasService.getOlderThanData(firestore.Timestamp.now().toDate());
}
