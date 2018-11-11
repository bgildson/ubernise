import * as functions from 'firebase-functions';

import { UsuarioModel, CarteiraModel } from '@shared/models';
import { CarteirasService } from '../services';

export const usuarioUpdated = functions.firestore
  .document('usuarios/{uid}')
  .onUpdate(async usuario => {
    const usuarioBefore = <UsuarioModel>usuario.before.data();
    const usuarioAfter = <UsuarioModel>usuario.after.data();

    if (
      usuarioBefore.nome_exibicao !== usuarioAfter.nome_exibicao ||
      usuarioBefore.imagem_url !== usuarioAfter.imagem_url
    ) {
      const carteirasSnap = await CarteirasService.getByUsuarioUid(
        usuarioAfter.uid
      ).get();
      let carteiraSnap;
      for (carteiraSnap of carteirasSnap.docs) {
        const carteira = <CarteiraModel>carteiraSnap.data();

        await CarteirasService.update(carteiraSnap.id, <CarteiraModel>{
          ...carteira,
          usuario_nome_exibicao: usuarioAfter.nome_exibicao,
          usuario_imagem_url: usuarioAfter.imagem_url
        });
      }
    }

    return true;
  });
