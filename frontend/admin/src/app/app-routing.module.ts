import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "./auth/auth.guard";
import { LogadoComponent } from "./logado/logado.component";

const routes: Routes = [
  {
    path: "",
    component: LogadoComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "carteiras",
        loadChildren: "./carteiras/carteiras.module#CarteirasModule"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
