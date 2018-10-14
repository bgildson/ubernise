import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store, Select, Actions, ofAction } from '@ngxs/store';
import { CreateTaxaAction, CreateTaxaSuccessAction } from '../taxas.actions';
import { Observable, Subscription } from 'rxjs';
import { TaxasState } from '../taxas.state';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'taxa-dialog',
  templateUrl: './taxa-dialog.component.html',
  styleUrls: ['./taxa-dialog.component.scss']
})
export class TaxaDialogComponent {
  @Select(TaxasState.creating)
  creating$: Observable<boolean>;
  creatingSubscription: Subscription;
  createTaxaSuccess$: Observable<any> = this.actions$.pipe(
    ofAction(CreateTaxaSuccessAction)
  );
  createTaxaSuccessSubscription: Subscription;

  form = this.fb.group({
    data_inicial: null,
    valor: 0
  });

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private actions$: Actions,
    private dialogRef: MatDialogRef<TaxaDialogComponent>
  ) {}

  ngOnInit() {
    this.creatingSubscription = this.creating$.subscribe(creating => {
      if (creating) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    });
    this.createTaxaSuccessSubscription = this.createTaxaSuccess$.subscribe(
      () => {
        this.dialogRef.close();
      }
    );
  }

  ngOnDestroy() {
    this.creatingSubscription && this.creatingSubscription.unsubscribe();
    this.createTaxaSuccessSubscription &&
      this.createTaxaSuccessSubscription.unsubscribe();
  }

  onCreate() {
    if (this.form.valid)
      this.store.dispatch(
        new CreateTaxaAction({
          ...this.form.value,
          data_inicial: this.form.value.data_inicial.toString()
        })
      );
  }
}
