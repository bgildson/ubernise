import { firestore } from 'firebase-admin';
import { MovimentacaoModel, IndicadorModel } from '@shared/models';
import { IndicadorTipo } from '@shared/types';
import { IndicadoresService, MovimentacoesService } from '../services';

export const reprocessarIndicador = async (
  tipo: IndicadorTipo,
  usuarioUid: string,
  ano: number,
  mes: number
) => {
  const indicadorSnap = await IndicadoresService.getByTipoUsuarioUidAnoMes(
    tipo,
    usuarioUid,
    ano,
    mes
  );

  let indicadorRef;
  if (indicadorSnap.empty) {
    indicadorRef = IndicadoresService.createRef();
  } else {
    indicadorRef = indicadorSnap.docs[0].ref;
  }

  const batch = firestore().batch();

  if (tipo === 'inadimplencia_mensal') {
    // ajustar para obter movimentacoes associadas a determinado motorista(usuarioUid)
    const movimentacoesSnap = await MovimentacoesService.getByAnoMes(ano, mes);

    const indicador: IndicadorModel = {
      tipo: tipo,
      data: new Date(ano, mes, 1, 3),
      usuario_uid: usuarioUid,
      valor_feito: 0,
      valor_recebido: 0,
      valor_inadimplente: 0
    };

    let movimentacaoSnap;
    const feitoPorUid = {};
    const faturadoPorUid = {};
    for (movimentacaoSnap of movimentacoesSnap.docs) {
      const movimentacao = <MovimentacaoModel>movimentacaoSnap.data();

      feitoPorUid[movimentacao.usuario_uid] =
        feitoPorUid[movimentacao.usuario_uid] || 0;
      faturadoPorUid[movimentacao.usuario_uid] =
        faturadoPorUid[movimentacao.usuario_uid] || 0;

      if (movimentacao.operacao === 'viagem') {
        indicador.valor_feito += movimentacao.valor;
        feitoPorUid[movimentacao.usuario_uid] += movimentacao.valor;
      } else if (movimentacao.operacao === 'credito') {
        indicador.valor_recebido += movimentacao.valor;
        faturadoPorUid[movimentacao.usuario_uid] += movimentacao.valor;
      }
    }
    indicador.valor_inadimplente = Object.keys(feitoPorUid).reduce(
      (total, uid) => {
        const diff = feitoPorUid[uid] - faturadoPorUid[uid];
        return total + (diff > 0 ? diff : 0);
      },
      0
    );

    // const indicadorAnteriorSnap = await IndicadoresService.getByTipoUsuarioUidAnoMesAnterior(
    //   tipo,
    //   usuarioUid,
    //   ano,
    //   mes
    // );
    // if (!indicadorAnteriorSnap.empty) {
    //   const indicadorAnterior = <IndicadorModel>(
    //     indicadorAnteriorSnap.docs[0].data()
    //   );
    //   indicador.valor_inadimplente += indicadorAnterior.valor_inadimplente;
    // }

    if (indicador.valor_inadimplente < 0) {
      indicador.valor_inadimplente = 0;
    }

    batch.set(indicadorRef, indicador);
  }

  await batch.commit();
};
