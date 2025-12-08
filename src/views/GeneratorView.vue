<template>
  <div>
    <div class="card">
      <h2>🎨 Генератор палитр</h2>
      
      <div class="controls" style="flex-direction: column; gap: 1.5rem;">
        
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
          <button @click="generatePalette('random')" class="btn btn-primary">Случайная</button>
          <button @click="generatePalette('monochrome')" class="btn btn-primary">Монохром</button>
          <button @click="generatePalette('analogous')" class="btn btn-primary">Аналоговая</button>
          <button @click="generatePalette('triadic')" class="btn btn-primary">Триада</button>
        </div>

        <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; align-items: center;">
          <label style="display: flex; align-items: center; gap: 0.5rem;">
            Количество цветов:
            <select v-model.number="colorCount" @change="regenerateCurrentType">
              <option :value="3">3</option>
              <option :value="5">5</option>
              <option :value="7">7</option>
            </select>
          </label>
          
          <label style="display: flex; align-items: center; gap: 0.5rem; background: white; padding: 0.5rem 1rem; border-radius: 12px;">
            Базовый цвет:
            <input type="color" v-model="baseColor" @input="generateFromBase" style="width: 60px; height: 40px; border: none; cursor: pointer;">
          </label>
          
          <label style="display: flex; align-items: center; gap: 0.5rem;">
            Формат:
            <select v-model="colorFormat">
              <option>HEX</option>
              <option>RGB</option>
            </select>
          </label>
        </div>
        
      </div>

      <div class="palette-grid">
        <div 
          v-for="(color, index) in palette" 
          :key="index"
          class="color-swatch"
          :style="{ backgroundColor: color.hex }"
          @click="copyColor(color)"
        >
          <div class="color-label">
            <div>{{ getFormattedColor(color) }}</div>
            <small>{{ color.hsl }}</small>
          </div>
        </div>
      </div>

      <div class="controls">
        <button @click="saveCurrentPalette" class="btn btn-success">💾 Сохранить палитру</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const palette = ref([])
const colorCount = ref(5)
const baseColor = ref('#667eea')
const colorFormat = ref('HEX')
const currentType = ref('random')

const hslToHex = (h, s, l) => {
  s /= 100
  l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = n => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return '#' + f(0) + f(8) + f(4)
}

const hslToRgb = (h, s, l) => {
  s /= 100
  l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = n => {
    const k = (n + h / 30) % 12
    return Math.round(255 * (l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)))
  }
  return `rgb(${f(0)}, ${f(8)}, ${f(4)})`
}

const hexToHsl = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const diff = max - min
  
  let h = 0
  if (diff !== 0) {
    if (max === r) h = 60 * (((g - b) / diff) % 6)
    else if (max === g) h = 60 * ((b - r) / diff + 2)
    else h = 60 * ((r - g) / diff + 4)
  }
  if (h < 0) h += 360
  
  const l = (max + min) / 2
  const s = diff === 0 ? 0 : diff / (1 - Math.abs(2 * l - 1))
  
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) }
}

const generatePalette = (type = 'random') => {
  currentType.value = type
  palette.value = []
  const baseHue = Math.random() * 360
  
  for (let i = 0; i < colorCount.value; i++) {
    let hue, saturation, lightness
    
    switch(type) {
      case 'monochrome':
        hue = baseHue
        saturation = Math.max(35, Math.min(95, 45 + i * 10))
        lightness = Math.max(15, Math.min(90, 20 + i * 14))
        break
        
      case 'analogous':
        hue = (baseHue + i * (50 / colorCount.value)) % 360
        saturation = 65 + Math.random() * 20
        lightness = 40 + Math.random() * 30
        break
        
      case 'triadic':
        hue = (baseHue + ((i % 3) * 120) + Math.floor(i / 3) * 12) % 360
        saturation = 65 + (i % 3) * 8
        lightness = 40 + (i % 3) * 12
        break
        
      default:
        hue = Math.random() * 360
        saturation = 55 + Math.random() * 35
        lightness = 35 + Math.random() * 40
    }
    
    palette.value.push({
      hue: Math.round(hue),
      saturation: Math.round(saturation),
      lightness: Math.round(lightness),
      hex: hslToHex(hue, saturation, lightness),
      rgb: hslToRgb(hue, saturation, lightness),
      hsl: `hsl(${Math.round(hue)}, ${Math.round(saturation)}%, ${Math.round(lightness)}%)`
    })
  }
  
  localStorage.setItem('currentPalette', JSON.stringify(palette.value))
  localStorage.setItem('currentType', type)
}

const generateFromBase = () => {
  currentType.value = 'base'
  palette.value = []
  const base = hexToHsl(baseColor.value)
  
  const isGrayscale = base.s < 15
  
  if (isGrayscale) {
    for (let i = 0; i < colorCount.value; i++) {
      const hue = (i * 360 / colorCount.value)
      const saturation = 75
      const lightness = base.l < 30 ? 50 : (base.l > 75 ? 55 : base.l)
      
      palette.value.push({
        hue: Math.round(hue),
        saturation: Math.round(saturation),
        lightness: Math.round(lightness),
        hex: hslToHex(hue, saturation, lightness),
        rgb: hslToRgb(hue, saturation, lightness),
        hsl: `hsl(${Math.round(hue)}, ${Math.round(saturation)}%, ${Math.round(lightness)}%)`
      })
    }
  } else {
    const baseSaturation = Math.max(45, base.s)
    const baseLightness = base.l < 25 ? 45 : (base.l > 85 ? 60 : base.l)
    
    for (let i = 0; i < colorCount.value; i++) {
      const hue = (base.h + i * 28) % 360
      const saturation = Math.max(25, Math.min(100, baseSaturation + (i * 5) - 12))
      const lightness = Math.max(20, Math.min(85, baseLightness + (i * 9) - 18))
      
      palette.value.push({
        hue: Math.round(hue),
        saturation: Math.round(saturation),
        lightness: Math.round(lightness),
        hex: hslToHex(hue, saturation, lightness),
        rgb: hslToRgb(hue, saturation, lightness),
        hsl: `hsl(${Math.round(hue)}, ${Math.round(saturation)}%, ${Math.round(lightness)}%)`
      })
    }
  }
  
  localStorage.setItem('currentPalette', JSON.stringify(palette.value))
  localStorage.setItem('currentType', 'base')
}

const regenerateCurrentType = () => {
  if (currentType.value === 'base') {
    generateFromBase()
  } else {
    generatePalette(currentType.value)
  }
}

const getFormattedColor = (color) => {
  return colorFormat.value === 'RGB' ? color.rgb : color.hex
}

const copyColor = (color) => {
  navigator.clipboard.writeText(getFormattedColor(color))
  alert('Скопировано: ' + getFormattedColor(color))
}

const saveCurrentPalette = () => {
  const palettes = JSON.parse(localStorage.getItem('savedPalettes') || '[]')
  palettes.push({
    id: Date.now(),
    name: 'Палитра ' + (palettes.length + 1),
    colors: palette.value,
    createdAt: new Date().toISOString()
  })
  localStorage.setItem('savedPalettes', JSON.stringify(palettes))
  alert('Палитра сохранена в библиотеку!')
}

onMounted(() => {
  const saved = localStorage.getItem('currentPalette')
  const savedType = localStorage.getItem('currentType')
  if (saved) {
    palette.value = JSON.parse(saved)
    currentType.value = savedType || 'random'
  } else {
    generatePalette('random')
  }
})
</script>
