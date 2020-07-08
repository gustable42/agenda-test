import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contato } from '../interfaces/contato.type';
import { HttpClient } from '@angular/common/http';
import { Api } from '../api';

@Injectable({
  providedIn: 'root'
})
export class ContatosService {
  private _contatosSubject: BehaviorSubject<Contato[]> = new BehaviorSubject([])
  private _contatos: Observable<Contato[]>
  
  public telefones: Set<string>
  public cpfs: Set<string>

  get contatos(): Observable<Contato[]> {
    return this._contatos
  }

  constructor(private http: HttpClient) {
    let contatos = JSON.parse(localStorage.getItem('contatos'))
    if(!contatos) {
      this.http.get(Api.contatos).subscribe((contatosRes: Contato[]) => {
        this._contatosSubject.next(contatosRes);
        this.setUniquePropertiesValidation(contatosRes)
      })
    } else {
      this._contatosSubject = new BehaviorSubject<Contato[]>(contatos);
      this.setUniquePropertiesValidation(contatos)
    }

    this._contatos = this._contatosSubject.asObservable();
  }

  setUniquePropertiesValidation(contatos) {
    this.telefones = new Set(contatos.reduce((acc, curr) => {
      return acc = [...acc, ...curr.telefones]
    }, []))

    this.cpfs = new Set(contatos.reduce((acc, curr) => {
      return acc = [...acc, curr.cpf]
    }, []))
  }

}
