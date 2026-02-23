import { createRouter, createWebHistory } from 'vue-router'
import CadastroEmpresa from '../views/CadastroEmpresa.vue'
import ListagemEmpresas from "@/views/ListagemEmpresas.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: CadastroEmpresa
    },
    {
      path: '/listagem',
      component: ListagemEmpresas,
    }
  ]
})

export default router