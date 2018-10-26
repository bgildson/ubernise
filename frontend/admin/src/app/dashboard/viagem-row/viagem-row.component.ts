import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

import { ViagemModel } from '@shared/models';
import { ViagemStatus } from '@shared/types';

@Component({
  selector: 'viagem-row',
  templateUrl: './viagem-row.component.html',
  styleUrls: ['./viagem-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViagemRowComponent implements OnInit {
  @Input()
  viagem: ViagemModel;

  viagemStatusDescriptions = {
    aguardando: 'Aguardando',
    iniciada: 'Iniciada',
    finalizada: 'Finalizada',
    cancelada: 'Cancelada'
  };

  viagens: ViagemModel[] = [
    {
      origem: 'Avance',
      destino: 'Casa',
      taxa_id: '',
      taxa_valor: 0,
      data_agendamento: new Date(2018, 10, 19, 18),
      data_inicio: new Date(2018, 10, 19, 18, 10),
      data_fim: new Date(2018, 10, 19, 18, 35),
      status: 'finalizada',
      passageiros: []
    },
    {
      origem: 'Casa',
      destino: 'Avance',
      taxa_id: '',
      taxa_valor: 0,
      data_agendamento: new Date(2018, 10, 19, 7),
      data_inicio: new Date(2018, 10, 19, 7, 15),
      data_fim: new Date(2018, 10, 19, 7, 45),
      status: 'finalizada',
      passageiros: []
    },
    {
      origem: 'Casa',
      destino: 'Avance',
      taxa_id: '',
      taxa_valor: 0,
      data_agendamento: new Date(2018, 10, 18, 7),
      data_inicio: new Date(2018, 10, 18, 7, 15),
      data_fim: new Date(2018, 10, 18, 7, 45),
      status: 'finalizada',
      passageiros: []
    },
    {
      origem: 'Avance',
      destino: 'Casa',
      taxa_id: '',
      taxa_valor: 0,
      data_agendamento: new Date(2018, 10, 18, 7),
      data_inicio: new Date(2018, 10, 18, 7, 15),
      data_fim: new Date(2018, 10, 18, 7, 45),
      status: 'finalizada',
      passageiros: []
    },
    {
      origem: 'Casa',
      destino: 'Avance',
      taxa_id: '',
      taxa_valor: 0,
      data_agendamento: new Date(2018, 10, 17, 7),
      data_inicio: new Date(2018, 10, 17, 7, 15),
      data_fim: new Date(2018, 10, 17, 7, 45),
      status: 'finalizada',
      passageiros: [
        {
          nome_exibicao: 'bgildson',
          imagem_url:
            'https://firebasestorage.googleapis.com/v0/b/ubernisee.appspot.com/o/images%2Fusuarios%2F8fqyVT0y4FVGBhNjnblEHuou0zr1.jpeg?alt=media'
        },
        {
          nome_exibicao: 'Moisés Abraão',
          imagem_url:
            'https://firebasestorage.googleapis.com/v0/b/ubernisee.appspot.com/o/images%2Fusuarios%2FsP3SiVwwFRe6GIYnwO9NeUVg6JS2.jpeg?alt=media'
        },
        {
          nome_exibicao: 'Moisés Abraão',
          imagem_url:
            'https://firebasestorage.googleapis.com/v0/b/ubernisee.appspot.com/o/images%2Fusuarios%2FsP3SiVwwFRe6GIYnwO9NeUVg6JS2.jpeg?alt=media'
        },
        {
          nome_exibicao: 'Moisés Abraão',
          imagem_url:
            'https://firebasestorage.googleapis.com/v0/b/ubernisee.appspot.com/o/images%2Fusuarios%2FsP3SiVwwFRe6GIYnwO9NeUVg6JS2.jpeg?alt=media'
        },
        {
          nome_exibicao: 'Moisés Abraão',
          imagem_url:
            'https://firebasestorage.googleapis.com/v0/b/ubernisee.appspot.com/o/images%2Fusuarios%2FsP3SiVwwFRe6GIYnwO9NeUVg6JS2.jpeg?alt=media'
        }
      ]
    }
  ];

  constructor() {}

  ngOnInit() {}
}
