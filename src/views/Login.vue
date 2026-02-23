<template>
  <div>
    <h1>Portal ST - Login</h1>
    <p>Autenticação com Certificado Digital</p>

    <form @submit.prevent="login">
      <div>
        <label>Certificado Digital (.pfx ou .p12)</label>
        <input type="file" @change="selecionarCertificado" accept=".pfx,.p12" />
      </div>

      <div>
        <label>Senha do Certificado</label>
        <input v-model="senha" type="password" placeholder="Senha do certificado" />
      </div>

      <select v-model="tipo">
        <option value="externo">Usuário Externo</option>
        <option value="interno">Usuário Interno</option>
      </select>

      <button type="submit">Entrar</button>
    </form>

    <p v-if="erro" style="color:red">{{ erro }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const certificado = ref<File | null>(null)
const senha = ref('')
const tipo = ref('externo')
const erro = ref('')
const router = useRouter()

const selecionarCertificado = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files?.length) {
    certificado.value = input.files[0]
  }
}

const login = () => {
  if (!certificado.value) {
    erro.value = 'Anexe o certificado digital para prosseguir.'
    return
  }
  if (!senha.value) {
    erro.value = 'Informe a senha do certificado.'
    return
  }
  localStorage.setItem('usuario', JSON.stringify({
    nome: certificado.value.name,
    tipo: tipo.value
  }))
  router.push('/')
}
</script>