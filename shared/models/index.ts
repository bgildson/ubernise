export interface BaseEntity<Model> {
  [id: string]: Model;
}

export * from "./carteira.model";
export * from "./configuracao.model";
export * from "./usuario.model";
