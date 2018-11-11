import * as firebase from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as moment from 'moment';

import {
  ViagemModel,
  TaxaModel,
  MovimentacaoModel,
  CarteiraModel
} from '@shared/models';
import {
  ViagensService,
  TaxasService,
  MovimentacoesService,
  CarteirasService
} from '../services';
import { authenticatedAndUsuarioWithPerfilIn } from './shared';

export const parseViagemToResponse = (viagem: ViagemModel) => ({
  ...viagem,
  data_agendamento: viagem.data_agendamento
    ? viagem.data_agendamento.toISOString()
    : null,
  data_inicial: viagem.data_inicial ? viagem.data_inicial.toISOString() : null,
  data_final: viagem.data_final ? viagem.data_final.toISOString() : null
});

export const viagensCreate = functions.https.onCall(
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

    const viagem = <ViagemModel>{
      id: viagemRef.id,
      origem,
      destino,
      data_agendamento: dataAgendamento,
      data_inicial: null,
      data_final: null,
      passageiros: [],
      status: 'aguardando',
      taxa_id: null,
      taxa_valor: null
    };

    batch.create(viagemRef, viagem);

    await batch.commit();

    return parseViagemToResponse(viagem);
  }
);

export const viagensStart = functions.https.onCall(
  async (id: string, context) => {
    await authenticatedAndUsuarioWithPerfilIn(context, [
      'administrador',
      'motorista'
    ]);

    const viagemSnap = await ViagensService.getById(id).get();

    if (!viagemSnap.exists)
      throw new functions.https.HttpsError(
        'not-found',
        'Viagem não encontrada!'
      );
    const viagem = <ViagemModel>viagemSnap.data();

    if (viagem.status !== 'aguardando')
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Viagem não pode ser iniciada!'
      );

    const dataInicial = new Date();

    const taxaSnap = await TaxasService.getOlderThanData(dataInicial);
    if (taxaSnap.empty)
      throw new functions.https.HttpsError(
        'not-found',
        'Não foi encontrada uma taxa!'
      );

    const taxa: TaxaModel = <TaxaModel>taxaSnap.docs[0].data();

    const _viagem = <ViagemModel>{
      ...viagem,
      id: viagemSnap.id,
      status: 'iniciada',
      data_inicial: dataInicial,
      taxa_id: taxaSnap.docs[0].id,
      taxa_valor: taxa.valor
    };

    const batch = firebase.firestore().batch();

    batch.update(viagemSnap.ref, _viagem);

    await batch.commit();

    return parseViagemToResponse(_viagem);
  }
);

export const viagensFinalize = functions.https.onCall(
  async (
    { id, passageiros }: { id: string; passageiros: string[] },
    context
  ) => {
    await authenticatedAndUsuarioWithPerfilIn(context, [
      'administrador',
      'motorista'
    ]);

    const viagemSnap = await ViagensService.getById(id).get();
    if (!viagemSnap.exists)
      throw new functions.https.HttpsError(
        'not-found',
        'Viagem não encontrada!'
      );
    const viagem = <ViagemModel>viagemSnap.data();

    if (viagem.status !== 'iniciada')
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Esta viagem não pode ser finalizada!'
      );

    if (!passageiros || passageiros.length === 0)
      throw new functions.https.HttpsError(
        'failed-precondition',
        'A viagem não pode ser finalizada sem passageiros!'
      );

    const _passageiros = Object.keys(
      passageiros.reduce((curr, next) => ({ ...curr, [next]: true }), {})
    );

    const taxaSnap = await TaxasService.getOlderThanData(viagem.data_inicial);
    if (taxaSnap.empty)
      throw new functions.https.HttpsError(
        'not-found',
        'Não foi encontrada uma taxa!'
      );

    const taxa: TaxaModel = <TaxaModel>taxaSnap.docs[0].data();

    const batch = firebase.firestore().batch();

    const _viagem = <ViagemModel>{
      ...viagem,
      id: viagemSnap.id,
      passageiros: _passageiros,
      status: 'finalizada',
      data_final: new Date()
    };

    batch.update(viagemSnap.ref, _viagem);

    let passageiro;
    for (passageiro of _passageiros) {
      const movimentacaoRef = MovimentacoesService.createRef();

      batch.create(movimentacaoRef, <MovimentacaoModel>{
        viagem_id: viagemSnap.id,
        data: _viagem.data_final,
        operacao: 'viagem',
        tipo: 'saida',
        usuario_uid: passageiro,
        valor: taxa.valor,
        observacao: ''
      });

      const carteiraSnap = await CarteirasService.getById(passageiro).get();
      const carteira = <CarteiraModel>carteiraSnap.data();

      batch.update(carteiraSnap.ref, <CarteiraModel>{
        ...carteira,
        saldo: carteira.saldo - taxa.valor
      });
    }

    await batch.commit();

    return parseViagemToResponse(_viagem);
  }
);

export const viagensCancel = functions.https.onCall(
  async (id: string, context) => {
    await authenticatedAndUsuarioWithPerfilIn(context, [
      'administrador',
      'motorista'
    ]);

    const viagemSnap = await ViagensService.getById(id).get();
    if (!viagemSnap.exists)
      throw new functions.https.HttpsError(
        'not-found',
        'Viagem não encontrada!'
      );
    const viagem = <ViagemModel>viagemSnap.data();

    if (viagem.status === 'cancelada')
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Esta viagem já está cancelada!'
      );

    const batch = firebase.firestore().batch();

    const _viagem = <ViagemModel>{
      ...viagem,
      status: 'cancelada'
    };

    batch.update(viagemSnap.ref, _viagem);

    let passageiro;
    for (passageiro of viagem.passageiros) {
      const carteiraSnap = await CarteirasService.getById(passageiro).get();
      const carteira = <CarteiraModel>carteiraSnap.data();

      batch.update(carteiraSnap.ref, <CarteiraModel>{
        ...carteira,
        saldo: carteira.saldo + viagem.taxa_valor
      });

      const movimentacaoSnap = await MovimentacoesService.getByUsuarioUidViagemId(
        passageiro,
        viagemSnap.id
      );

      if (!movimentacaoSnap.empty) batch.delete(movimentacaoSnap.docs[0].ref);
    }

    await batch.commit();

    return parseViagemToResponse(_viagem);
  }
);
