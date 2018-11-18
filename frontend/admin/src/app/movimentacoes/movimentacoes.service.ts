import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { throwError, Observable } from 'rxjs';
import { map, catchError, first } from 'rxjs/operators';

import { documentChangeActionToList } from '@shared/functions';
import { MovimentacaoModel } from '@shared/models';

@Injectable({
  providedIn: 'root'
})
export class MovimentacoesService {
  static readonly basePath = 'movimentacoes';

  constructor(private afs: AngularFirestore) {}

  search = ({ usuario_uid }: { usuario_uid: string }) =>
    this.afs
      .collection(MovimentacoesService.basePath, ref =>
        ref.where('usuario_uid', '==', usuario_uid).orderBy('data', 'desc')
      )
      .snapshotChanges()
      .pipe(
        first(),
        map(documentChangeActionToList()),
        map(movimentacoes =>
          movimentacoes.map(
            (movimentacao: any) =>
              <MovimentacaoModel>{
                ...movimentacao,
                data: movimentacao.data.toDate()
              }
          )
        ),
        catchError(error => throwError(error.message))
      );
}
