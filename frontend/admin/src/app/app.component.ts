import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { Actions, ofAction } from '@ngxs/store';

import { ShowGlobalSnackBarAction } from './app.actions';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {
  showGlobalSnackBarSubscription: Subscription;

  constructor(private actions$: Actions, private snackBar: MatSnackBar) {
    this.showGlobalSnackBarSubscription = this.actions$
      .pipe(ofAction(ShowGlobalSnackBarAction))
      .subscribe((action: ShowGlobalSnackBarAction) => {
        this.snackBar.open(action.message, null, action.config);
      });
  }

  ngOnDestroy() {
    this.showGlobalSnackBarSubscription &&
      this.showGlobalSnackBarSubscription.unsubscribe();
  }
}
