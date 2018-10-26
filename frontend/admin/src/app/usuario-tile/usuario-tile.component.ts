import { Component, Input } from '@angular/core';
import { UsuarioModel } from '@shared/models';

@Component({
  selector: 'usuario-tile',
  templateUrl: './usuario-tile.component.html',
  styleUrls: ['./usuario-tile.component.scss'],
  host: {
    '(click)': '_click($event)'
  }
})
export class UsuarioTileComponent {
  @Input()
  usuario: UsuarioModel;

  _click($event) {
    console.log('clicked!');
  }
}
