<template>
  <div class="controls">
    <div class="control-group">
      <span class="control-label">Прогресс</span>
      <div class="slider-row">
        <input type="range" min="0" max="100" :value="modelValue.value"
          @input="emit('update:modelValue', { ...modelValue, value: +$event.target.value })" />
        <span class="val-badge">{{ modelValue.value }}%</span>
      </div>
    </div>

    <div class="control-group">
      <span class="control-label">Размер</span>
      <div class="slider-row">
        <input type="range" min="60" max="240" step="4" :value="modelValue.size"
          @input="emit('update:modelValue', { ...modelValue, size: +$event.target.value })" />
        <span class="val-badge">{{ modelValue.size }}px</span>
      </div>
    </div>

    <div class="control-group">
      <span class="control-label">Толщина</span>
      <div class="slider-row">
        <input type="range" min="3" max="24" :value="modelValue.strokeWidth"
          @input="emit('update:modelValue', { ...modelValue, strokeWidth: +$event.target.value })" />
        <span class="val-badge">{{ modelValue.strokeWidth }}px</span>
      </div>
    </div>

    <div class="control-group">
      <span class="control-label">Статус</span>
      <div class="btn-group">
        <button
          v-for="s in STATUSES"
          :key="s.value"
          class="chip"
          :class="{ active: modelValue.status === s.value }"
          @click="emit('update:modelValue', { ...modelValue, status: s.value })"
        >
          {{ s.label }}
        </button>
      </div>
    </div>

    <div class="control-group">
      <span class="control-label">Тип</span>
      <div class="btn-group">
        <button
          class="chip"
          :class="{ active: modelValue.type === 'circle' }"
          @click="emit('update:modelValue', { ...modelValue, type: 'circle' })"
        >Circle</button>
        <button
          class="chip"
          :class="{ active: modelValue.type === 'dashboard' }"
          @click="emit('update:modelValue', { ...modelValue, type: 'dashboard' })"
        >Dashboard</button>
      </div>
    </div>

    <div class="control-group">
      <span class="control-label">Метка</span>
      <label class="toggle">
        <input type="checkbox" :checked="modelValue.showLabel"
          @change="emit('update:modelValue', { ...modelValue, showLabel: $event.target.checked })" />
        <span class="toggle-track"></span>
        <span class="toggle-thumb"></span>
        <span class="toggle-text">Показывать центр</span>
      </label>
    </div>
  </div>
</template>

<script setup>
const STATUSES = [
  { value: 'inprogress', label: 'In Progress' },
  { value: 'success',    label: 'Success' },
  { value: 'warning',    label: 'Warning' },
  { value: 'error',      label: 'Error' },
]

defineProps({
  modelValue: { type: Object, required: true },
})
const emit = defineEmits(['update:modelValue'])
</script>

<style scoped>
.controls {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px 28px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.control-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

/* Slider */
.slider-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

input[type='range'] {
  flex: 1;
  -webkit-appearance: none;
  height: 4px;
  background: var(--border);
  border-radius: 4px;
  outline: none;
}
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--text);
  cursor: pointer;
  transition: transform 0.15s;
}
input[type='range']::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.val-badge {
  font-family: var(--mono);
  font-size: 0.78rem;
  background: var(--bg);
  padding: 4px 10px;
  border-radius: 8px;
  min-width: 50px;
  text-align: center;
}

/* Chip buttons */
.btn-group {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.chip {
  font-family: var(--font);
  font-size: 0.78rem;
  font-weight: 500;
  padding: 7px 14px;
  border-radius: 8px;
  border: 1.5px solid var(--border);
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  transition: all 0.15s;
}
.chip:hover { background: var(--bg); }
.chip.active {
  background: var(--text);
  color: #fff;
  border-color: var(--text);
}

/* Toggle */
.toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}
.toggle input { display: none; }

.toggle-track {
  position: relative;
  width: 40px;
  height: 22px;
  background: var(--border);
  border-radius: 11px;
  transition: background 0.2s;
  flex-shrink: 0;
}
.toggle input:checked ~ .toggle-track { background: var(--text); }

.toggle-thumb {
  position: absolute; /* positioned relative to .toggle via JS — use CSS trick */
  pointer-events: none;
}

/* Hacky but clean: reuse adjacent sibling selector */
.toggle input + .toggle-track::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  transition: transform 0.2s;
}
.toggle input:checked + .toggle-track::after {
  transform: translateX(18px);
}

.toggle-text {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text);
}
</style>
