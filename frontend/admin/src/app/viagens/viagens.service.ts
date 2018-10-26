import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, throwError, of } from 'rxjs';
import { map, catchError, mergeMap, startWith } from 'rxjs/operators';

import { documentChangeActionToList, listToEntities } from '@shared/functions';
import { ViagemModel } from '@shared/models';
import { UsuariosService } from '@admin/usuarios/usuarios.service';

export const parseViagens = viagens =>
  viagens.map(
    viagem =>
      <ViagemModel>{
        ...viagem,
        data_agendamento: viagem.data_agendamento
          ? viagem.data_agendamento.toDate()
          : null,
        data_inicio: viagem.data_inicio ? viagem.data_inicio.toDate() : null,
        data_fim: viagem.data_fim ? viagem.data_fim.toDate() : null
      }
  );

@Injectable({
  providedIn: 'root'
})
export class ViagensService {
  static readonly basePath = 'viagens';

  constructor(
    private afs: AngularFirestore,
    private usuariosService: UsuariosService
  ) {}

  search = (query: { data_inicial; data_final; usuario_uid; status }) =>
    this.afs
      .collection(ViagensService.basePath, ref => {
        let _ref = <any>ref;
        if (query.data_inicial) {
          _ref = _ref.where('data_inicio', '>=', query.data_inicial);
        }
        if (query.data_final) {
          _ref = _ref.where('data_inicio', '<=', query.data_final);
        }
        if (query.data_inicial || query.data_final) {
          _ref = _ref.orderBy('data_inicio', 'desc');
        }
        if (query.usuario_uid) {
          _ref = _ref.where('passageiros', 'array-contains', query.usuario_uid);
        }
        if (query.status) {
          _ref = _ref.where('status', '==', query.status);
        }
        return _ref;
      })
      .snapshotChanges()
      .pipe(
        map(documentChangeActionToList()),
        map(parseViagens),
        mergeMap((viagens: ViagemModel[]) => {
          const passageirosUids = Object.keys(
            viagens
              .reduce((curr, viagem) => [...curr, ...viagem.passageiros], [])
              .reduce((curr, pk) => ({ ...curr, [pk]: true }), {})
          );
          return combineLatest(
            ...passageirosUids.map(passageiroUid =>
              this.usuariosService.getByUid(passageiroUid)
            )
          ).pipe(
            startWith([]),
            map(listToEntities('uid')),
            map(usuariosEntities =>
              viagens.map(viagem => ({
                ...viagem,
                passageiros: (<string[]>viagem.passageiros).map(
                  passageiroUid => usuariosEntities[passageiroUid]
                )
              }))
            )
          );
        }),
        catchError(error => throwError(error.message))
      );

  searchRecents = () =>
    this.afs
      .collection(ViagensService.basePath, ref =>
        ref.orderBy('data_inicio', 'desc').limit(5)
      )
      .snapshotChanges()
      .pipe<ViagemModel[]>(
        map(documentChangeActionToList()),
        map(parseViagens),
        mergeMap((viagens: ViagemModel[]) => {
          const passageirosUids = Object.keys(
            viagens
              .reduce((curr, viagem) => [...curr, ...viagem.passageiros], [])
              .reduce((curr, pk) => ({ ...curr, [pk]: true }), {})
          );
          return combineLatest(
            ...passageirosUids.map(passageiroUid =>
              this.usuariosService.getByUid(passageiroUid)
            )
          ).pipe(
            // startWith([]),
            map(listToEntities('uid')),
            map(usuariosEntities =>
              viagens.map(viagem => {
                return {
                  ...viagem,
                  passageiros: (<string[]>viagem.passageiros).map(
                    passageiroUid => usuariosEntities[passageiroUid]
                  )
                };
              })
            )
          );
        }),
        catchError(error => throwError(error.message))
      );
}
