import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { ViagemModel } from '@shared/models';
import { LoadRecentsViagensAction } from '@admin/viagens/viagens.actions';
import { ViagensState } from '@admin/viagens/viagens.state';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  @Select(ViagensState.recentsViagens)
  recentsViagens$: Observable<ViagemModel[]>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(new LoadRecentsViagensAction());
  }
}
