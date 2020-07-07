export interface Contato {
    id: number;
    nome: string;
    cpf: string;
    endereco: {
        cep: string;
        cidade: string;
        estado: string;
        logradouro: string;
        numero: number
    };
    telefones: string[];
    email: string
}