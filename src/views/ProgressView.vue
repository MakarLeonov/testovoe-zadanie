<template>
  <div class="progress-view">

    <section class="card">
      <h2 class="card-title">Интерактивный Playground</h2>
      <div class="playground">
        <div class="playground-preview">
          <CircularProgress
            :value="config.value"
            :status="config.status"
            :size="config.size"
            :stroke-width="config.strokeWidth"
            :type="config.type"
            :show-label="config.showLabel"
          />
        </div>
        <div class="playground-controls">
          <ProgressControls v-model="config" />
        </div>
      </div>
    </section>

    <section class="card">
      <h2 class="card-title">Состояния</h2>
      <div class="ring-row">
        <div class="ring-item" v-for="item in stateExamples" :key="item.label">
          <CircularProgress
            :value="item.value"
            :status="item.status"
            :size="120"
            :stroke-width="8"
          />
          <span class="ring-label">{{ item.label }}</span>
        </div>
      </div>
    </section>

    <section class="card">
      <h2 class="card-title">Тип Dashboard</h2>
      <div class="ring-row">
        <div class="ring-item" v-for="item in dashboardExamples" :key="item.label">
          <CircularProgress
            :value="item.value"
            :status="item.status"
            :size="140"
            :stroke-width="10"
            type="dashboard"
          />
          <span class="ring-label">{{ item.label }}</span>
        </div>
      </div>
    </section>

    <section class="card">
      <h2 class="card-title">Размеры</h2>
      <div class="ring-row" style="align-items: flex-end;">
        <div class="ring-item" v-for="s in sizeExamples" :key="s.size">
          <CircularProgress :value="72" status="inprogress" :size="s.size" :stroke-width="s.stroke" />
          <span class="ring-label">{{ s.size }}px</span>
        </div>
      </div>
    </section>

    <section class="card">
      <h2 class="card-title">Автодемо</h2>
      <div class="ring-row">
        <div class="ring-item" v-for="item in autoItems" :key="item.id">
          <CircularProgress
            :value="item.value"
            :status="item.status"
            :size="120"
            :stroke-width="8"
            :type="item.type"
          />
          <span class="ring-label">{{ item.label }}</span>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import CircularProgress from '@/components/ProgressBar/CircularProgress.vue'
import ProgressControls from '@/components/ProgressBar/ProgressControls.vue'

// ── Static examples ──────────────────────────────────────────────────────────
const stateExamples = [
  { value: 0,   status: 'inprogress', label: '0% · In Progress' },
  { value: 25,  status: 'inprogress', label: '25% · In Progress' },
  { value: 100, status: 'success',    label: '100% · Success' },
  { value: 65,  status: 'warning',    label: '65% · Warning' },
  { value: 80,  status: 'error',      label: '80% · Error' },
]

const dashboardExamples = [
  { value: 10,  status: 'error',      label: '10% · Error' },
  { value: 60,  status: 'inprogress', label: '60% · In Progress' },
  { value: 85,  status: 'warning',    label: '85% · Warning' },
  { value: 100, status: 'success',    label: '100% · Success' },
]

const sizeExamples = [
  { size: 64,  stroke: 5 },
  { size: 96,  stroke: 6 },
  { size: 128, stroke: 8 },
  { size: 160, stroke: 10 },
  { size: 200, stroke: 13 },
]

// ── Playground ────────────────────────────────────────────────────────────────
const config = reactive({
  value: 62,
  status: 'inprogress',
  size: 160,
  strokeWidth: 10,
  type: 'circle',
  showLabel: true,
})

// ── Auto demo ─────────────────────────────────────────────────────────────────
const autoItems = ref([
  { id: 1, value: 0,  status: 'inprogress', label: 'Загрузка файла',    type: 'circle' },
  { id: 2, value: 0,  status: 'inprogress', label: 'Обработка данных',  type: 'dashboard' },
  { id: 3, value: 100, status: 'success',   label: 'Завершено',          type: 'circle' },
  { id: 4, value: 55, status: 'warning',    label: 'Медленное соед.',    type: 'dashboard' },
])

let timer = null
function tick() {
  const item1 = autoItems.value[0]
  const item2 = autoItems.value[1]
  if (item1.value < 100) {
    item1.value = Math.min(100, item1.value + Math.random() * 6 + 2)
    if (item1.value >= 100) item1.status = 'success'
  }
  if (item2.value < 100) {
    item2.value = Math.min(100, item2.value + Math.random() * 5 + 1)
    if (item2.value >= 100) item2.status = 'success'
  }
  if (item1.value >= 100 && item2.value >= 100) {
    clearInterval(timer)
  }
}

onMounted(() => { timer = setInterval(tick, 800) })
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.progress-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.ring-row {
  display: flex;
  flex-wrap: wrap;
  gap: 28px 36px;
  align-items: center;
  justify-content: center;
}

.ring-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.ring-label {
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--text-muted);
  letter-spacing: 0.04em;
  text-align: center;
}

/* Playground */
.playground {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 40px;
  align-items: start;
}

.playground-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 220px;
  padding: 20px;
}

@media (max-width: 720px) {
  .playground {
    grid-template-columns: 1fr;
  }
  .playground-preview {
    justify-content: center;
  }
}
</style>
