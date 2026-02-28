<template>
  <div class="app-shell">
    <nav class="app-nav">
      <div class="nav-inner">
        <span class="nav-logo">
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#2563eb"/>
            <path d="M8 22L16 10l8 12H8z" fill="white" opacity="0.9"/>
            <circle cx="23" cy="12" r="4" fill="white" opacity="0.7"/>
          </svg>
          Vue UI Kit
        </span>
        <div class="nav-links">
          <RouterLink to="/" class="nav-link">Прогресс-бар</RouterLink>
          <RouterLink to="/chart" class="nav-link">Диаграмма</RouterLink>
        </div>
      </div>
    </nav>
    <main class="app-main">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-nav {
  background: #fff;
  border-bottom: 1.5px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: -0.02em;
  color: var(--text);
}

.nav-links {
  display: flex;
  gap: 4px;
}

.nav-link {
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
  text-decoration: none;
  transition: all 0.15s;
}

.nav-link:hover {
  background: var(--bg);
  color: var(--text);
}

.nav-link.router-link-active {
  background: #eff3ff;
  color: var(--accent);
}

.app-main {
  flex: 1;
  padding: 40px 24px;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
}

/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.2s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
