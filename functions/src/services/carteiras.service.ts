import * as firebase from 'firebase-admin';

export class CarteirasService {
  static readonly basePath = 'carteiras';

  static getById = (id: string) =>
    firebase.firestore().doc(`${CarteirasService.basePath}/${id}`);
}
