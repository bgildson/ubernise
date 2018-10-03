import { Component, ViewChild } from '@angular/core';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';
import { MatDrawer } from '@angular/material';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Store, Select } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';

import { UsuarioModel } from '@shared/models';
import { DrawerMode } from '@shared/types';
import { LogoutAction } from '@admin/auth/auth.actions';
import { AuthState } from '@admin/auth/auth.state';

@Component({
  selector: 'logado',
  templateUrl: './logado.component.html',
  styleUrls: ['./logado.component.scss']
})
export class LogadoComponent {
  @ViewChild(MatDrawer)
  drawer: MatDrawer;
  drawerOpen$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  drawerOpenSubscription: Subscription;
  drawerFixed$: Observable<boolean> = this.observableMedia
    .asObservable()
    .pipe<boolean>(
      map(
        (mediaChange: MediaChange) =>
          mediaChange.mqAlias != 'xs' && mediaChange.mqAlias != 'sm'
      ),
      tap((fixed: boolean) => {
        this.drawerOpen$.next(fixed);
      })
    );
  z;
  drawerMode$: Observable<DrawerMode> = this.drawerFixed$.pipe<DrawerMode>(
    map((drawerFixed: boolean) => (drawerFixed ? 'side' : 'over'))
  );
  @Select(AuthState.usuario)
  usuario$: Observable<UsuarioModel>;

  constructor(private store: Store, private observableMedia: ObservableMedia) {}

  ngOnInit() {
    this.drawerOpenSubscription = this.drawerOpen$.subscribe(
      (opened: boolean) => {
        if (opened) {
          this.drawer.open();
        } else {
          this.drawer.close();
        }
      }
    );
  }

  ngOnDestroy() {
    this.drawerOpenSubscription && this.drawerOpenSubscription.unsubscribe();
  }

  onMenuItemClicked(navigateTo: string) {
    // TODO: corrigir listener qndo trocando entre menu fixo e menu sobreposto
    // apos a segunda permuta o listener é quebrado
    this.drawerFixed$.toPromise().then(fixed => {
      if (!fixed) this.drawerOpen$.next(false);
    });
    this.store.dispatch(new Navigate([navigateTo]));
  }

  onDrawerClosedStart() {
    this.drawerOpen$.next(false);
  }

  onSair() {
    this.store.dispatch(new LogoutAction());
  }
}
