<template>
  <div class="not-found">
    <h1>404 - Страница не найдена</h1>
    <p>Запрошенная страница не существует.</p>
    <button @click="goHome" class="btn">Вернуться на главную</button>
    
    <div class="debug-info">
      <p>Путь: {{ $route.path }}</p>
      <p>Параметры: {{ $route.params }}</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.not-found { text-align: center; padding: 50px 20px; color: #666; }
.debug-info { margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 5px; font-family: monospace; }
.btn { padding: 0.75rem 1.5rem; background: #667eea; color: white; border: none; border-radius: 25px; cursor: pointer; }
</style>
