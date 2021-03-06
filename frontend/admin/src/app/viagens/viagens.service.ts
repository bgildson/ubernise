import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, throwError } from 'rxjs';
import { map, catchError, mergeMap, startWith } from 'rxjs/operators';

import { documentChangeActionToList, listToEntities } from '@shared/functions';
import { ViagemModel } from '@shared/models';
import { UsuariosService } from '@admin/usuarios/usuarios.service';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ViagemStatus } from '@shared/types';

export const parseViagens = (viagens): ViagemModel[] =>
  viagens.map(
    viagem =>
      <ViagemModel>{
        ...viagem,
        data_inicial: viagem.data_inicial ? viagem.data_inicial.toDate() : null,
        data_final: viagem.data_final ? viagem.data_final.toDate() : null
      }
  );

@Injectable({
  providedIn: 'root'
})
export class ViagensService {
  static readonly basePath = 'viagens';

  constructor(
    private afs: AngularFirestore,
    private functions: AngularFireFunctions,
    private usuariosService: UsuariosService
  ) {}

  search = (query: { data_inicial; data_final; usuario_uid; status }) =>
    this.afs
      .collection(ViagensService.basePath, ref => {
        let _ref = <any>ref;
        if (query.data_inicial) {
          _ref = _ref.where('data_inicial', '>=', query.data_inicial);
        }
        if (query.data_final) {
          _ref = _ref.where('data_inicial', '<=', query.data_final);
        }
        if (query.data_inicial || query.data_final) {
          _ref = _ref.orderBy('data_inicial', 'desc');
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
        ref
          .where('status', '==', <ViagemStatus>'finalizada')
          .orderBy('data_inicial', 'desc')
          .limit(5)
      )
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

  listenStarted = () =>
    this.afs
      .collection(ViagensService.basePath, ref =>
        ref.where('status', '==', <ViagemStatus>'iniciada')
      )
      .snapshotChanges()
      .pipe(
        map(documentChangeActionToList()),
        map(parseViagens),
        catchError(error => throwError(error.message))
      );

  create = (viagem: { origem: string; destino: string; data_agendamento }) =>
    this.functions
      .httpsCallable('viagensCreate')(viagem)
      .pipe(catchError(error => throwError(error.message)));

  finalize = (data: { id: string; passageiros: string[] }) =>
    this.functions
      .httpsCallable('viagensFinalize')(data)
      .pipe(catchError(error => throwError(error.message)));

  cancel = (id: string) =>
    this.functions
      .httpsCallable('viagensCancel')(id)
      .pipe(catchError(error => throwError(error.message)));
}
