<template>
  <svg
    class="chevron"
    :class="{ up: open }"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
</template>

<script setup>
defineProps({
  open: { type: Boolean, default: false },
})
</script>

<style scoped>
.chevron {
  color: var(--text-muted);
  transition: transform 0.2s;
  flex-shrink: 0;
}
.chevron.up {
  transform: rotate(180deg);
}
</style>
