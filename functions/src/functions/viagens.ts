import * as firebase from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as moment from 'moment';

import { ViagemModel, TaxaModel } from '@shared/models';
import { ViagensService, TaxasService } from '../services';
import { authenticatedAndUsuarioWithPerfilIn } from './shared';

export const viagensCreateAgendada = functions.https.onCall(
  async (
    {
      origem,
      destino,
      data_agendamento
    }: { origem: string; destino: string; data_agendamento },
    context
  ) => {
    await authenticatedAndUsuarioWithPerfilIn(context, [
      'administrador',
      'motorista'
    ]);

    const batch = firebase.firestore().batch();

    const viagemRef = ViagensService.createRef();

    const dataAgendamento = data_agendamento
      ? moment(data_agendamento).toDate()
      : null;

    const hoje = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    );

    if (dataAgendamento && dataAgendamento < hoje)
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Data de agendamento deve ser posterior a agora!'
      );

    let taxaSnap: firebase.firestore.QuerySnapshot;
    if (dataAgendamento) {
      taxaSnap = await TaxasService.getOlderThanData(dataAgendamento);
    } else {
      taxaSnap = await TaxasService.getCurrent();
    }

    if (taxaSnap.empty)
      throw new functions.https.HttpsError(
        'not-found',
        'Taxa para agendamento não encontrada!'
      );

    const taxa: TaxaModel = <TaxaModel>taxaSnap.docs[0].data();

    const viagem = <ViagemModel>{
      origem,
      destino,
      data_agendamento: dataAgendamento,
      data_inicial: null,
      data_final: null,
      passageiros: [],
      status: 'aguardando',
      taxa_id: taxaSnap.docs[0].id,
      taxa_valor: taxa.valor
    };

    batch.create(viagemRef, viagem);

    await batch.commit();

    return {
      ...viagem,
      id: viagemRef.id,
      data_agendamento: viagem.data_agendamento
        ? viagem.data_agendamento.toISOString()
        : null
    };
  }
);
