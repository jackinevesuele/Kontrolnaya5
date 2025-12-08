<template>
  <div>
    <div class="card" style="text-align: center;">
      <h1>🎨 Генератор цветовых палитр</h1>
      <router-link to="/generator" class="btn btn-primary" style="font-size: 1.1rem; padding: 1rem 2rem;">
        🚀 Начать генерацию
      </router-link>
      
      <div style="margin-top: 3rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
        <div style="padding: 1.5rem; background: rgba(102,126,234,0.1); border-radius: 16px;">
          <h3>🎲 Случайные палитры</h3>
          <p>Генерируйте гармоничные палитры одним кликом</p>
        </div>
        <div style="padding: 1.5rem; background: rgba(118,75,162,0.1); border-radius: 16px;">
          <h3>✔️ Проверка WCAG контраст</h3>
          <p>Проверяйте доступность и контрастность цветовых комбинаций</p>
        </div>
        <div style="padding: 1.5rem; background: rgba(240,147,251,0.1); border-radius: 16px;">
          <h3>📤 Экспорт</h3>
          <p>Экспортируйте в CSS, SCSS, Tailwind</p>
        </div>
      </div>
    </div>
  </div>
</template>
