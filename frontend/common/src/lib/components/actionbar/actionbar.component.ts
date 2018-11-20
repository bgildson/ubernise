import { Component } from '@angular/core';

@Component({
  selector: 'actionbar',
  template: `
    <div><ng-content></ng-content></div>
  `,
  host: { class: 'mat-elevation-z2' }
})
export class ActionbarComponent {}
