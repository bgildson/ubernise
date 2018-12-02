import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { documentChangeActionToList } from '@shared/functions';
import { IndicadorModel } from '@shared/models';

export const parseIndicadores = (indicadores): IndicadorModel[] =>
  indicadores.map(
    indicador =>
      <IndicadorModel>{
        ...indicador,
        data: indicador.data ? indicador.data.toDate() : null
      }
  );

@Injectable({
  providedIn: 'root'
})
export class IndicadoresService {
  static readonly basePath = 'indicadores';

  constructor(private afs: AngularFirestore) {}

  listenLastFive = () =>
    this.afs
      .collection(IndicadoresService.basePath, ref =>
        ref.orderBy('data', 'desc').limit(5)
      )
      .snapshotChanges()
      .pipe(
        map(documentChangeActionToList()),
        map(parseIndicadores),
        catchError(error => throwError(error.message))
      );
}
