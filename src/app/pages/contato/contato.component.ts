import { Component, OnInit, Input, OnChanges, ChangeDetectionStrategy, SimpleChange, SimpleChanges, Inject } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { ContatosService } from 'src/app/shared/services/contatos.service';
import { HttpClient } from '@angular/common/http';
import { Api } from 'src/app/shared/api';
import { BehaviorSubject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {
  contato: FormGroup
  dialog: MatDialog

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  public math = Math
  public currentTelefone

  public telefoneCadastrado = false
  public cpfCadastrado = false
  public nenhumTelefoneCadastrado = false
  public cepInvalido = false

  public cep$ = new BehaviorSubject(null)
  
  public cpfBeforeChange
  public telefonesBeforeChange

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private contatosService: ContatosService,
    private http: HttpClient
  ) {
    this.contato = data.contato
    this.dialog = data.dialog

    this.cpfBeforeChange = this.contato.controls.cpf.value
    this.telefonesBeforeChange = this.contato.controls.telefones.value
  }

  ngOnInit(): void {
    this.cep$.asObservable().pipe(
      mergeMap(cep => {
        this.cepInvalido = false
        if(!cep || cep.replace(/\.|-/g, '').length < 8) return of(null);
        return this.http.get(`https://cors-anywhere.herokuapp.com/http://viacep.com.br/ws/${cep.replace(/\.|-/g, '')}/json/`)
      })
    ).subscribe(cep => {
      if(!cep) return;
      this.contato.patchValue({
        endereco: {
          cidade: cep.localidade,
          estado: cep.uf,
          logradouro: `${cep.bairro}, ${cep.logradouro}`
        }
      })
    }, error => {
      this.cepInvalido = true
    })
  }

  remove(idx, telefone) {
    (this.contato.get('telefones') as FormArray).removeAt(idx)
    this.contatosService.telefones.delete(telefone)
  }

  add(ev) {
    ev = ev.replace(/\.|-|\(|\)|\s/g, '')
    this.telefoneCadastrado = false
    if(this.contatosService.telefones.has(ev)) {
      this.telefoneCadastrado = true
    } else {
      console.log(this.contato.get('telefones').value);
      (this.contato.get('telefones') as FormArray).push(new FormControl(ev))
      this.contatosService.telefones.add(ev)
      console.log(this.contato.get('telefones').value);
      this.currentTelefone = ""
    }
  }

  checkCpf() {
    const cpf = this.contato.controls.cpf.value
    if(this.contatosService.cpfs.has(cpf) && (cpf != this.cpfBeforeChange))
      this.cpfCadastrado = true
    else
    this.cpfCadastrado = false
  }

  sendForm() {
    if((this.contato.get("telefones") as FormArray).value.length == 0) {
      console.log('aaa')
      this.nenhumTelefoneCadastrado = true
      return;
    }
    if(!this.contato.valid) return;

    this.nenhumTelefoneCadastrado = false

    const body = this.contato.value
    body.telefones = this.contato.get("telefones").value

    const contato$ = (this.contato.value.id) ? 
      this.http.patch(`${Api.contatos}/${this.contato.value.id}`, body) :
      this.http.post(Api.contatos, body)

    contato$.subscribe(data => {
      console.log(data)
    })

  }

}
