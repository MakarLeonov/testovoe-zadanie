/**
 * useProgressColor — returns an interpolated color for a progress value 0–100.
 * Red → Amber → Green
 */
import { computed } from 'vue'

function lerp(a, b, t) {
  return a + (b - a) * t
}

function progressColor(pct) {
  const r =
    pct < 50
      ? lerp(239, 245, pct / 50)
      : lerp(245, 34, (pct - 50) / 50)
  const g =
    pct < 50
      ? lerp(68, 158, pct / 50)
      : lerp(158, 197, (pct - 50) / 50)
  const b =
    pct < 50
      ? lerp(68, 11, pct / 50)
      : lerp(11, 94, (pct - 50) / 50)
  return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`
}

export function useProgressColor(valueRef, statusRef) {
  return computed(() => {
    if (statusRef.value === 'success') return '#22c55e'
    if (statusRef.value === 'warning') return '#f59e0b'
    if (statusRef.value === 'error') return '#ef4444'
    return progressColor(Math.max(0, Math.min(100, valueRef.value)))
  })
}
