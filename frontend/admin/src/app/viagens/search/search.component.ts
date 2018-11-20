import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatTableDataSource, MatPaginator } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import * as moment from 'moment';

import { parseFormValueToQueryParams } from '@shared/functions';
import { ViagemModel, UsuarioModel } from '@shared/models';
import { ViagemStatus } from '@shared/types';
import { ShowGlobalSnackBarAction } from '@admin/app.actions';
import { UsuariosState } from '@admin/usuarios/usuarios.state';
import { ViagemCreateDialogComponent } from '@admin/viagem-create-dialog/viagem-create-dialog.component';
import { ConfirmDialogComponent } from '@common/components/confirm-dialog/confirm-dialog.component';
import { ViagemFinalizeDialogComponent } from '@admin/viagem-finalize-dialog/viagem-finalize-dialog.component';
import { SearchViagensAction, CancelViagemAction } from '../viagens.actions';
import { ViagensState } from '../viagens.state';

@Component({
  selector: 'viagens-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  @Select(ViagensState.viagens)
  viagens$: Observable<ViagemModel[]>;
  @Select(ViagensState.loading)
  loading$: Observable<boolean>;
  @Select(ViagensState.waiting)
  waiting$: Observable<boolean>;
  @Select(UsuariosState.usuarios)
  usuarios$: Observable<UsuarioModel[]>;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  destroyed$ = new Subject<boolean>();

  tableHeaders = [
    'origem',
    'destino',
    'data_inicial',
    'data_final',
    'status',
    'taxa_valor',
    'actions'
  ];
  dataSource = new MatTableDataSource<ViagemModel>();

  viagensStatusDescriptions = {
    iniciada: 'Iniciada',
    finalizada: 'Finalizada',
    cancelada: 'Cancelada'
  };

  viagensStatusValuesDescriptions: {
    value: ViagemStatus;
    description: string;
  }[] = [
    {
      value: 'iniciada',
      description: this.viagensStatusDescriptions['iniciada']
    },
    {
      value: 'finalizada',
      description: this.viagensStatusDescriptions['finalizada']
    },
    {
      value: 'cancelada',
      description: this.viagensStatusDescriptions['cancelada']
    }
  ];

  form = this.fb.group({
    data_inicial: null,
    data_final: null,
    usuario_uid: null,
    status: null
  });

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.route.queryParams
      .pipe(takeUntil(this.destroyed$))
      .subscribe(queryParams => {
        this.form.reset();
        this.form.patchValue(queryParams);

        if (Object.values(this.form.value).some(value => value !== null)) {
          this.store.dispatch(
            new SearchViagensAction({
              ...this.form.value,
              data_inicial: this.form.value.data_inicial
                ? moment(this.form.value.data_inicial).toDate()
                : null,
              data_final: this.form.value.data_final
                ? moment(this.form.value.data_final)
                    .add(1, 'days')
                    .toDate()
                : null
            })
          );
        }
      });

    this.waiting$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((loading: boolean) => {
        if (loading) {
          this.form.disable();
        } else {
          this.form.enable();
        }
      });

    this.viagens$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((viagens: ViagemModel[]) => {
        this.dataSource.data = viagens;
      });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
  }

  onAdd() {
    this.dialog
      .open(ViagemCreateDialogComponent)
      .afterClosed()
      .subscribe();
  }

  onSearch() {
    const queryParams = parseFormValueToQueryParams({
      ...this.form.value,
      data_inicial: this.form.value.data_inicial
        ? moment(this.form.value.data_inicial).toISOString()
        : null,
      data_final: this.form.value.data_final
        ? moment(this.form.value.data_final).toISOString()
        : null
    });
    if (Object.keys(queryParams).length) {
      this.store.dispatch(new Navigate(['/viagens'], queryParams));
    } else {
      this.store.dispatch(
        new ShowGlobalSnackBarAction('Preencha pelo menos um campo de filtro!')
      );
    }
  }

  onFinalize(id: string) {
    this.dialog
      .open(ViagemFinalizeDialogComponent, {
        data: { id }
      })
      .afterClosed()
      .subscribe();
  }

  onCancel(id: string) {
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

  canFinalize(viagem: ViagemModel) {
    return viagem.status === 'iniciada';
  }

  canCancel(viagem: ViagemModel) {
    return viagem.status !== 'cancelada';
  }
}
