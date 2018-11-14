import * as firebase from 'firebase-admin';
import { ViagemStatus } from '@shared/types';

export class ViagensService {
  static readonly basePath = 'viagens';

  static createRef = () =>
    firebase
      .firestore()
      .collection(ViagensService.basePath)
      .doc();

  static getById = (id: string) =>
    firebase.firestore().doc(`${ViagensService.basePath}/${id}`);

  static getByTaxaId = (taxaId: string) =>
    firebase
      .firestore()
      .collection(ViagensService.basePath)
      .where('taxa_id', '==', taxaId);

  static getByStatus = (status: ViagemStatus) =>
    firebase
      .firestore()
      .collection(ViagensService.basePath)
      .where('status', '==', status)
      .get();
}
