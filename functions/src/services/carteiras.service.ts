import * as firebase from 'firebase-admin';

export class CarteirasService {
  static readonly basePath = 'carteiras';

  static getById = (id: string) =>
    firebase.firestore().doc(`${CarteirasService.basePath}/${id}`);

  static getByUsuarioUid = (uid: string) =>
    firebase
      .firestore()
      .collection(CarteirasService.basePath)
      .where('usuario_uid', '==', uid);

  static update = (id, data) =>
    firebase
      .firestore()
      .doc(`${CarteirasService.basePath}/${id}`)
      .update(data);
}
