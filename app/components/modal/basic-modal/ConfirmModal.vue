<!-- filepath: /Users/rasya2121/Documents/code/pkl/JHIC/aicademy-frontend/app/components/modal/basic-modal/ConfirmModal.vue -->
<template>
  <!-- Backdrop dengan fade animation -->
  <Transition
    name="backdrop"
    enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
      @click="handleBackdropClick"
    >
      <!-- Modal dengan slide-in animation -->
      <Transition
        name="modal"
        enter-active-class="transition-all duration-500"
        leave-active-class="transition-all duration-300"
        enter-from-class="opacity-0 scale-90 translate-y-8"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-90 -translate-y-8"
      >
        <div 
          v-if="isOpen"
          class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform"
          @click.stop
        >
          <!-- Header dengan icon shake animation -->
          <div class="p-6 text-center">
            <div class="mb-4">
              <div 
                class="w-16 h-16 mx-auto rounded-full flex items-center justify-center animate-pulse-gentle"
                :class="iconBgClass"
              >
                <Icon 
                  :name="iconName" 
                  class="w-8 h-8 animate-shake" 
                  :class="iconColorClass" 
                />
              </div>
            </div>
            
            <!-- Title dengan typewriter effect -->
            <h3 
              class="text-xl font-semibold mb-2 animate-slide-up"
              :class="titleColorClass"
            >
              {{ title }}
            </h3>
            
            <!-- Message dengan wave animation -->
            <p class="text-gray-600 leading-relaxed animate-fade-in-up">
              {{ message }}
            </p>
          </div>

          <!-- Footer dengan animated buttons -->
          <div class="px-6 pb-6 flex gap-3">
            <button
              @click="handleCancel"
              class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:shadow-md active:scale-95 animate-slide-in-left"
            >
              {{ cancelText }}
            </button>
            <button
              @click="handleConfirm"
              class="flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 animate-slide-in-right"
              :class="confirmButtonClass"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
export type ConfirmType = 'danger' | 'warning' | 'info' | 'success'

const props = withDefaults(defineProps<{
  isOpen: boolean
  type?: ConfirmType
  title: string
  message: string
  cancelText?: string
  confirmText?: string
}>(), {
  type: 'warning',
  cancelText: 'Batal',
  confirmText: 'Konfirmasi'
})

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  'cancel': []
  'confirm': []
}>()

const iconName = computed(() => {
  const icons = {
    danger: 'heroicons:exclamation-triangle-20-solid',
    warning: 'heroicons:exclamation-triangle-20-solid',
    info: 'heroicons:information-circle-20-solid',
    success: 'heroicons:check-circle-20-solid'
  }
  return icons[props.type]
})

const iconBgClass = computed(() => {
  const classes = {
    danger: 'bg-red-100 shadow-red-200/50',
    warning: 'bg-yellow-100 shadow-yellow-200/50',
    info: 'bg-blue-100 shadow-blue-200/50',
    success: 'bg-green-100 shadow-green-200/50'
  }
  return classes[props.type]
})

const iconColorClass = computed(() => {
  const classes = {
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
    success: 'text-green-600'
  }
  return classes[props.type]
})

const titleColorClass = computed(() => {
  const classes = {
    danger: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
    success: 'text-green-800'
  }
  return classes[props.type]
})

const confirmButtonClass = computed(() => {
  const classes = {
    danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-200/50',
    warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg shadow-yellow-200/50',
    info: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-200/50',
    success: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-200/50'
  }
  return classes[props.type]
})

const handleCancel = () => {
  emit('cancel')
  emit('update:isOpen', false)
}

const handleConfirm = () => {
  emit('confirm')
  emit('update:isOpen', false)
}

const handleBackdropClick = (event: Event) => {
  if (event.target === event.currentTarget) {
    handleCancel()
  }
}
</script>

<style scoped>
/* Custom animations */
@keyframes pulse-gentle {
  0%, 100% { 
    transform: scale(1);
    opacity: 1;
  }
  50% { 
    transform: scale(1.05);
    opacity: 0.9;
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
}

@keyframes slide-up {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fade-in-up {
  0% {
    transform: translateY(15px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slide-in-left {
  0% {
    transform: translateX(-20px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-in-right {
  0% {
    transform: translateX(20px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-pulse-gentle {
  animation: pulse-gentle 3s infinite;
}

.animate-shake {
  animation: shake 0.8s ease-in-out;
}

.animate-slide-up {
  animation: slide-up 0.5s ease-out 0.1s both;
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out 0.2s both;
}

.animate-slide-in-left {
  animation: slide-in-left 0.4s ease-out 0.3s both;
}

.animate-slide-in-right {
  animation: slide-in-right 0.4s ease-out 0.35s both;
}

/* Smooth transitions for all interactive elements */
button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

button:active {
  transition: all 0.1s;
}

/* Hover effects */
button:hover {
  transform: scale(1.05) translateY(-1px);
}

button:active {
  transform: scale(0.95) translateY(0);
}
</style>