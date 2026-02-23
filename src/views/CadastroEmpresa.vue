<template>
  <div class="container mt-4">
    <h2 class="mb-4">Cadastro de Empresa</h2>

    <Modal :visivel="modalVisivel" :titulo="modalTitulo" :mensagem="modalMensagem" @fechar="modalVisivel = false" />

    <form @submit.prevent="cadastrar">

      <div class="mb-3">
        <label class="form-label">Tipo de Pessoa</label>
        <select class="form-select" v-model="empresa.tipoPessoa" @change="limparCampos">
          <option value="JURIDICA">Jurídica</option>
          <option value="FISICA">Física</option>
          <option value="ESTRANGEIRA">Estrangeira</option>
        </select>
      </div>

      <div class="mb-3" v-if="empresa.tipoPessoa === 'JURIDICA'">
        <input class="form-control mb-2" v-model="empresa.razaoSocial" placeholder="Razão Social" />
        <input class="form-control" v-model="empresa.cnpj" placeholder="CNPJ (14 dígitos)" maxlength="14" />
      </div>

      <div class="mb-3" v-if="empresa.tipoPessoa === 'FISICA'">
        <input class="form-control mb-2" v-model="empresa.razaoSocial" placeholder="Nome" />
        <input class="form-control" v-model="empresa.cpf" placeholder="CPF (11 dígitos)" maxlength="11" />
      </div>

      <div class="mb-3" v-if="empresa.tipoPessoa === 'ESTRANGEIRA'">
        <input class="form-control mb-2" v-model="empresa.razaoSocial" placeholder="Razão Social" />
        <input class="form-control" v-model="empresa.identificadorEstrangeiro" placeholder="Identificador Estrangeiro" />
      </div>

      <div class="mb-3">
        <input class="form-control" v-model="empresa.nomeFantasia" placeholder="Nome Fantasia" />
      </div>

      <div class="mb-3">
        <select class="form-select" v-model="empresa.perfil">
          <option value="">Selecione um perfil</option>
          <option value="DESPACHANTE">Despachante</option>
          <option value="BENEFICIARIO">Beneficiário</option>
          <option value="CONSIGNATARIO">Consignatário</option>
          <option value="ARMADOR">Armador</option>
          <option value="AGENTE_DE_CARGA">Agente de Carga</option>
          <option value="TRANSPORTADORA">Transportadora</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Documento Obrigatório</label>
        <input class="form-control" type="file" @change="selecionarDocumento" accept=".pdf,.png,.jpg,.jpeg" />
      </div>

      <div class="mb-3">
        <label class="form-label">Documento Opcional</label>
        <input class="form-control" type="file" @change="selecionarDocumentoOpcional" accept=".pdf,.png,.jpg,.jpeg" />
      </div>

      <div class="form-check mb-2">
        <input class="form-check-input" type="checkbox" v-model="empresa.faturamentoDireto" />
        <label class="form-check-label">Faturamento Direto</label>
      </div>

      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" v-model="usuarioInterno" />
        <label class="form-check-label">Sou Usuário Interno</label>
      </div>

      <button class="btn btn-primary w-100" type="submit">Cadastrar</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { empresaService, type Empresa } from '../services/empresaService'
import Modal from '../components/Modal.vue'

const usuarioInterno = ref(false)
const documento = ref<File | null>(null)
const documentoOpcional = ref<File | null>(null)
const modalVisivel = ref(false)
const modalTitulo = ref('')
const modalMensagem = ref('')

const empresa = ref<Partial<Empresa>>({
  nomeFantasia: '',
  tipoPessoa: 'JURIDICA',
  perfil: undefined,
  faturamentoDireto: false
})

const exibirModal = (titulo: string, mensagem: string) => {
  modalTitulo.value = titulo
  modalMensagem.value = mensagem
  modalVisivel.value = true
}

const limparCampos = () => {
  empresa.value.razaoSocial = ''
  empresa.value.cnpj = ''
  empresa.value.cpf = ''
  empresa.value.identificadorEstrangeiro = ''
}

const tiposValidos = ['pdf', 'png', 'jpg', 'jpeg']
const validarArquivo = (arquivo: File) => tiposValidos.includes(arquivo.name.split('.').pop()?.toLowerCase() ?? '')

const selecionarDocumento = (event: Event) => {
  const input = event.target as HTMLInputElement
  const arquivo = input.files?.[0]
  if (!arquivo) return
  if (!validarArquivo(arquivo)) {
    exibirModal('Arquivo Inválido', 'São válidos somente arquivos do tipo: pdf, png, jpg ou jpeg.')
    input.value = ''
    return
  }
  documento.value = arquivo
}

const selecionarDocumentoOpcional = (event: Event) => {
  const input = event.target as HTMLInputElement
  const arquivo = input.files?.[0]
  if (!arquivo) return
  if (!validarArquivo(arquivo)) {
    exibirModal('Arquivo Inválido', 'São válidos somente arquivos do tipo: pdf, png, jpg ou jpeg.')
    input.value = ''
    return
  }
  if (documento.value?.name === arquivo.name) {
    exibirModal('Arquivo Duplicado', 'O arquivo opcional não pode ser igual ao obrigatório.')
    input.value = ''
    return
  }
  documentoOpcional.value = arquivo
}

const validar = (): string | null => {
  if (!empresa.value.perfil) return 'Selecione um perfil para a empresa.'
  if ((empresa.value.razaoSocial?.length ?? 0) < 3) return 'Mínimo de 3 caracteres para Razão Social/Nome.'
  if ((empresa.value.nomeFantasia?.length ?? 0) < 3) return 'Mínimo de 3 caracteres para Nome Fantasia.'
  if (empresa.value.tipoPessoa === 'JURIDICA' && (empresa.value.cnpj?.length ?? 0) !== 14) return 'CNPJ inválido.'
  if (empresa.value.tipoPessoa === 'FISICA' && (empresa.value.cpf?.length ?? 0) !== 11) return 'CPF inválido.'
  if (!documento.value) return 'É necessário enviar os arquivos obrigatórios para prosseguir.'
  return null
}

const cadastrar = async () => {
  const erro = validar()
  if (erro) { exibirModal('Atenção', erro); return }
  try {
    const response = await empresaService.cadastrar(empresa.value as Empresa, usuarioInterno.value)
    if (documento.value && response.data.id) await empresaService.upload(response.data.id, documento.value)
    exibirModal('Sucesso', 'Empresa cadastrada com sucesso!')
  } catch {
    exibirModal('Erro', 'Erro ao cadastrar empresa.')
  }
}
</script>