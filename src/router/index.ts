import { createRouter, createWebHistory } from 'vue-router'
import CadastroEmpresa from '../views/CadastroEmpresa.vue'
import ListagemEmpresas from "@/views/ListagemEmpresas.vue";
import Login from '../views/Login.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: Login },
    { path: '/', component: CadastroEmpresa, meta: { requerLogin: true } },
    { path: '/listagem', component: ListagemEmpresas, meta: { requerLogin: true } }
  ]
})

router.beforeEach((to, _, next) => {
  const usuario = localStorage.getItem('usuario')
  if (to.meta.requerLogin && !usuario) {
    next('/login')
  } else {
    next()
  }
})

export default router