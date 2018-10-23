import * as firebase from 'firebase-admin';
import * as functions from 'firebase-functions';

firebase.initializeApp(functions.config().firebase);

export * from './functions/carteiras';
export * from './functions/taxas';
export * from './functions/usuarios';
