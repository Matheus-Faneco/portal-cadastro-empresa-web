<template>
  <div class="container">
    <h1>Cadastro de Empresa</h1>

    <div v-if="mensagem" :class="sucesso ? 'sucesso' : 'erro'">
      {{ mensagem }}
    </div>

    <form @submit.prevent="cadastrar">
      <div>
        <label>Tipo de Pessoa</label>
        <select v-model="empresa.tipoPessoa" @change="limparCampos">
          <option value="JURIDICA">Jurídica</option>
          <option value="FISICA">Física</option>
          <option value="ESTRANGEIRA">Estrangeira</option>
        </select>
      </div>

      <div v-if="empresa.tipoPessoa === 'JURIDICA'">
        <label>Razão Social</label>
        <input v-model="empresa.razaoSocial" placeholder="Mínimo 3 caracteres" minlength="3" />
        <label>CNPJ</label>
        <input v-model="empresa.cnpj" placeholder="14 dígitos" maxlength="14" />
      </div>

      <div v-if="empresa.tipoPessoa === 'FISICA'">
        <label>Nome</label>
        <input v-model="empresa.razaoSocial" placeholder="Mínimo 3 caracteres" minlength="3" />
        <label>CPF</label>
        <input v-model="empresa.cpf" placeholder="11 dígitos" maxlength="11" />
      </div>

      <div v-if="empresa.tipoPessoa === 'ESTRANGEIRA'">
        <label>Razão Social</label>
        <input v-model="empresa.razaoSocial" placeholder="Mínimo 3 caracteres" minlength="3" />
        <label>Identificador Estrangeiro</label>
        <input v-model="empresa.identificadorEstrangeiro" placeholder="Identificador" />
      </div>

      <div>
        <label>Nome Fantasia</label>
        <input v-model="empresa.nomeFantasia" placeholder="Mínimo 3 caracteres" minlength="3" />
      </div>

      <div>
        <label>Perfil</label>
        <select v-model="empresa.perfil">
          <option value="">Selecione um perfil</option>
          <option value="DESPACHANTE">Despachante</option>
          <option value="BENEFICIARIO">Beneficiário</option>
          <option value="CONSIGNATARIO">Consignatário</option>
          <option value="ARMADOR">Armador</option>
          <option value="AGENTE_DE_CARGA">Agente de Carga</option>
          <option value="TRANSPORTADORA">Transportadora</option>
        </select>
      </div>

      <div>
        <label>Documento Obrigatório</label>
        <input type="file" @change="selecionarDocumento" accept=".pdf,.png,.jpg,.jpeg" />
      </div>

      <div>
        <label>Documento Opcional</label>
        <input type="file" @change="selecionarDocumentoOpcional" accept=".pdf,.png,.jpg,.jpeg" />
      </div>

      <div>
        <label>
          <input type="checkbox" v-model="empresa.faturamentoDireto" />
          Faturamento Direto
        </label>
      </div>

      <div>
        <label>
          <input type="checkbox" v-model="usuarioInterno" />
          Sou Usuário Interno
        </label>
      </div>

      <button type="submit">Cadastrar</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { empresaService, type Empresa } from '../services/empresaService'

const usuarioInterno = ref(false)
const mensagem = ref('')
const sucesso = ref(false)
const documento = ref<File | null>(null)
const documentoOpcional = ref<File | null>(null)

const empresa = ref<Partial<Empresa>>({
  nomeFantasia: '',
  tipoPessoa: 'JURIDICA',
  perfil: undefined,
  faturamentoDireto: false
})

const limparCampos = () => {
  empresa.value.razaoSocial = ''
  empresa.value.cnpj = ''
  empresa.value.cpf = ''
  empresa.value.identificadorEstrangeiro = ''
}

const tiposValidos = ['pdf', 'png', 'jpg', 'jpeg']

const validarTipoArquivo = (arquivo: File): boolean => {
  const extensao = arquivo.name.split('.').pop()?.toLowerCase() ?? ''
  return tiposValidos.includes(extensao)
}

const selecionarDocumento = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  const arquivo = input.files[0]
  if (!arquivo) return

  if (!validarTipoArquivo(arquivo)) {
    mensagem.value = 'São válidos somente arquivos do tipo: pdf, png, jpg ou jpeg.'
    sucesso.value = false
    input.value = ''
    return
  }

  documento.value = arquivo
  mensagem.value = ''
}

const selecionarDocumentoOpcional = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  const arquivo = input.files[0]
  if (!arquivo) return

  if (!validarTipoArquivo(arquivo)) {
    mensagem.value = 'São válidos somente arquivos do tipo: pdf, png, jpg ou jpeg.'
    sucesso.value = false
    input.value = ''
    return
  }

  if (documento.value && arquivo.name === documento.value.name) {
    mensagem.value = 'Arquivo duplicado.'
    sucesso.value = false
    input.value = ''
    return
  }

  documentoOpcional.value = arquivo
  mensagem.value = ''
}

const validar = (): string | null => {
  if (!empresa.value.perfil) return 'Selecione um perfil para a empresa.'

  if ((empresa.value.razaoSocial?.length ?? 0) < 3)
    return 'Mínimo de 3 caracteres para Razão Social/Nome.'

  if ((empresa.value.nomeFantasia?.length ?? 0) < 3)
    return 'Mínimo de 3 caracteres para Nome Fantasia.'

  if (empresa.value.tipoPessoa === 'JURIDICA') {
    if ((empresa.value.cnpj?.length ?? 0) !== 14) return 'CNPJ inválido.'
  }

  if (empresa.value.tipoPessoa === 'FISICA') {
    if ((empresa.value.cpf?.length ?? 0) !== 11) return 'CPF inválido.'
  }

  if (!documento.value) return 'É necessário enviar os arquivos obrigatórios para prosseguir.'

  return null
}

const cadastrar = async () => {
  const erro = validar()
  if (erro) {
    mensagem.value = erro
    sucesso.value = false
    return
  }

  try {
    const response = await empresaService.cadastrar(empresa.value as Empresa, usuarioInterno.value)
    if (documento.value && response.data.id) {
      await empresaService.upload(response.data.id, documento.value)
    }
    mensagem.value = 'Empresa cadastrada com sucesso!'
    sucesso.value = true
  } catch (error) {
    mensagem.value = 'Erro ao cadastrar empresa.'
    sucesso.value = false
  }
}
</script>

<style scoped>
.sucesso { color: green; }
.erro { color: red; }
</style>