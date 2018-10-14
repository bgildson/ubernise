import * as firebase from 'firebase-admin';
import * as functions from 'firebase-functions';

import { UsuarioPerfil } from '../../../shared/types';

export const authenticateRequest = async req => {
  try {
    const token = req.get('Authorization').split('Bearer ')[1];

    await firebase.auth().verifyIdToken(token);

    return true;
  } catch (ex) {
    throw {
      code: 'malformed request',
      message: 'Requisição não autenticada!'
    };
  }
};

export const authenticatedCall = (context: functions.https.CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Você não está autenticado!'
    );
  }
  return true;
};

export const authenticatedAndUsuarioWithPerfilIn = async (
  context: functions.https.CallableContext,
  perfis: UsuarioPerfil[]
) => {
  if (authenticatedCall(context)) {
    const usuarioRef = await firebase
      .firestore()
      .doc(`usuarios/${context.auth.uid}`)
      .get();
    if (!perfis.find(perfil => perfil === usuarioRef.data().perfil)) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Você não tem permissão para executar esta ação!'
      );
    }
  }
  return true;
};
