import { State } from "@ngxs/store";
import { BaseEntity, CarteiraModel } from "@shared/models";

export interface CarteirasStateModel {
  carteiras: BaseEntity<CarteiraModel>;
  carteirasLoading: boolean;
}

export const defaultState: CarteirasStateModel = {
  carteiras: {},
  carteirasLoading: false
};

@State({
  name: "carteiras",
  defaults: defaultState
})
export class CarteirasState {}
