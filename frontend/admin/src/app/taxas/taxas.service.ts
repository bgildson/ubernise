import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { catchError, map, first } from 'rxjs/operators';
import { throwError, from } from 'rxjs';

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
      .pipe<TaxaModel[]>(
        first(),
        map(documentChangeActionToList()),
        map(taxas => {
          return taxas.map(
            taxa =>
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

  create = (taxa: Partial<TaxaModel>) =>
    from(this.functions.functions.httpsCallable('taxasCreate')(taxa)).pipe<
      TaxaModel
    >(
      map(res => res.data),
      catchError(error => throwError(error.message))
    );

  delete = (taxaId: string) =>
    from(this.functions.functions.httpsCallable('taxasDelete')(taxaId)).pipe(
      catchError(error => throwError(error.message))
    );
}
