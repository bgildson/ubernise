import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatDividerModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorIntl,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatToolbarModule,
  MatDialogModule
} from '@angular/material';

export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  itemsPerPageLabel = 'Itens por página';
  previousPageLabel = 'Página anterior';
  nextPageLabel = 'Próxima página';
  firstPageLabel = 'Primeira página';
  lastPageLabel = 'Última página';
  getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length > 0) {
      const firstOfCurrentPage = page * pageSize + 1;
      const lastOfCurrentPage = Math.min(length, page * pageSize + pageSize);
      return `${firstOfCurrentPage} - ${lastOfCurrentPage} de ${length}`;
    }
    return '0 de 0';
  };
}

@NgModule({
  imports: [CommonModule],
  exports: [
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatToolbarModule
  ],
  declarations: [],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }]
})
export class MaterialModule {}
