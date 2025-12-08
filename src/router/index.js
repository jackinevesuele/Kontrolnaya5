import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GeneratorView from '../views/GeneratorView.vue'
import LibraryView from '../views/LibraryView.vue'
import AccessibilityView from '../views/AccessibilityView.vue'
import ExportView from '../views/ExportView.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/generator', name: 'Generator', component: GeneratorView },
  { path: '/library', name: 'Library', component: LibraryView },
  { path: '/accessibility', name: 'Accessibility', component: AccessibilityView },
  { path: '/export', name: 'Export', component: ExportView },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
