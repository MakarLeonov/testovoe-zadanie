<template>
  <div class="color-picker-field">
    <button
      type="button"
      class="trigger"
      :class="{ open: picker.isOpen.value }"
      @click="picker.toggle(modelValue)"
    >
      <span class="trigger-left">
        <span class="swatch" :style="{ background: modelValue }" />
        <span class="hex-label">{{ picker.displayHex.value }}</span>
      </span>
      <ChevronIcon :open="picker.isOpen.value" />
    </button>

    <Transition name="picker">
      <div v-if="picker.isOpen.value" class="panel">
        <div
          class="gradient-wrap"
          ref="picker.wrapperRef"
          @mousedown="picker.onWrapperMouseDown"
          @touchstart.prevent="picker.onWrapperTouchStart"
        >
          <canvas ref="picker.gradientCanvasRef" class="gradient-canvas" width="372" height="160" />
          <span
            class="cursor"
            :style="{
              left: picker.picker.cursorX + 'px',
              top: picker.picker.cursorY + 'px',
              background: modelValue,
            }"
          />
        </div>

        <div class="hue-row">
          <span class="hue-swatch" :style="{ background: picker.hueColor.value }" />
          <input
            type="range"
            class="hue-slider"
            min="0"
            max="360"
            v-model.number="picker.picker.hue"
            @input="picker.onHueChange"
          />
        </div>

        <div class="hex-row">
          <span class="hash">#</span>
          <input
            type="text"
            class="hex-input"
            :value="picker.hexInputRaw.value"
            maxlength="6"
            placeholder="4F46E5"
            @input="picker.hexInputRaw.value = $event.target.value"
            @change="picker.onHexInput($event.target.value)"
            @blur="picker.onHexInput($event.target.value)"
          />
          <span class="hex-unit">HEX</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useColorPicker } from '@/composables/useColorPicker'
import ChevronIcon from './ChevronIcon.vue'

const props = defineProps({
  /** The current hex color string, e.g. "#4F46E5" */
  modelValue: { type: String, default: '#4F46E5' },
})
const emit = defineEmits(['update:modelValue'])

const picker = useColorPicker(props.modelValue)

// Forward color changes out via v-model
watch(picker.color, (val) => emit('update:modelValue', val))
</script>

<style scoped>
.color-picker-field {
  position: relative;
}

/* Trigger */
.trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.15s;
  font-family: var(--font);
}
.trigger:hover,
.trigger.open {
  border-color: var(--accent);
}
.trigger.open {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.trigger-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.swatch {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
}

.hex-label {
  font-size: 0.88rem;
  color: var(--text);
}

/* Panel */
.panel {
  border: 1.5px solid var(--accent);
  border-top: none;
  border-radius: 0 0 10px 10px;
  padding: 14px;
  background: white;
}

/* Gradient */
.gradient-wrap {
  position: relative;
  width: 100%;
  height: 160px;
  border-radius: 8px;
  overflow: hidden;
  cursor: crosshair;
  margin-bottom: 12px;
}

.gradient-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.cursor {
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2.5px solid white;
  box-shadow: 0 0 0 1.5px rgba(0, 0, 0, 0.3), 0 2px 6px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  transform: translate(-50%, -50%);
}

/* Hue */
.hue-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.hue-swatch {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
}

.hue-slider {
  flex: 1;
  -webkit-appearance: none;
  height: 12px;
  border-radius: 6px;
  outline: none;
  cursor: pointer;
  background: linear-gradient(
    to right,
    hsl(0, 100%, 50%), hsl(30, 100%, 50%), hsl(60, 100%, 50%),
    hsl(90, 100%, 50%), hsl(120, 100%, 50%), hsl(150, 100%, 50%),
    hsl(180, 100%, 50%), hsl(210, 100%, 50%), hsl(240, 100%, 50%),
    hsl(270, 100%, 50%), hsl(300, 100%, 50%), hsl(330, 100%, 50%),
    hsl(360, 100%, 50%)
  );
}
.hue-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: white;
  border: 2px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;
}

/* Hex row */
.hex-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.hash {
  color: var(--text-muted);
  font-size: 0.88rem;
}

.hex-input {
  flex: 1;
  font-family: var(--mono);
  font-size: 0.85rem;
  padding: 8px 12px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  outline: none;
  color: var(--text);
  letter-spacing: 0.05em;
}
.hex-input:focus {
  border-color: var(--accent);
}

.hex-unit {
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

/* Transition */
.picker-enter-active,
.picker-leave-active {
  transition: all 0.18s ease;
  transform-origin: top;
}
.picker-enter-from,
.picker-leave-to {
  opacity: 0;
  transform: scaleY(0.92);
}
</style>
