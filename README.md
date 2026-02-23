## Portal de serviço ST [Cadastro de Empresa] (Frontend)

Frontend desenvolvido em Typescript com Vue.js para o Portal ST de Cadastro de Empresas.

Tecnologias que foram utilizadas
* Typescript
* Vue.js
* Vue router
* Axios
* Bootstrap

---
Para rodar a aplicação
`npm install`
`npm run dev`

Obs: 
- O backend tem que estar rodando em http://localhost:8080
- O Frontend estará disponível em http://localhost:5173

## Rotas
* `/login` - Autenticação com certificado digital (.pfx/.p12)
* `/` - Cadastro de empresa
* `/listagem` - Listagem, aprovação e reprovação de empresas


Obs: A pré-condiçao "O ator deve estar logado com o certificado digital para prosseguir com esta ação." Foi feita diretamente no Frontend. recebendo apenas formatos de certificados digitais .pfx,.p12.

Os fluxos de exceção `[FE01]`, `[FE02]`, `[FE03]`, `[FE04]`, `[FE05]`, `[FE07]`, `[FE08]`, `[FE09]`, `[FE10]` e `[FE11]` foram tratados na view `CadastroEmpresa.vue`.
