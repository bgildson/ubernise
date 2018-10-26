import * as firebase from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as moment from 'moment';

import { TaxaModel } from '../../../shared/models';
import { parseStringToNumber } from '../../../shared/functions';
import { ViagensService, TaxasService } from '../services';
import { authenticatedAndUsuarioWithPerfilIn } from './shared';

export const taxasCreate = functions.https.onCall(
  async (taxa: { valor; data_inicial }, context) => {
    await authenticatedAndUsuarioWithPerfilIn(context, [
      'administrador',
      'motorista'
    ]);

    let _taxa = <Partial<TaxaModel>>{
      valor: parseStringToNumber(taxa.valor),
      data_inicial: moment(taxa.data_inicial).toDate()
    };

    const batch = firebase.firestore().batch();

    const taxaAnteriorSnap = await TaxasService.getByDataFinal(null).get();
    if (!taxaAnteriorSnap.empty) {
      const taxaAnterior = <TaxaModel>taxaAnteriorSnap.docs[0].data();

      if (taxaAnterior.data_inicial >= _taxa.data_inicial)
        throw new functions.https.HttpsError(
          'failed-precondition',
          'Não foi possível criar a taxa, pois existe uma outra que inicia após esta!'
        );

      const dataFinalAnterior = moment(taxa.data_inicial)
        .subtract(1, 'days')
        .toDate();

      batch.update(taxaAnteriorSnap.docs[0].ref, <TaxaModel>{
        ...taxaAnterior,
        data_final: dataFinalAnterior
      });
    }

    _taxa = <TaxaModel>{
      ..._taxa,
      data_final: null
    };
    const taxaRef = TaxasService.createRef();
    batch.create(taxaRef, _taxa);

    await batch.commit();

    return {
      ..._taxa,
      id: taxaRef.id,
      data_inicial: _taxa.data_inicial.toISOString()
    };
  }
);

export const taxasDelete = functions.https.onCall(async (taxaId, context) => {
  await authenticatedAndUsuarioWithPerfilIn(context, [
    'administrador',
    'motorista'
  ]);

  const viagensSnap = await ViagensService.getByTaxaId(taxaId).get();
  if (!viagensSnap.empty)
    throw new functions.https.HttpsError(
      'failed-precondition',
      'Não foi possível deletar a taxa, já existem viagens utilizando esta taxa!'
    );

  const taxaSnap = await TaxasService.getById(taxaId).get();
  if (!taxaSnap.exists)
    throw new functions.https.HttpsError(
      'not-found',
      `Taxa "${taxaId}" não foi encontrada!`
    );
  const taxa = <TaxaModel>taxaSnap.data();

  if (taxa.data_final !== null)
    throw new functions.https.HttpsError(
      'failed-precondition',
      'Você só pode excluir a taxa mais recente!'
    );

  const batch = firebase.firestore().batch();

  const taxaAnteriorDataFinal = moment(taxa.data_inicial)
    .subtract(1, 'days')
    .toDate();
  const taxaAnteriorSnap = await TaxasService.getByDataFinal(
    taxaAnteriorDataFinal
  ).get();
  if (!taxaAnteriorSnap.empty)
    batch.update(taxaAnteriorSnap.docs[0].ref, <TaxaModel>{
      ...taxaAnteriorSnap.docs[0].data(),
      data_final: null
    });

  batch.delete(taxaSnap.ref);

  await batch.commit();

  return true;
});
