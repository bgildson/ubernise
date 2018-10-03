import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Store, Select } from '@ngxs/store';

import { LoginAction } from '../auth.actions';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  @Select(state => state.auth.loginLoading)
  loginLoading$: Observable<boolean>;
  loginLoadingSubscription: Subscription;

  form: FormGroup = this.fb.group({
    email: ['', Validators.required],
    senha: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private store: Store) {
    this.loginLoadingSubscription = this.loginLoading$.subscribe(
      loginLoading => {
        if (loginLoading) {
          this.form.disable();
        } else {
          this.form.enable();
        }
      }
    );
  }

  ngOnDestroy() {
    this.loginLoadingSubscription &&
      this.loginLoadingSubscription.unsubscribe();
  }

  onEntrar() {
    if (this.form.invalid) return;
    const { email, senha } = this.form.value;
    this.store.dispatch(new LoginAction(email, senha));
  }
}
