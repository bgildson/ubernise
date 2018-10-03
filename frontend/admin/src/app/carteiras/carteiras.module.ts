import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxsModule } from "@ngxs/store";

import { CarteirasRoutingModule } from "./carteiras-routing.module";
import { CarteirasComponent } from "./carteiras.component";
import { CarteirasState } from "./carteiras.state";

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([CarteirasState]),
    CarteirasRoutingModule
  ],
  declarations: [CarteirasComponent]
})
export class CarteirasModule {}
