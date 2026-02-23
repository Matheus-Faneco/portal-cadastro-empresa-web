<template>
  <div class="container mt-4">
    <h2>Empresas Cadastradas</h2>

    <Modal :visivel="modalVisivel" :titulo="modalTitulo" :mensagem="modalMensagem" @fechar="modalVisivel = false" />

    <div class="mb-3">
      <button class="btn btn-outline-primary" @click="listarTodas">Todas</button>
      <button class="btn btn-outline-warning" @click="listarPendentes">Pendentes</button>
    </div>

    <table class="table table-bordered table-hover">
      <thead class="table-dark">
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
        <td>
            <span :class="{
              'badge bg-warning': empresa.status === 'PENDENTE',
              'badge bg-success': empresa.status === 'APROVADO',
              'badge bg-danger': empresa.status === 'REPROVADO'
            }">{{ empresa.status }}</span>
        </td>
        <td>
          <button v-if="empresa.status === 'PENDENTE'" class="btn btn-sm btn-success me-2" @click="aprovar(empresa.id!)">Aprovar</button>
          <button v-if="empresa.status === 'PENDENTE'" class="btn btn-sm btn-danger" @click="reprovar(empresa.id!)">Reprovar</button>
        </td>
      </tr>
      </tbody>
    </table>

    <p v-if="empresas.length === 0" class="text-muted">Nenhuma empresa encontrada.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { empresaService, type Empresa } from '../services/empresaService'
import Modal from '../components/Modal.vue'

const empresas = ref<Empresa[]>([])
const modalVisivel = ref(false)
const modalTitulo = ref('')
const modalMensagem = ref('')

const exibirModal = (titulo: string, mensagem: string) => {
  modalTitulo.value = titulo
  modalMensagem.value = mensagem
  modalVisivel.value = true
}

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
  exibirModal('Sucesso', 'Empresa aprovada com sucesso')
  listarTodas()
}

const reprovar = async (id: number) => {
  await empresaService.reprovar(id)
  exibirModal('Sucesso', 'Empresa reprovada com sucesso')
  listarTodas()
}

onMounted(() => listarTodas())
</script>