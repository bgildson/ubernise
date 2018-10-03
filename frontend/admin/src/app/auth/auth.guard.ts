import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';

import { AuthState } from '@admin/auth/auth.state';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store) {}

  canActivate() {
    const uid = this.store.selectSnapshot(AuthState.usuarioUid);
    if (!uid) this.store.dispatch(new Navigate(['/login']));
    return !!uid;
  }
}
