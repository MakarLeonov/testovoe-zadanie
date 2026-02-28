<template>
  <div
    class="cp-wrapper"
    :style="{ width: size + 'px', height: size + 'px' }"
    :class="`status-${status}`"
  >
    <svg
      class="cp-svg"
      :class="{ dashboard: type === 'dashboard' }"
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
      aria-hidden="true"
    >
      <circle
        class="cp-track"
        :cx="cx"
        :cy="cy"
        :r="radius"
        :stroke-width="strokeWidth"
        :stroke-dasharray="trackDasharray"
        stroke-dashoffset="0"
      />

      <circle
        class="cp-fill"
        :cx="cx"
        :cy="cy"
        :r="radius"
        :stroke-width="strokeWidth"
        :stroke="fillColor"
        :stroke-dasharray="fillDasharray"
        :stroke-dashoffset="fillDashoffset"
      />
    </svg>

    <div v-if="showLabel" class="cp-center">
      <template v-if="status === 'inprogress'">
        <span
          class="cp-value"
          :style="{ fontSize: fontSize + 'px', color: fillColor }"
        >
          {{ clampedValue }}%
        </span>
      </template>

      <template v-else-if="status === 'success'">
        <svg
          :width="iconSize"
          :height="iconSize"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#22c55e"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </template>

      <template v-else-if="status === 'warning'">
        <svg :width="iconSize" :height="iconSize" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="12" fill="#f59e0b" />
          <rect x="11" y="7" width="2" height="7" rx="1" fill="white" />
          <rect x="11" y="16" width="2" height="2" rx="1" fill="white" />
        </svg>
      </template>

      <template v-else-if="status === 'error'">
        <svg
          :width="iconSize"
          :height="iconSize"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ef4444"
          stroke-width="2.5"
          stroke-linecap="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, toRef } from 'vue'
import { useProgressColor } from '@/composables/useProgressColor'

// ── Props ────────────────────────────────────────────────────────────────────
const props = defineProps({
  /** Progress value 0–100 */
  value: { type: Number, default: 0 },
  /** 'inprogress' | 'success' | 'warning' | 'error' */
  status: { type: String, default: 'inprogress' },
  /** Outer diameter in px */
  size: { type: Number, default: 120 },
  /** SVG stroke width */
  strokeWidth: { type: Number, default: 8 },
  /** 'circle' | 'dashboard' — dashboard cuts a 90° gap at the bottom */
  type: { type: String, default: 'circle' },
  /** Show percentage / status icon in the center */
  showLabel: { type: Boolean, default: true },
})

// ── Geometry ──────────────────────────────────────────────────────────────────
/** Dashboard mode: 75% of the full circumference is active */
const DASHBOARD_RATIO = 0.75

const clampedValue = computed(() => Math.round(Math.max(0, Math.min(100, props.value))))
const radius = computed(() => (props.size - props.strokeWidth * 2) / 2)
const cx = computed(() => props.size / 2)
const cy = computed(() => props.size / 2)

const fullCircumference = computed(() => 2 * Math.PI * radius.value)

const activeArc = computed(() =>
  props.type === 'dashboard'
    ? fullCircumference.value * DASHBOARD_RATIO
    : fullCircumference.value
)

/**
 * The track dasharray:
 *  - circle:    full ring
 *  - dashboard: 75% arc + invisible 25% gap
 */
const trackDasharray = computed(() =>
  props.type === 'dashboard'
    ? `${activeArc.value} ${fullCircumference.value}`
    : `${fullCircumference.value} ${fullCircumference.value}`
)

const fillLength = computed(() => (clampedValue.value / 100) * activeArc.value)

const fillDasharray = computed(() =>
  props.type === 'dashboard'
    ? `${fillLength.value} ${fullCircumference.value}`
    : `${fullCircumference.value} ${fullCircumference.value}`
)

/**
 * For circle type we use dashoffset to control fill length.
 * For dashboard type we control via dasharray length (offset stays 0).
 */
const fillDashoffset = computed(() =>
  props.type === 'dashboard' ? 0 : fullCircumference.value - fillLength.value
)

// ── Color ─────────────────────────────────────────────────────────────────────
const fillColor = useProgressColor(
  computed(() => clampedValue.value),
  toRef(props, 'status')
)

// ── Typography ────────────────────────────────────────────────────────────────
const fontSize = computed(() => Math.max(10, props.size * 0.16))
const iconSize = computed(() => Math.max(14, props.size * 0.22))
</script>

<style scoped>
.cp-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cp-svg {
  /* Default: start from 12 o'clock */
  transform: rotate(-90deg);
  overflow: visible;
}

/* Dashboard: the gap should sit at the bottom-center.
   Rotating by 135° = -90° (top-start) + 225° gap-offset */
.cp-svg.dashboard {
  transform: rotate(135deg);
}

.cp-track {
  fill: none;
  stroke: #e8ebf5;
}

.cp-fill {
  fill: none;
  stroke-linecap: round;
  /* Smooth value animation */
  transition:
    stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    stroke-dasharray 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    stroke 0.4s ease;
}

.cp-center {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cp-value {
  font-family: var(--mono);
  font-weight: 500;
  line-height: 1;
  transition: color 0.4s ease;
}
</style>
