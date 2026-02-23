import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8080/api'
})

export interface Empresa {
    id?: number
    nomeFantasia: string
    tipoPessoa: 'JURIDICA' | 'FISICA' | 'ESTRANGEIRA'
    perfil: 'DESPACHANTE' | 'BENEFICIARIO' | 'CONSIGNATARIO' | 'ARMADOR' | 'AGENTE_DE_CARGA' | 'TRANSPORTADORA'
    razaoSocial?: string
    cnpj?: string
    cpf?: string
    identificadorEstrangeiro?: string
    faturamentoDireto: boolean
    status?: 'PENDENTE' | 'APROVADO' | 'REPROVADO'
}

export const empresaService = {
    cadastrar: (empresa: Empresa, usuarioInterno: boolean) =>
        api.post(`/empresas?usuarioInterno=${usuarioInterno}`, empresa),

    listarTodas: () =>
        api.get<Empresa[]>('/empresas'),

    listarPendentes: () =>
        api.get<Empresa[]>('/empresas/pendentes'),

    aprovar: (id: number) =>
        api.put(`/empresas/${id}/aprovar`),

    reprovar: (id: number) =>
        api.put(`/empresas/${id}/reprovar`)
}