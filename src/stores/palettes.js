import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const usePaletteStore = defineStore('palettes', () => {
  const currentPalette = ref([])
  const savedPalettes = ref([])
  const pinnedColors = ref([])

  const loadFromStorage = () => {
    const saved = localStorage.getItem('savedPalettes')
    if (saved) {
      savedPalettes.value = JSON.parse(saved)
    }
  }

  const saveToStorage = () => {
    localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes.value))
  }

  const savePalette = (name, colors) => {
    savedPalettes.value.push({
      id: Date.now(),
      name: name || `Палитра ${savedPalettes.value.length + 1}`,
      colors: colors || currentPalette.value,
      createdAt: new Date().toISOString()
    })
    saveToStorage()
  }

  const deletePalette = (id) => {
    savedPalettes.value = savedPalettes.value.filter(p => p.id !== id)
    saveToStorage()
  }

  const setPalette = (colors) => {
    currentPalette.value = colors
    localStorage.setItem('currentPalette', JSON.stringify(colors))
  }

  watch(savedPalettes, saveToStorage, { deep: true })

  loadFromStorage()

  return {
    currentPalette,
    savedPalettes,
    pinnedColors,
    savePalette,
    deletePalette,
    setPalette
  }
})
