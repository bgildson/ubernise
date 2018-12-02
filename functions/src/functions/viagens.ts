import { firestore } from 'firebase-admin';
import * as functions from 'firebase-functions';

import {
  ViagemModel,
  TaxaModel,
  MovimentacaoModel,
  CarteiraModel
} from '../../../shared/models';
import {
  ViagensService,
  TaxasService,
  MovimentacoesService,
  CarteirasService
} from '../services';
import { authenticatedAndUsuarioWithPerfilIn } from './shared';
import { reprocessarIndicador } from './indicadores';

export const parseViagemToResponse = (viagem: ViagemModel) => ({
  ...viagem,
  data_inicial: viagem.data_inicial ? viagem.data_inicial.toISOString() : null,
  data_final: viagem.data_final ? viagem.data_final.toISOString() : null
});

export const viagensCreate = functions.https.onCall(
  async ({ origem, destino }: { origem: string; destino: string }, context) => {
    await authenticatedAndUsuarioWithPerfilIn(context, [
      'administrador',
      'motorista'
    ]);

    const viagemOpened = await ViagensService.getByStatus('iniciada');
    if (!viagemOpened.empty)
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Já existe uma viagem iniciada!'
      );

    const batch = firestore().batch();

    const viagemRef = ViagensService.createRef();

    const dataInicial = new Date();

    const taxaSnap = await TaxasService.getOlderThanData(dataInicial);
    if (taxaSnap.empty)
      throw new functions.https.HttpsError(
        'not-found',
        'Não foi encontrada uma taxa!'
      );
    const taxa: TaxaModel = <TaxaModel>taxaSnap.docs[0].data();

    const viagem: ViagemModel = {
      id: viagemRef.id,
      origem,
      destino,
      data_inicial: dataInicial,
      data_final: null,
      passageiros: [],
      status: 'iniciada',
      taxa_id: taxaSnap.docs[0].id,
      taxa_valor: taxa.valor
    };

    batch.create(viagemRef, viagem);

    await batch.commit();

    return parseViagemToResponse(viagem);
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

    const batch = firestore().batch();

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

    await reprocessarIndicador(
      'inadimplencia_mensal',
      context.auth.uid,
      _viagem.data_final.getFullYear(),
      _viagem.data_final.getMonth()
    );

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

    const batch = firestore().batch();

    const _viagem = <ViagemModel>{
      ...viagem,
      status: 'cancelada'
    };

    batch.update(viagemSnap.ref, _viagem);

    let passageiro;
    for (passageiro of _viagem.passageiros) {
      const carteiraSnap = await CarteirasService.getById(passageiro).get();
      const carteira = <CarteiraModel>carteiraSnap.data();

      batch.update(carteiraSnap.ref, <CarteiraModel>{
        ...carteira,
        saldo: carteira.saldo + _viagem.taxa_valor
      });

      const movimentacaoSnap = await MovimentacoesService.getByUsuarioUidViagemId(
        passageiro,
        viagemSnap.id
      );

      if (!movimentacaoSnap.empty) batch.delete(movimentacaoSnap.docs[0].ref);
    }

    await batch.commit();

    if (viagem.status === 'finalizada') {
      await reprocessarIndicador(
        'inadimplencia_mensal',
        context.auth.uid,
        _viagem.data_final.getFullYear(),
        _viagem.data_final.getMonth()
      );
    }

    return parseViagemToResponse(_viagem);
  }
);
