import { environment } from "src/environments/environment"

const base: string = environment.mockServerUrl

export namespace Api {
    export const contatos = `${base}contatos`
}