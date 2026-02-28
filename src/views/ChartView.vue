<template>
  <div class="chart-view">
    <div class="card">
      <h2 class="card-title">Круговая диаграмма</h2>

      <div class="layout">
        <SectorList
          :sectors="sectors"
          @add="openAddModal"
          @edit="openEditModal"
          @delete="deleteSector"
        />

        <PieChartCanvas :sectors="sectors" />
      </div>
    </div>

    <SectorModal
      :show="modal.open"
      :initial="modal.initial"
      @close="closeModal"
      @submit="handleModalSubmit"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import SectorList from '@/components/PieChart/SectorList.vue'
import PieChartCanvas from '@/components/PieChart/PieChartCanvas.vue'
import SectorModal from '@/components/PieChart/SectorModal.vue'

// ── Default sectors ──────────────────────────────────────────────────────────
const DEFAULT_COLORS = ['#f06292', '#f5c842', '#4bc8c4', '#8e6bbf', '#56b870', '#f97316']

let nextId = 4
const sectors = ref([
  { id: 1, name: 'Сектор-1', value: 25, color: '#f06292' },
  { id: 2, name: 'Сектор-2', value: 25, color: '#f5c842' },
  { id: 3, name: 'Сектор-3', value: 25, color: '#4bc8c4' },
])

// ── Modal state ───────────────────────────────────────────────────────────────
const modal = reactive({
  open: false,
  /** null = add mode; { id, name, value, color } = edit mode */
  initial: null,
  /** index of sector being edited */
  editIndex: null,
})

function openAddModal() {
  modal.initial = {
    name: `Сектор-${nextId}`,
    value: 25,
    color: DEFAULT_COLORS[sectors.value.length % DEFAULT_COLORS.length],
  }
  modal.editIndex = null
  modal.open = true
}

function openEditModal(index) {
  modal.initial = { ...sectors.value[index] }
  modal.editIndex = index
  modal.open = true
}

function closeModal() {
  modal.open = false
  modal.initial = null
  modal.editIndex = null
}

function handleModalSubmit({ name, value, color }) {
  if (modal.editIndex !== null) {
    // Edit existing
    sectors.value[modal.editIndex] = {
      ...sectors.value[modal.editIndex],
      name,
      value,
      color,
    }
  } else {
    // Add new
    sectors.value.push({ id: nextId++, name, value, color })
  }
  closeModal()
}

function deleteSector(index) {
  sectors.value.splice(index, 1)
}
</script>

<style scoped>
.chart-view {
  /* page wrapper */
}

.layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 48px;
  align-items: start;
}

@media (max-width: 760px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
