import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TaxasComponent } from './taxas.component';

export const routes: Routes = [{ path: '', component: TaxasComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxasRoutingModule {}
