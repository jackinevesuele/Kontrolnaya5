<template>
  <div>
    <div class="card">
      <h2>Проверка доступности (WCAG)</h2>
      
      <div v-if="palette.length === 0" style="text-align: center; padding: 3rem; color: #666;">
        <p>Сначала создайте палитру в генераторе</p>
        <router-link to="/generator" class="btn btn-primary">Перейти к генератору</router-link>
      </div>

      <div v-else>
        <p style="margin-bottom: 2rem; color: #666;">
          Проверка контрастности текста на фоне. Стандарт WCAG 2.1:
          <strong style="color: #28a745;">AAA (7:1)</strong> - отлично,
          <strong style="color: #ffc107;">AA (4.5:1)</strong> - хорошо,
          <strong style="color: #dc3545;">Недостаточно (&lt;4.5:1)</strong> - плохо
        </p>

        <div class="contrast-grid">
          <div 
            v-for="(combo, i) in contrastCombinations" 
            :key="i"
            class="contrast-card"
            :style="{ 
              backgroundColor: combo.bg, 
              color: combo.fg,
              border: '3px solid rgba(0,0,0,0.1)'
            }"
          >
            <h3 style="margin-bottom: 0.5rem;">Пример текста</h3>
            <p style="margin: 0.5rem 0;">Босарев Евгений ЭФБО-11-24</p>
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.3);">
              <div><strong>Контраст: {{ combo.ratio.toFixed(2) }}:1</strong></div>
              <div style="margin: 0.5rem 0;">
                <span :class="'wcag-badge wcag-' + combo.level">{{ combo.levelText }}</span>
              </div>
              <small style="opacity: 0.8;">
                Фон: {{ combo.bg }}<br>
                Текст: {{ combo.fg }}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const palette = ref([])

onMounted(() => {
  const stored = localStorage.getItem('currentPalette')
  if (stored) {
    palette.value = JSON.parse(stored)
  } else {
    const savedPalettes = JSON.parse(localStorage.getItem('savedPalettes') || '[]')
    if (savedPalettes.length > 0) {
      palette.value = savedPalettes[0].colors
    }
  }
})

const getLuminance = (hex) => {
  const rgb = parseInt(hex.slice(1), 16)
  const r = ((rgb >> 16) & 0xff) / 255
  const g = ((rgb >> 8) & 0xff) / 255
  const b = ((rgb >> 0) & 0xff) / 255
  
  const [rs, gs, bs] = [r, g, b].map(c => 
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  )
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

const getContrastRatio = (hex1, hex2) => {
  const lum1 = getLuminance(hex1)
  const lum2 = getLuminance(hex2)
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)
  return (lighter + 0.05) / (darker + 0.05)
}

const getWCAGLevel = (ratio) => {
  if (ratio >= 7) return { level: 'aaa', text: 'AAA ✓' }
  if (ratio >= 4.5) return { level: 'aa', text: 'AA ✓' }
  return { level: 'fail', text: 'Недостаточно ✗' }
}

const contrastCombinations = computed(() => {
  if (!palette.value || palette.value.length === 0) return []
  
  const combos = []
  for (let i = 0; i < palette.value.length; i++) {
    for (let j = i + 1; j < palette.value.length; j++) {
      const ratio1 = getContrastRatio(palette.value[i].hex, palette.value[j].hex)
      const wcag1 = getWCAGLevel(ratio1)
      combos.push({
        bg: palette.value[i].hex,
        fg: palette.value[j].hex,
        ratio: ratio1,
        level: wcag1.level,
        levelText: wcag1.text
      })
      
      const ratio2 = getContrastRatio(palette.value[j].hex, palette.value[i].hex)
      const wcag2 = getWCAGLevel(ratio2)
      combos.push({
        bg: palette.value[j].hex,
        fg: palette.value[i].hex,
        ratio: ratio2,
        level: wcag2.level,
        levelText: wcag2.text
      })
    }
  }
  return combos.sort((a, b) => b.ratio - a.ratio)
})
</script>

<style scoped>
.contrast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.contrast-card {
  padding: 1.5rem;
  border-radius: 16px;
  min-height: 200px;
  transition: transform 0.2s;
}

.contrast-card:hover {
  transform: translateY(-5px);
}

.wcag-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 700;
  display: inline-block;
}

.wcag-aaa {
  background: #28a745;
  color: white;
}

.wcag-aa {
  background: #ffc107;
  color: #333;
}

.wcag-fail {
  background: #dc3545;
  color: white;
}
</style>
