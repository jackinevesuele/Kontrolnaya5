<template>
  <div id="app">
    <nav class="navbar">
      <router-link to="/" class="nav-link">🏠 Главная</router-link>
      <router-link to="/generator" class="nav-link">🎨 Генератор</router-link>
      <router-link to="/library" class="nav-link">📚 Библиотека</router-link>
      <router-link to="/accessibility" class="nav-link">✔️ Проверка WCAG</router-link>
      <router-link to="/export" class="nav-link">📤 Экспорт</router-link>
    </nav>
    <main class="page">
      <router-view/>
    </main>
    <ToastNotification/>
  </div>
</template>

<script setup></script>
