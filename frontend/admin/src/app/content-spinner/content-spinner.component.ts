import { Component, Input } from '@angular/core';

@Component({
  selector: 'content-spinner',
  templateUrl: './content-spinner.component.html',
  styleUrls: ['./content-spinner.component.scss']
})
export class ContentSpinnerComponent {
  @Input()
  loading = false;
}
