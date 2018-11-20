import { Component, Input } from '@angular/core';

@Component({
  selector: 'breadcrumb',
  templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbComponent {
  @Input()
  title: string;
}
