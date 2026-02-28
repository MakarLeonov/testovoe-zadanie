<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div v-if="show" class="overlay" @click.self="emit('close')">
        <Transition name="modal">
          <div v-if="show" class="modal" role="dialog" aria-modal="true">
            <h2 class="modal-title">
              {{ isEditing ? 'Редактирование сектора' : 'Добавление сектора' }}
            </h2>

            <div class="form">
              <div class="field">
                <label for="sector-name">Наименование</label>
                <input
                  id="sector-name"
                  type="text"
                  v-model="form.name"
                  placeholder="Сектор-1"
                  @keydown.enter="submit"
                />
              </div>

              <div class="field">
                <label for="sector-value">Значение</label>
                <input
                  id="sector-value"
                  type="number"
                  v-model.number="form.value"
                  min="0.1"
                  step="0.1"
                  placeholder="25"
                />
              </div>

              <div class="field">
                <label>Цвет</label>
                <ColorPicker v-model="form.color" />
              </div>
            </div>

            <div class="modal-actions">
              <button class="btn-secondary" @click="emit('close')">Отмена</button>
              <button class="btn-primary" @click="submit" :disabled="!isValid">
                {{ isEditing ? 'Сохранить' : 'Добавить сектор' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'
import ColorPicker from './ColorPicker.vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  /** Pass null to add, or an existing sector object to edit */
  initial: { type: Object, default: null },
})
const emit = defineEmits(['close', 'submit'])

const isEditing = computed(() => props.initial !== null)

const form = reactive({
  name: '',
  value: 25,
  color: '#4F46E5',
})

// Populate form when modal opens
watch(
  () => props.show,
  (open) => {
    if (!open) return
    if (props.initial) {
      form.name  = props.initial.name
      form.value = props.initial.value
      form.color = props.initial.color
    } else {
      form.name  = ''
      form.value = 25
      form.color = '#4F46E5'
    }
  }
)

const isValid = computed(() => form.name.trim().length > 0 && form.value > 0)

function submit() {
  if (!isValid.value) return
  emit('submit', { name: form.name.trim(), value: Number(form.value), color: form.color })
}
</script>

<style scoped>
/* Overlay */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(30, 32, 50, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 16px;
}

/* Modal box */
.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 440px;
  box-shadow: var(--shadow-lg);
}

.modal-title {
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: 24px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 24px;
}

.btn-primary { flex: 1; }
.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Transitions */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.2s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.22s ease;
}
.modal-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.97);
}
.modal-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}
</style>
