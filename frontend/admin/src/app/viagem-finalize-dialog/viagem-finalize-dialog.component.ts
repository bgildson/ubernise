import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { Store, Actions, ofAction, Select } from '@ngxs/store';
import { Subject, Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import {
  FinalizeViagemSuccessAction,
  FinalizeViagemAction
} from '@admin/viagens/viagens.actions';
import { ShowGlobalSnackBarAction } from '@admin/app.actions';
import { ViagensState } from '@admin/viagens/viagens.state';
import { UsuariosState } from '@admin/usuarios/usuarios.state';
import { UsuarioModel } from '@shared/models';

export const hasPassageiros = control =>
  control.value.length > 0
    ? null
    : {
        hasNoPassageiros: 'Selecione, pelo menos, um passageiro!'
      };

@Component({
  selector: 'viagem-finalize-dialog',
  templateUrl: './viagem-finalize-dialog.component.html',
  styleUrls: ['./viagem-finalize-dialog.component.scss']
})
export class ViagemFinalizeDialogComponent implements OnInit, OnDestroy {
  @Select(ViagensState.finalizing)
  finalizing$: Observable<boolean>;
  @Select(UsuariosState.usuarios)
  passageiros$: Observable<UsuarioModel[]>;

  destroyed$ = new Subject();

  form = this.fb.group({
    id: ['', Validators.required],
    passageiros: [[], hasPassageiros]
  });

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private actions$: Actions,
    private dialogRef: MatDialogRef<ViagemFinalizeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id }
  ) {}

  ngOnInit() {
    this.form.patchValue(this.data);
    this.actions$
      .pipe(
        ofAction(FinalizeViagemSuccessAction),
        takeUntil(this.destroyed$),
        tap(() => this.dialogRef.close())
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

  onFinalize() {
    if (this.form.valid) {
      this.store.dispatch(new FinalizeViagemAction(this.form.value));
    } else {
      this.store.dispatch(
        new ShowGlobalSnackBarAction(
          this.form.controls.passageiros.getError('hasNoPassageiros')
        )
      );
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  updatePassageiros({ uid }: UsuarioModel, selected: boolean) {
    const { passageiros } = this.form.value;
    this.form.patchValue({
      passageiros: selected
        ? [uid, ...passageiros]
        : passageiros.filter((passageiro: string) => passageiro !== uid)
    });
  }
}
