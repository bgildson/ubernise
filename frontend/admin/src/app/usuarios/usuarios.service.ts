import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, throwError, from } from 'rxjs';
import { first, map, catchError, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

import { documentChangeActionToList } from '@shared/functions';
import { UsuarioModel } from '@shared/models';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  static readonly basePath = 'usuarios';

  constructor(private afs: AngularFirestore, private afa: AngularFireAuth) {}

  listenPassageiros = () =>
    this.afs
      .collection(UsuariosService.basePath, ref =>
        ref.orderBy('nome_exibicao', 'asc').where('perfil', '==', 'passageiro')
      )
      .snapshotChanges()
      .pipe(
        map(documentChangeActionToList('uid')),
        catchError(error => throwError(error.message))
      );

  getByUid = (uid: string): Observable<UsuarioModel> =>
    this.afs
      .doc(`${UsuariosService.basePath}/${uid}`)
      .snapshotChanges()
      .pipe<UsuarioModel>(
        first(),
        map(
          (document: any): UsuarioModel => {
            return {
              ...document.payload.data(),
              uid
            };
          }
        ),
        catchError(error => throwError(error.message))
      );

  getAll = () =>
    this.afs
      .collection(UsuariosService.basePath)
      .snapshotChanges()
      .pipe<UsuarioModel[]>(
        first(),
        map(documentChangeActionToList('uid')),
        catchError(error => throwError(error.message))
      );

  getAllPassageiros = () =>
    this.afs
      .collection(UsuariosService.basePath, ref =>
        ref.where('perfil', '==', 'passageiro')
      )
      .snapshotChanges()
      .pipe<UsuarioModel[]>(
        first(),
        map(documentChangeActionToList('uid')),
        catchError(error => throwError(error.message))
      );

  save = (usuario: UsuarioModel): Observable<UsuarioModel> =>
    from(
      this.afs.doc(`${UsuariosService.basePath}/${usuario.uid}`).update(usuario)
    ).pipe(
      switchMap(_ => this.getByUid(usuario.uid)),
      catchError(error => {
        switch (error.code) {
          case 'permission-denied':
            return throwError('Permissão negada!');
          default:
            return throwError(error.message);
        }
      })
    );

  resetPassword = (email: string) =>
    new Observable<any>(observer => {
      this.afa.auth
        .sendPasswordResetEmail(email)
        .then(_ => {
          // sempre retorna sucesso, mesmo qndo ocorre algum erro apos.
          // aguardar um pouco e, se nao gerar erro no timeout indicado,
          // completar request
          setTimeout(() => {
            observer.next();
            observer.complete();
          }, 1500);
        })
        .catch(error => {
          observer.error(error);
        });
    }).pipe(
      catchError(error => {
        switch (error.code) {
          case 'auth/user-not-found':
            return throwError('Não foi encontrado um usuário com este email.');
          default:
            return throwError(error.message);
        }
      })
    );
}
