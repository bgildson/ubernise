import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Store, Select, Actions, ofAction } from '@ngxs/store';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import {
  CreateViagemAction,
  CreateViagemSuccessAction
} from '@admin/viagens/viagens.actions';
import { ViagensState } from '@admin/viagens/viagens.state';

@Component({
  selector: 'viagem-create-dialog',
  templateUrl: './viagem-create-dialog.component.html',
  styleUrls: ['./viagem-create-dialog.component.scss']
})
export class ViagemCreateDialogComponent {
  @Select(ViagensState.creating)
  creating$: Observable<boolean>;
  destroyed$ = new Subject<boolean>();

  form: FormGroup = this.fb.group({
    origem: '',
    destino: ''
  });

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private actions$: Actions,
    private dialogRef: MatDialogRef<ViagemCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: { origem; destino }
  ) {
    this.form.patchValue(data);

    this.creating$
      .pipe(
        takeUntil(this.destroyed$),
        tap(creating => {
          if (creating) {
            this.form.disable();
          } else {
            this.form.enable();
          }
        })
      )
      .subscribe();

    this.actions$
      .pipe(
        takeUntil(this.destroyed$),
        ofAction(CreateViagemSuccessAction),
        tap(() => dialogRef.close())
      )
      .subscribe();
  }

  onCreate() {
    this.store.dispatch(new CreateViagemAction(this.form.value));
  }

  onCancel() {
    this.dialogRef.close();
  }
}
