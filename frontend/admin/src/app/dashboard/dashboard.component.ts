import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store, Select } from '@ngxs/store';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter, mergeMapTo } from 'rxjs/operators';
import { Chart } from 'chart.js';
import * as moment from 'moment';

import { ViagemModel, IndicadorModel } from '@shared/models';
import { ConfirmDialogComponent } from '@common/components/confirm-dialog/confirm-dialog.component';
import {
  LoadRecentsViagensAction,
  CancelViagemAction
} from '@admin/viagens/viagens.actions';
import { ViagensState } from '@admin/viagens/viagens.state';
import { ViagemCreateDialogComponent } from '@admin/viagem-create-dialog/viagem-create-dialog.component';
import { ViagemFinalizeDialogComponent } from '@admin/viagem-finalize-dialog/viagem-finalize-dialog.component';
import { IndicadoresState } from '@admin/indicadores/indicadores.state';

@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @Select(ViagensState.recentsViagens)
  recentsViagens$: Observable<ViagemModel[]>;
  @Select(ViagensState.started)
  viagemStarted$: Observable<ViagemModel>;
  @Select(ViagensState.waiting)
  waiting$: Observable<ViagemModel>;
  @Select(IndicadoresState.indicadores)
  indicadores$: Observable<IndicadorModel[]>;

  @ViewChild('canvas') canvasRef: ElementRef;

  canvasCtx$ = new BehaviorSubject<any>(null);
  canvasCtx;
  chart$: Observable<Chart> = this.indicadores$.pipe(
    filter(v => !!v.length),
    mergeMapTo(
      this.canvasCtx$.pipe(filter(c => !!c)),
      (indicadores, canvasCtx) => {
        const _indicadores = [...indicadores].reverse();
        const labels = _indicadores.map(indicador =>
          moment(indicador.data).format('MMM/YYYY')
        );
        const feitoData = _indicadores.map(indicador => indicador.valor_feito);
        const recebidoData = _indicadores.map(
          indicador => indicador.valor_recebido
        );
        const inadimplenteData = _indicadores.map(
          indicador => indicador.valor_inadimplente
        );

        return new Chart(canvasCtx, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              {
                label: 'Feito',
                data: feitoData,
                borderWidth: 2,
                borderColor: '#ffca6a',
                backgroundColor: '#ffca6aaa',
                hoverBackgroundColor: '#ffca6a',
                fill: false
              },
              {
                label: 'Recebido',
                data: recebidoData,
                borderWidth: 2,
                borderColor: '#7282da',
                backgroundColor: '#7282daaa',
                hoverBackgroundColor: '#7282da',
                fill: false
              },
              {
                label: 'Inadimplente',
                data: inadimplenteData,
                borderWidth: 2,
                borderColor: '#c94940',
                backgroundColor: '#c94940aa',
                hoverBackgroundColor: '#c94940',
                fill: false
              }
            ]
          },
          options: {
            legend: {
              display: true
            },
            scales: {
              xAxes: [
                {
                  display: true
                }
              ],
              yAxes: [
                {
                  display: true,
                  ticks: {
                    beginAtZero: true
                  }
                }
              ]
            },
            responsive: true,
            title: {
              display: true,
              text: 'Feito/Recebido/Inadimplente por Mês'
            }
          }
        });
      }
    )
  );

  constructor(private store: Store, private dialog: MatDialog) {}

  ngOnInit() {
    this.store.dispatch(new LoadRecentsViagensAction());
  }

  ngAfterViewInit() {
    this.canvasCtx$.next(this.canvasRef.nativeElement.getContext('2d'));
    // this.canvasCtx = this.canvasRef.nativeElement.getContext('2d');
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
