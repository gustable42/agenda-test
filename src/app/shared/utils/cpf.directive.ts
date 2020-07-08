import { AbstractControl, ValidatorFn } from "@angular/forms";
import { ContatosService } from '../services/contatos.service';

export function cpfValidatorDirective(control: AbstractControl): { [key: string]: boolean } | null {
    if(!control.value) return {'naoValidado': true}

    const cpf = control.value
    let cpfValidation = true
    let resto
    let soma = 0
    if (cpf == "00000000000")  cpfValidation = false

    for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto == 10) || (resto == 11))  resto = 0;
    if (resto != parseInt(cpf.substring(9, 10)) ) cpfValidation = false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto == 10) || (resto == 11))  resto = 0;
    if (resto != parseInt(cpf.substring(10, 11) ) ) cpfValidation = false;

    if (!cpfValidation && cpf.length == 11) {
        return { 'cpfInvalido': true };
    }
    
    return null;
}