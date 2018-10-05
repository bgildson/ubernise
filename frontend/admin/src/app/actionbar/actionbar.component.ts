import { Component } from '@angular/core';

@Component({
  selector: 'actionbar',
  template: `<div><ng-content></ng-content></div>`,
  styleUrls: ['./actionbar.component.scss']
})
export class ActionbarComponent {}
