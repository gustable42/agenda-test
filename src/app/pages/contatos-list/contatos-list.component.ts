import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ContatosService } from 'src/app/shared/services/contatos.service';
import { Contato } from 'src/app/shared/interfaces/contato.type';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fromEvent, BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators'
import { DataSource } from '@angular/cdk/table';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-contatos-list',
  templateUrl: './contatos-list.component.html',
  styleUrls: ['./contatos-list.component.css']
})
export class ContatosListComponent implements OnInit {
  public contatos: Contato[] = []
  public contatosDataSource = new MatTableDataSource<any>(null)
  public displayedColumns = ["nome", "cpf", "email", "endereco", "telefone"]
  public searchTerm$: BehaviorSubject<any> = new BehaviorSubject("")

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(private contatosService: ContatosService) { }

  ngOnInit(): void {
    this.contatosService.contatos.subscribe((contatos: Contato[]) => {
      this.contatos = contatos
      console.log(contatos)
      this.contatosDataSource.data = contatos
    })
  }

  ngAfterViewInit() {
    this.searchTerm$.asObservable().pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe(search => {
      if(search == "") {
        this.contatosDataSource.data = this.contatos
        return;
      }
      if (this.contatos) {
        this.contatosDataSource.data = this.contatos.filter((contato: any) => {
          return contato.nome
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(
              search
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
            )
        })
      }
    })
  }

}
