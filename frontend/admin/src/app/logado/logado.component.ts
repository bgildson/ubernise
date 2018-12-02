import { Component, ViewChild } from '@angular/core';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';
import { MatDrawer } from '@angular/material';
import {
  trigger,
  transition,
  query,
  style,
  animate,
  animateChild,
  sequence
} from '@angular/animations';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Store, Select } from '@ngxs/store';

import { UsuarioModel } from '@shared/models';
import { DrawerMode } from '@shared/types';
import { LogoutAction } from '@admin/auth/auth.actions';
import { AuthState } from '@admin/auth/auth.state';

@Component({
  selector: 'logado',
  templateUrl: './logado.component.html',
  styleUrls: ['./logado.component.scss'],
  animations: [
    trigger('routerAnimation', [
      transition('* => *', [
        style({ overflow: 'hidden' }),
        query(
          ':enter > *, :leave > *',
          style({
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }),
          { optional: true }
        ),
        query(':leave > *', style({ opacity: 1 }), {
          optional: true
        }),
        query(
          ':enter > *',
          style({ opacity: 0, transform: 'translateY(10%)' })
        ),
        query(':leave > *', animateChild(), { optional: true }),
        sequence([
          query(
            ':leave > *',
            [
              style({ opacity: 1 }),
              animate('200ms ease-in', style({ opacity: 0 }))
            ],
            { optional: true }
          ),
          query(':enter > *', [
            animate(
              '200ms ease-out',
              style({ opacity: 1, transform: 'translateY(0)' })
            )
          ])
        ]),
        query(':enter > *', animateChild())
      ])
    ])
  ]
})
export class LogadoComponent {
  @ViewChild(MatDrawer)
  drawer: MatDrawer;
  drawerOpen$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  drawerOpenSubscription: Subscription;
  drawerFixed$: Observable<boolean> = this.observableMedia.asObservable().pipe(
    map(
      (mediaChange: MediaChange) =>
        mediaChange.mqAlias != 'xs' && mediaChange.mqAlias != 'sm'
    ),
    tap((fixed: boolean) => {
      this.drawerOpen$.next(fixed);
    })
  );
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

  onMenuItemClicked() {
    // TODO: corrigir listener qndo trocando entre menu fixo e menu sobreposto
    // apos a segunda permuta o listener é quebrado
    this.drawerFixed$.toPromise().then(fixed => {
      if (!fixed) this.drawerOpen$.next(false);
    });
  }

  onDrawerClosedStart() {
    this.drawerOpen$.next(false);
  }

  onSair() {
    this.store.dispatch(new LogoutAction());
  }
}
