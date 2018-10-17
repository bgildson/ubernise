import { BaseEntity } from './base-entity';

export class BaseStateModel<Model> {
  entities: BaseEntity<Model>;
  loading: boolean;
  ordenation: any[];
}
