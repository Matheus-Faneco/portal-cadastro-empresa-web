<template>
  <div class="modal fade show d-block" tabindex="-1" v-if="visivel">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ titulo }}</h5>
          <button type="button" class="btn-close" @click="$emit('fechar')"></button>
        </div>
        <div class="modal-body">
          <p>{{ mensagem }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="$emit('fechar')">Fechar</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show" v-if="visivel"></div>
</template>

<script setup lang="ts">
defineProps<{
  visivel: boolean
  titulo: string
  mensagem: string
}>()

defineEmits(['fechar'])
</script>