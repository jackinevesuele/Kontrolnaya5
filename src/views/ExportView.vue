<template>
  <div>
    <div class="card">
      <h2>📤 Экспорт палитры</h2>

      <div style="margin-bottom: 2rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Выберите палитру для экспорта:</label>
        <select v-model="selectedPaletteId" @change="loadSelectedPalette" style="width: 100%; max-width: 400px; padding: 0.75rem; border-radius: 12px; border: 2px solid rgba(102,126,234,0.3);">
          <option :value="null">-- Выберите палитру --</option>
          <option v-for="palette in savedPalettes" :key="palette.id" :value="palette.id">
            {{ palette.name }} ({{ new Date(palette.createdAt).toLocaleDateString('ru-RU') }})
          </option>
        </select>
      </div>

      <div v-if="!exportPalette" style="text-align: center; padding: 2rem; color: #666;">
        <p>Выберите палитру из списка выше</p>
      </div>

      <div v-else>
        <h3>{{ exportPalette.name }}</h3>
        
        <div class="palette-colors" style="display: flex; gap: 0.5rem; margin: 1rem 0;">
          <div 
            v-for="(color, i) in exportPalette.colors" 
            :key="i"
            style="width: 50px; height: 50px; border-radius: 8px;"
            :style="{ backgroundColor: color.hex }"
            :title="color.hex"
          ></div>
        </div>
        
        <div class="controls">
          <button @click="format = 'css'" :class="format === 'css' ? 'btn-primary' : 'btn-secondary'" class="btn">CSS Variables</button>
          <button @click="format = 'scss'" :class="format === 'scss' ? 'btn-primary' : 'btn-secondary'" class="btn">SCSS</button>
          <button @click="format = 'tailwind'" :class="format === 'tailwind' ? 'btn-primary' : 'btn-secondary'" class="btn">Tailwind</button>
          <button @click="format = 'json'" :class="format === 'json' ? 'btn-primary' : 'btn-secondary'" class="btn">JSON</button>
        </div>

        <div class="export-code">{{ exportCode }}</div>

        <div class="controls">
          <button @click="copyCode" class="btn btn-success">📋 Копировать код</button>
          <button @click="downloadFile" class="btn btn-primary">💾 Скачать файл</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const exportPalette = ref(null)
const format = ref('css')
const savedPalettes = ref([])
const selectedPaletteId = ref(null)

onMounted(() => {
  savedPalettes.value = JSON.parse(localStorage.getItem('savedPalettes') || '[]')
  
  const currentPalette = localStorage.getItem('currentPalette')
  if (currentPalette && savedPalettes.value.length > 0) {
    selectedPaletteId.value = savedPalettes.value[0].id
    loadSelectedPalette()
  }
})

const loadSelectedPalette = () => {
  if (selectedPaletteId.value) {
    exportPalette.value = savedPalettes.value.find(p => p.id === selectedPaletteId.value)
  } else {
    exportPalette.value = null
  }
}

const exportCode = computed(() => {
  if (!exportPalette.value) return ''

  const colors = exportPalette.value.colors

  switch(format.value) {
    case 'css':
      return `:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n')}\n}`

    case 'scss':
      return colors.map((c, i) => `$color-${i + 1}: ${c.hex};`).join('\n')

    case 'tailwind':
      return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${colors.map((c, i) => `        'palette-${i + 1}': '${c.hex}',`).join('\n')}\n      }\n    }\n  }\n}`

    case 'json':
      return JSON.stringify(colors.map((c, i) => ({
        name: `color-${i + 1}`,
        hex: c.hex,
        rgb: c.rgb,
        hsl: c.hsl
      })), null, 2)

    default:
      return ''
  }
})

const copyCode = () => {
  navigator.clipboard.writeText(exportCode.value)
  alert('Код скопирован в буфер обмена!')
}

const downloadFile = () => {
  const extensions = {
    css: 'css',
    scss: 'scss',
    tailwind: 'js',
    json: 'json'
  }
  
  const filename = `palette-${Date.now()}.${extensions[format.value]}`
  const blob = new Blob([exportCode.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
  alert(`Файл ${filename} загружен!`)
}
</script>

<style scoped>
.export-code {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 1.5rem;
  border-radius: 12px;
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  margin: 2rem 0;
  overflow-x: auto;
}
</style>
