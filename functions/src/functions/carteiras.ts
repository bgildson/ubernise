import * as firebase from 'firebase-admin';
import * as functions from 'firebase-functions';

import { authenticatedAndUsuarioWithPerfilIn } from './shared';
import { parseStringToNumber } from '../../../shared/functions';
import { CarteiraModel, MovimentacaoModel } from '../../../shared/models';
import { CarteirasService, MovimentacoesService } from '../services';

export const carteirasAdicionarCredito = functions.https.onCall(
  async (data: { usuario_uid; valor }, context) => {
    await authenticatedAndUsuarioWithPerfilIn(context, [
      'administrador',
      'motorista'
    ]);

    const _data = new Date();
    const valor = parseStringToNumber(data.valor);

    if (valor <= 0)
      throw new functions.https.HttpsError(
        'failed-precondition',
        'O valor deve ser maior que zero!'
      );

    const carteiraSnap = await CarteirasService.getById(data.usuario_uid).get();
    if (!carteiraSnap.exists)
      throw new functions.https.HttpsError(
        'not-found',
        `Carteira "${data.usuario_uid}" não encontrada!`
      );
    const carteira = <CarteiraModel>carteiraSnap.data();

    const batch = firebase.firestore().batch();

    const _carteira = <CarteiraModel>{
      ...carteira,
      id: carteiraSnap.id,
      saldo: carteira.saldo + valor
    };
    batch.update(carteiraSnap.ref, _carteira);

    const movimentacaoRef = MovimentacoesService.createRef();
    const movimentacao: MovimentacaoModel = {
      id: movimentacaoRef.id,
      usuario_uid: carteiraSnap.id,
      data: _data,
      tipo: 'entrada',
      operacao: 'credito',
      valor
    };

    batch.create(movimentacaoRef, movimentacao);

    await batch.commit();

    // send notification

    return _carteira;
  }
);
