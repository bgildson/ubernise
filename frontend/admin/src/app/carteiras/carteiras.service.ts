import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { throwError, from, Observable } from 'rxjs';
import { catchError, map, first } from 'rxjs/operators';

import { documentChangeActionToList } from '@shared/functions';
import { CarteiraModel } from '@shared/models';

@Injectable({
  providedIn: 'root'
})
export class CarteirasService {
  static readonly basePath = 'carteiras';

  constructor(
    private afs: AngularFirestore,
    private functions: AngularFireFunctions
  ) {}

  getAll = (): Observable<CarteiraModel[]> =>
    this.afs
      .collection(CarteirasService.basePath, query =>
        query.orderBy('usuario_nome_exibicao')
      )
      .snapshotChanges()
      .pipe(
        first(),
        map(documentChangeActionToList<CarteiraModel>()),
        catchError(error => throwError(error.message))
      );

  adicionarCredito = (data: { usuario_uid; valor }) =>
    from(
      this.functions.functions.httpsCallable('carteirasAdicionarCredito')(data)
    ).pipe(
      map(res => res.data),
      catchError(error => throwError(error.message))
    );
}
