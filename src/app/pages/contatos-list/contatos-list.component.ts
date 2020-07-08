import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ContatosService } from 'src/app/shared/services/contatos.service';
import { Contato } from 'src/app/shared/interfaces/contato.type';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { cpfValidatorDirective } from 'src/app/shared/utils/cpf.directive';
import { MatDialog } from '@angular/material/dialog';
import { showContato } from '../contato/contato'
import { HttpClient } from '@angular/common/http';
import { Api } from 'src/app/shared/api';

@Component({
  selector: 'app-contatos-list',
  templateUrl: './contatos-list.component.html',
  styleUrls: ['./contatos-list.component.scss']
})
export class ContatosListComponent implements OnInit {
  public contatos: Contato[] = []
  public contatoEscolhido: FormGroup
  public contatosDataSource = new MatTableDataSource<any>(null)
  public displayedColumns = ["nome", "cpf", "email", "endereco", "telefone", "acoes"]
  public searchTerm$: BehaviorSubject<any> = new BehaviorSubject("")

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(
    public contatosService: ContatosService, 
    private fb: FormBuilder,
    private http: HttpClient,
    public dialog: MatDialog) 
  {
    this.contatoEscolhido = this.fb.group({
      id: [null],
      nome: [null, Validators.required],
      cpf: [null, [Validators.required, cpfValidatorDirective]],
      endereco: this.fb.group({
        cep: [null, Validators.required],
        estado: [null, Validators.required],
        cidade: [null, Validators.required],
        logradouro: [null, Validators.required],
        numero: [null, Validators.required]
      }),
      telefones: this.fb.array([]),
      email: [null, [Validators.required, Validators.email]]
    })
  }

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

  deleteContato(id) {
    this.http.delete(`${Api.contatos}/${id}`).subscribe(data => {
      console.log(data)
    })
  }

  openDialog(contato = null) {
    this.contatoEscolhido.patchValue({
      id: !contato ? null : contato.id,
      nome: !contato ? null : contato.nome,
      cpf: !contato ? null : contato.cpf,
      endereco: {
        cep: !contato ? null : contato.endereco.cep,
        estado: !contato ? null : contato.endereco.estado,
        cidade: !contato ? null : contato.endereco.cidade,
        logradouro: !contato ? null : contato.endereco.logradouro,
        numero: !contato ? null : contato.endereco.numero
      },
      telefones: [],
      email: !contato ? null : contato.email
    })

    this.contatoEscolhido.controls.telefones = this.fb.array([])

    if(contato && contato.telefones) {
      contato.telefones.forEach(telefone => {
        (this.contatoEscolhido.get('telefones') as FormArray).push(new FormControl(telefone))
      })
    }

    showContato(this.dialog, this.contatoEscolhido)
  }

}
