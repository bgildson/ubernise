import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable, combineLatest } from 'rxjs';
import { Select, Store } from '@ngxs/store';

import { TaxaModel } from '@shared/models';
import { ConfirmDialogComponent } from '@admin/confirm-dialog/confirm-dialog.component';
import { LoadTaxasAction, DeleteTaxaAction } from './taxas.actions';
import { TaxasState } from './taxas.state';
import { TaxaDialogComponent } from './taxa-dialog/taxa-dialog.component';

@Component({
  selector: 'taxas',
  templateUrl: './taxas.component.html',
  styleUrls: ['./taxas.component.scss']
})
export class TaxasComponent {
  @Select(TaxasState.taxas)
  taxas$: Observable<TaxaModel[]>;
  @Select(TaxasState.loading)
  loading$: Observable<boolean>;
  @Select(TaxasState.creating)
  creating$: Observable<boolean>;
  @Select(TaxasState.deleting)
  deleting$: Observable<boolean>;
  waiting$: Observable<boolean> = combineLatest(
    this.creating$,
    this.deleting$,
    (creating, deleting) => creating || deleting
  );

  constructor(private dialog: MatDialog, private store: Store) {}

  ngOnInit() {
    this.store.dispatch(new LoadTaxasAction());
  }

  openTaxaDialog() {
    this.dialog.open(TaxaDialogComponent);
  }

  onDelete(taxa: TaxaModel) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          message: 'Deseja deletar esta taxa?'
        }
      })
      .afterClosed()
      .subscribe(result => {
        if (result) this.store.dispatch(new DeleteTaxaAction(taxa.id));
      });
  }
}
