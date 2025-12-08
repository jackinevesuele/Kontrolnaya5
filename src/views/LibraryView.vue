<template>
  <div>
    <div class="card">
      <h2>📚 Библиотека палитр</h2>
      
      <div v-if="savedPalettes.length === 0" style="text-align: center; padding: 3rem; color: #666;">
        <p>Нет сохраненных палитр</p>
        <router-link to="/generator" class="btn btn-primary">Создать первую палитру</router-link>
      </div>

      <div v-else class="library-grid">
        <div v-for="palette in savedPalettes" :key="palette.id" class="palette-item">
          <h3>{{ palette.name }}</h3>
          <small style="color: #666;">{{ formatDate(palette.createdAt) }}</small>
          
          <div class="palette-colors">
            <div 
              v-for="(color, i) in palette.colors" 
              :key="i"
              class="palette-color-mini"
              :style="{ backgroundColor: color.hex }"
              :title="color.hex"
              @click="copyColor(color.hex)"
            ></div>
          </div>

          <div class="controls" style="margin-top: 1rem;">
            <button @click="loadPalette(palette)" class="btn btn-secondary">📋 Загрузить</button>
            <button @click="deletePalette(palette.id)" class="btn btn-danger">🗑️ Удалить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const savedPalettes = ref(JSON.parse(localStorage.getItem('savedPalettes') || '[]'))

const formatDate = (date) => {
  return new Date(date).toLocaleString('ru-RU')
}

const copyColor = (hex) => {
  navigator.clipboard.writeText(hex)
  alert(`Скопировано: ${hex}`)
}

const loadPalette = (palette) => {
  localStorage.setItem('currentPalette', JSON.stringify(palette.colors))
  router.push('/generator')
  alert('Палитра загружена в генератор!')
}

const deletePalette = (id) => {
  if (confirm('Удалить эту палитру?')) {
    savedPalettes.value = savedPalettes.value.filter(p => p.id !== id)
    localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes.value))
  }
}
</script>

<style scoped>
.library-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}
.palette-item {
  background: rgba(255,255,255,0.8);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}
.palette-colors {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
  flex-wrap: wrap;
}
.palette-color-mini {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s;
}
.palette-color-mini:hover {
  transform: scale(1.1);
}
</style>
