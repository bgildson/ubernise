import { Component } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { CarteiraModel } from '@shared/models';
import { CarteirasState } from './carteiras.state';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { LoadCarteirasAction } from './carteiras.actions';
import { AdicionarCreditoDialogComponent } from './adicionar-credito-dialog/adicionar-credito-dialog.component';
import { HistoricoDialogComponent } from './historico-dialog/historico-dialog.component';

@Component({
  selector: 'carteiras',
  templateUrl: './carteiras.component.html',
  styleUrls: ['./carteiras.component.scss']
})
export class CarteirasComponent {
  @Select(CarteirasState.loading)
  loading$: Observable<CarteiraModel[]>;
  @Select(CarteirasState.carteiras)
  carteiras$: Observable<CarteiraModel[]>;
  carteirasSubscription: Subscription;

  tableHeaders = ['usuario', 'saldo', 'actions'];
  dataSource = new MatTableDataSource<CarteiraModel>();

  constructor(private store: Store, private dialog: MatDialog) {
    this.carteirasSubscription = this.carteiras$.subscribe(
      carteiras => (this.dataSource.data = carteiras)
    );
  }

  ngOnInit() {
    this.store.dispatch(new LoadCarteirasAction());
  }

  onVerHistorico(usuarioUid: string) {
    this.dialog.open(HistoricoDialogComponent, {
      data: { usuario_uid: usuarioUid }
    });
  }

  onAdicionarCredito(usuarioUid: string) {
    this.dialog.open(AdicionarCreditoDialogComponent, {
      data: { usuario_uid: usuarioUid }
    });
  }
}
