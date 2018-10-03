import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable, from, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthService {
  constructor(private afa: AngularFireAuth) {}

  get uid(): string {
    if (this.afa.auth.currentUser) return this.afa.auth.currentUser.uid;
    return null;
  }

  get email(): string {
    return this.afa.auth.currentUser.email;
  }

  entrar(email, senha): Observable<firebase.auth.UserCredential> {
    return from(this.afa.auth.signInWithEmailAndPassword(email, senha)).pipe(
      catchError(error => {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            return throwError('Usuário ou Senha incorreto!');
          case 'auth/invalid-email':
            return throwError('O email está mal formatado!');
          default:
            return throwError(error.message);
        }
      })
    );
  }

  sair(): Observable<any> {
    return from(this.afa.auth.signOut());
  }
}
