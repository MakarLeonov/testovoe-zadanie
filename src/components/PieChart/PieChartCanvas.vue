<template>
  <div class="pie-wrap">
    <template v-if="sectors.length">
      <div class="canvas-container">
        <canvas ref="canvasRef" />
      </div>
      <div class="legend">
        <div class="legend-item" v-for="s in sectors" :key="s.id">
          <span class="legend-dot" :style="{ background: s.color }" />
          <span>{{ s.name }}</span>
        </div>
      </div>
    </template>

    <div v-else class="empty">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="16"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
      <p>Добавьте секторы, чтобы<br/>увидеть диаграмму</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import {
  Chart,
  ArcElement,
  PieController,
  Tooltip,
  Legend,
} from 'chart.js'

Chart.register(ArcElement, PieController, Tooltip, Legend)

const props = defineProps({
  sectors: { type: Array, required: true },
})

const canvasRef = ref(null)
let chartInstance = null

function buildChart() {
  if (!canvasRef.value) return
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
  if (!props.sectors.length) return

  chartInstance = new Chart(canvasRef.value, {
    type: 'pie',
    data: {
      labels: props.sectors.map((s) => s.name),
      datasets: [
        {
          data: props.sectors.map((s) => s.value),
          backgroundColor: props.sectors.map((s) => s.color),
          borderWidth: 3,
          borderColor: '#ffffff',
          hoverOffset: 10,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      animation: { duration: 500, easing: 'easeInOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.raw}`,
          },
        },
      },
    },
  })
}

watch(
  () => props.sectors,
  () => nextTick(buildChart),
  { deep: true }
)

onMounted(() => {
  if (props.sectors.length) nextTick(buildChart)
})

onBeforeUnmount(() => {
  if (chartInstance) chartInstance.destroy()
})
</script>

<style scoped>
.pie-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
}

.canvas-container {
  width: 100%;
  max-width: 320px;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Empty state */
.empty {
  width: 280px;
  height: 280px;
  border-radius: 50%;
  border: 2.5px dashed var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  color: var(--text-muted);
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.5;
}
</style>
