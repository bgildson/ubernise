import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CarteirasComponent } from "./carteiras.component";

export const routes: Routes = [{ path: "", component: CarteirasComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarteirasRoutingModule {}
