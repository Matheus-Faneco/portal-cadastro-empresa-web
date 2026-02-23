<template>
  <div class="container">
    <h1>Empresas Cadastradas</h1>

    <div>
      <button @click="listarTodas">Todas</button>
      <button @click="listarPendentes">Pendentes</button>
    </div>

    <table>
      <thead>
      <tr>
        <th>Nome Fantasia</th>
        <th>Tipo</th>
        <th>Perfil</th>
        <th>Status</th>
        <th>Ações</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="empresa in empresas" :key="empresa.id">
        <td>{{ empresa.nomeFantasia }}</td>
        <td>{{ empresa.tipoPessoa }}</td>
        <td>{{ empresa.perfil }}</td>
        <td>{{ empresa.status }}</td>
        <td>
          <button
              v-if="empresa.status === 'PENDENTE'"
              @click="aprovar(empresa.id!)">
            Aprovar
          </button>
          <button
              v-if="empresa.status === 'PENDENTE'"
              @click="reprovar(empresa.id!)">
            Reprovar
          </button>
        </td>
      </tr>
      </tbody>
    </table>

    <p v-if="empresas.length === 0">Nenhuma empresa encontrada.</p>
    <p v-if="mensagem">{{ mensagem }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { empresaService, type Empresa } from '../services/empresaService'

const empresas = ref<Empresa[]>([])
const mensagem = ref('')

const listarTodas = async () => {
  const response = await empresaService.listarTodas()
  empresas.value = response.data
}

const listarPendentes = async () => {
  const response = await empresaService.listarPendentes()
  empresas.value = response.data
}

const aprovar = async (id: number) => {
  await empresaService.aprovar(id)
  mensagem.value = 'Empresa aprovada com sucesso!'
  listarTodas()
}

const reprovar = async (id: number) => {
  await empresaService.reprovar(id)
  mensagem.value = 'Empresa reprovada com sucesso!'
  listarTodas()
}

onMounted(() => listarTodas())
</script>