import { createRouter, createWebHistory } from 'vue-router'
import ProgressView from '@/views/ProgressView.vue'
import ChartView from '@/views/ChartView.vue'

const routes = [
  {
    path: '/',
    name: 'progress',
    component: ProgressView,
    meta: { title: 'Прогресс-бар' },
  },
  {
    path: '/chart',
    name: 'chart',
    component: ChartView,
    meta: { title: 'Круговая диаграмма' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.afterEach((to) => {
  document.title = `${to.meta.title ?? 'Vue UI Kit'} — Vue UI Kit`
})

export default router
