import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store, Select, Actions, ofAction } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';

import {
  AdicionarCreditoAction,
  AdicionarCreditoSuccessAction
} from '../carteiras.actions';
import { CarteirasState } from '../carteiras.state';

@Component({
  selector: 'adicionar-credito-dialog',
  templateUrl: './adicionar-credito-dialog.component.html',
  styleUrls: ['./adicionar-credito-dialog.component.scss']
})
export class AdicionarCreditoDialogComponent {
  @Select(CarteirasState.adicionandoCredito)
  adicionandoCredito$: Observable<boolean>;
  adicionandoCreditoSubscription: Subscription;
  adicionarCreditoSuccessSubscription: Subscription;

  form = this.fb.group({
    usuario_uid: null,
    valor: 0
  });

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private actions$: Actions,
    private dialogRef: MatDialogRef<AdicionarCreditoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private dialogData: { usuario_uid }
  ) {}

  ngOnInit() {
    this.form.patchValue(this.dialogData);
    this.adicionandoCreditoSubscription = this.adicionandoCredito$.subscribe(
      adicionandoCredito => {
        if (adicionandoCredito) {
          this.form.disable();
        } else {
          this.form.enable();
        }
      }
    );
    this.adicionarCreditoSuccessSubscription = this.actions$
      .pipe(ofAction(AdicionarCreditoSuccessAction))
      .subscribe(() => this.dialogRef.close());
  }

  ngOnDestroy() {
    this.adicionandoCreditoSubscription &&
      this.adicionandoCreditoSubscription.unsubscribe();
    this.adicionarCreditoSuccessSubscription &&
      this.adicionarCreditoSuccessSubscription.unsubscribe();
  }

  onAdicionar() {
    this.store.dispatch(new AdicionarCreditoAction(this.form.value));
  }
}
