import { Component, Input } from '@angular/core';

@Component({
  selector: 'content-spinner',
  templateUrl: './content-spinner.component.html'
})
export class ContentSpinnerComponent {
  @Input()
  loading = false;
}
