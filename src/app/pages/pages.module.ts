import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContatosListComponent } from './contatos-list/contatos-list.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask'

import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { ContatoComponent } from './contato/contato.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [ContatosListComponent, ContatoComponent],
  exports: [ContatosListComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatGridListModule,
    MatDialogModule,
    MatIconModule,
    MatChipsModule,
    MatToolbarModule
  ],
  providers: [HttpClientModule]
})
export class PagesModule { }
