import { Component, Input, Output, EventEmitter } from '@angular/core';

import { TaxaModel } from '@shared/models';

@Component({
  selector: 'taxa',
  templateUrl: './taxa.component.html',
  styleUrls: ['./taxa.component.scss']
})
export class TaxaComponent {
  @Input()
  taxa: TaxaModel;
  @Input()
  showDeleteButton: boolean;
  @Input()
  deleteButtonDisabled: boolean;
  @Output()
  delete = new EventEmitter();
}
