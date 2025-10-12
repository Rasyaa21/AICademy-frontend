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
                <!-- Success Icon -->
                <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Icon name="heroicons:check-circle-20-solid" class="w-8 h-8 text-green-600" />
                </div>
                
                <!-- Title -->
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Success!</h3>
                
                <!-- Message -->
                <p class="text-gray-600 mb-6">{{ message }}</p>
                
                <!-- Action Button -->
                <button
                    class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    @click="handleClose"
                >
                    OK
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    isOpen: boolean
    message: string
}

interface Emits {
    (e: 'update:isOpen', value: boolean): void
    (e: 'close'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleClose = () => {
    emit('update:isOpen', false)
    emit('close')
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