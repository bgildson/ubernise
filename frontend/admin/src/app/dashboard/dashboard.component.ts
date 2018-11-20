import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { ViagemModel } from '@shared/models';
import { ConfirmDialogComponent } from '@common/components/confirm-dialog/confirm-dialog.component';
import {
  LoadRecentsViagensAction,
  CancelViagemAction
} from '@admin/viagens/viagens.actions';
import { ViagensState } from '@admin/viagens/viagens.state';
import { ViagemCreateDialogComponent } from '@admin/viagem-create-dialog/viagem-create-dialog.component';
import { ViagemFinalizeDialogComponent } from '@admin/viagem-finalize-dialog/viagem-finalize-dialog.component';

@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  @Select(ViagensState.recentsViagens)
  recentsViagens$: Observable<ViagemModel[]>;
  @Select(ViagensState.started)
  viagemStarted$: Observable<ViagemModel>;
  @Select(ViagensState.waiting)
  waiting$: Observable<ViagemModel>;

  constructor(private store: Store, private dialog: MatDialog) {}

  ngOnInit() {
    this.store.dispatch(new LoadRecentsViagensAction());
  }

  onViagemCreate() {
    this.dialog
      .open(ViagemCreateDialogComponent)
      .afterClosed()
      .subscribe();
  }

  onViagemStartedCancel(id) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          message: 'Deseja cancelar esta viagem?'
        }
      })
      .afterClosed()
      .subscribe(result => {
        if (result) this.store.dispatch(new CancelViagemAction(id));
      });
  }

  onViagemStartedFinalize(id) {
    this.dialog
      .open(ViagemFinalizeDialogComponent, {
        data: { id }
      })
      .afterClosed()
      .subscribe();
  }
}
