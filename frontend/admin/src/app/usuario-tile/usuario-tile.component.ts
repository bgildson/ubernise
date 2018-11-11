import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core';
import { UsuarioModel } from '@shared/models';

@Component({
  selector: 'usuario-tile',
  templateUrl: './usuario-tile.component.html',
  styleUrls: ['./usuario-tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsuarioTileComponent {
  @Input()
  canToggle: boolean = true;
  @Input()
  disabled: boolean = false;
  @Input()
  selected: boolean = false;
  @Input()
  usuario: UsuarioModel;
  @Output()
  toggle = new EventEmitter<boolean>();

  onToggle() {
    if (this.canToggle && !this.disabled)
      this.toggle.emit((this.selected = !this.selected));
  }
}
