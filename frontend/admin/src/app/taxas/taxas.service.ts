import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { catchError, map, first } from 'rxjs/operators';
import { throwError, from, Observable } from 'rxjs';

import { documentChangeActionToList } from '@shared/functions';
import { TaxaModel } from '@shared/models';

@Injectable({
  providedIn: 'root'
})
export class TaxasService {
  static readonly basePath = 'taxas';

  constructor(
    private afs: AngularFirestore,
    private functions: AngularFireFunctions
  ) {}

  getAll = () =>
    this.afs
      .collection(TaxasService.basePath, query =>
        query.orderBy('data_inicial', 'desc')
      )
      .snapshotChanges()
      .pipe(
        first(),
        map(documentChangeActionToList()),
        map(taxas => {
          return taxas.map(
            (taxa: any) =>
              <TaxaModel>{
                ...taxa,
                data_inicial: taxa.data_inicial
                  ? taxa.data_inicial.toDate()
                  : null,
                data_final: taxa.data_final ? taxa.data_final.toDate() : null
              }
          );
        }),
        catchError(error => throwError(error.message))
      );

  create = (taxa: Partial<TaxaModel>): Observable<TaxaModel> =>
    from(this.functions.functions.httpsCallable('taxasCreate')(taxa)).pipe(
      map(res => res.data),
      catchError(error => throwError(error.message))
    );

  delete = (taxaId: string) =>
    from(this.functions.functions.httpsCallable('taxasDelete')(taxaId)).pipe(
      catchError(error => throwError(error.message))
    );
}
