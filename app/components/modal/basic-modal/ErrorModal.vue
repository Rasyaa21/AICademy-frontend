<template>
    <div 
        v-if="isOpen" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click="handleClose"
    >
        <div 
            class="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 transform transition-all duration-300 scale-100"
            @click.stop
        >
            <div class="text-center">
                <!-- Error Icon -->
                <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <Icon name="heroicons:x-circle-20-solid" class="w-8 h-8 text-red-600" />
                </div>
                
                <!-- Title -->
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Error</h3>
                
                <!-- Message -->
                <p class="text-gray-600 mb-6">{{ message }}</p>
                
                <!-- Action Buttons -->
                <div class="flex gap-3">
                    <button
                        v-if="showRetry"
                        class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        @click="handleRetry"
                    >
                        Retry
                    </button>
                    <button
                        class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        @click="handleClose"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    isOpen: boolean
    message: string
    showRetry?: boolean
}

interface Emits {
    (e: 'update:isOpen', value: boolean): void
    (e: 'close'): void
    (e: 'retry'): void
}

withDefaults(defineProps<Props>(), {
    showRetry: false
})

const emit = defineEmits<Emits>()

const handleClose = () => {
    emit('update:isOpen', false)
    emit('close')
}

const handleRetry = () => {
    emit('retry')
    handleClose()
}

// Close on escape key
onMounted(() => {
    const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            handleClose()
        }
    }
    
    document.addEventListener('keydown', handleEscape)
    
    onUnmounted(() => {
        document.removeEventListener('keydown', handleEscape)
    })
})
</script>