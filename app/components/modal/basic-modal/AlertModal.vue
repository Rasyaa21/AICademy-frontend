<!-- filepath: /Users/rasya2121/Documents/code/pkl/JHIC/aicademy-frontend/app/components/modal/basic-modal/AlertModal.vue -->
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
      <!-- Modal dengan bounce-in animation -->
      <Transition
        name="modal"
        enter-active-class="transition-all duration-500"
        leave-active-class="transition-all duration-300"
        enter-from-class="opacity-0 scale-75 -translate-y-10"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-75 translate-y-10"
      >
        <div 
          v-if="isOpen"
          class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform"
          @click.stop
        >
          <!-- Header dengan icon bounce animation -->
          <div class="p-6 text-center">
            <div class="mb-4">
              <div 
                class="w-16 h-16 mx-auto rounded-full flex items-center justify-center animate-bounce-gentle"
                :class="iconBgClass"
              >
                <Icon 
                  :name="iconName" 
                  class="w-8 h-8 animate-icon-pop" 
                  :class="iconColorClass" 
                />
              </div>
            </div>
            
            <!-- Title dengan slide-up animation -->
            <h3 
              class="text-xl font-semibold mb-2 animate-slide-up"
              :class="titleColorClass"
            >
              {{ title }}
            </h3>
            
            <!-- Message dengan fade-in delayed -->
            <p class="text-gray-600 leading-relaxed animate-fade-in-up">
              {{ message }}
            </p>
          </div>

          <!-- Footer dengan button hover effects -->
          <div class="px-6 pb-6">
            <button
              @click="handleOk"
              class="w-full px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
              :class="buttonClass"
            >
              {{ okText }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
export type AlertType = 'success' | 'error' | 'warning' | 'info'

const props = withDefaults(defineProps<{
  isOpen: boolean
  type?: AlertType
  title: string
  message: string
  okText?: string
}>(), {
  type: 'info',
  okText: 'OK'
})

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  'ok': []
}>()

const iconName = computed(() => {
  const icons = {
    success: 'heroicons:check-circle-20-solid',
    error: 'heroicons:x-circle-20-solid',
    warning: 'heroicons:exclamation-triangle-20-solid',
    info: 'heroicons:information-circle-20-solid'
  }
  return icons[props.type]
})

const iconBgClass = computed(() => {
  const classes = {
    success: 'bg-green-100 shadow-green-200/50',
    error: 'bg-red-100 shadow-red-200/50',
    warning: 'bg-yellow-100 shadow-yellow-200/50',
    info: 'bg-blue-100 shadow-blue-200/50'
  }
  return classes[props.type]
})

const iconColorClass = computed(() => {
  const classes = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  }
  return classes[props.type]
})

const titleColorClass = computed(() => {
  const classes = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800'
  }
  return classes[props.type]
})

const buttonClass = computed(() => {
  const classes = {
    success: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-200/50',
    error: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-200/50',
    warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg shadow-yellow-200/50',
    info: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-200/50'
  }
  return classes[props.type]
})

const handleOk = () => {
  emit('ok')
  emit('update:isOpen', false)
}

const handleBackdropClick = (event: Event) => {
  if (event.target === event.currentTarget) {
    handleOk()
  }
}
</script>

<style scoped>
/* Custom animations */
@keyframes bounce-gentle {
  0%, 100% { 
    transform: translateY(0); 
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% { 
    transform: translateY(-10px); 
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

@keyframes icon-pop {
  0% { 
    transform: scale(0.8) rotate(-10deg); 
    opacity: 0;
  }
  50% { 
    transform: scale(1.1) rotate(5deg); 
  }
  100% { 
    transform: scale(1) rotate(0deg); 
    opacity: 1;
  }
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

.animate-bounce-gentle {
  animation: bounce-gentle 2s infinite;
}

.animate-icon-pop {
  animation: icon-pop 0.6s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.5s ease-out 0.1s both;
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out 0.2s both;
}

/* Smooth transitions for all interactive elements */
button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

button:active {
  transition: all 0.1s;
}
</style>