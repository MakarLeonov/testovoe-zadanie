<template>
  <div class="sector-list-wrap">
    <TransitionGroup name="sector" tag="div" class="sector-list">
      <div class="sector-row" v-for="(sector, i) in sectors" :key="sector.id">
        <span class="sector-name">{{ sector.name }}</span>
        <span class="divider" />
        <span class="sector-value">{{ sector.value }}</span>
        <span class="sector-dot" :style="{ background: sector.color }" />
        <div class="sector-actions">
          <button class="icon-btn" title="Редактировать" @click="emit('edit', i)">
            <EditIcon />
          </button>
          <button class="icon-btn danger" title="Удалить" @click="emit('delete', i)">
            <TrashIcon />
          </button>
        </div>
      </div>
    </TransitionGroup>

    <button class="add-btn btn-primary" @click="emit('add')">Добавить сектор</button>
  </div>
</template>

<script setup>
import EditIcon from './EditIcon.vue'
import TrashIcon from './TrashIcon.vue'

defineProps({
  sectors: { type: Array, required: true },
})
const emit = defineEmits(['add', 'edit', 'delete'])
</script>

<style scoped>
.sector-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.sector-row {
  display: flex;
  align-items: center;
  background: var(--surface2);
  border-radius: 10px;
  padding: 10px 14px;
  gap: 0;
  transition: background 0.15s;
}
.sector-row:hover { background: #eff1f8; }

.sector-name {
  font-size: 0.875rem;
  font-weight: 500;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.divider {
  display: block;
  width: 1px;
  height: 20px;
  background: var(--border);
  margin: 0 12px;
  flex-shrink: 0;
}

.sector-value {
  font-size: 0.875rem;
  color: var(--text-muted);
  width: 44px;
  flex-shrink: 0;
  font-family: var(--mono);
}

.sector-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  margin: 0 10px 0 4px;
}

.sector-actions {
  display: flex;
  gap: 2px;
  margin-left: auto;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px 6px;
  border-radius: 6px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  transition: all 0.15s;
}
.icon-btn:hover { background: #e8ebf5; color: var(--text); }
.icon-btn.danger:hover { background: #fee2e2; color: var(--danger); }

.add-btn {
  width: 100%;
}

/* List transitions */
.sector-enter-active,
.sector-leave-active {
  transition: all 0.25s ease;
}
.sector-enter-from {
  opacity: 0;
  transform: translateX(-12px);
}
.sector-leave-to {
  opacity: 0;
  transform: translateX(12px);
}
.sector-move {
  transition: transform 0.25s ease;
}
</style>
