<template>
    <!-- Modal Buat CV -->
    <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm"
    >
        <div class="mx-4 w-full max-w-md bg-white rounded-xl shadow-xl">
            <div class="p-6 border-b border-gray-200">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-gray-900">Buat CV Baru</h3>
                    <button
                        @click="closeModal"
                        class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="p-4 m-6 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-sm text-red-600">{{ errorMessage }}</p>
            </div>

            <form class="p-6 space-y-4" @submit.prevent="handleSubmit">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Judul CV</label>
                    <input
                        v-model="title"
                        type="text"
                        placeholder="Contoh: Software Developer CV - 2025"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                    />
                </div>

                <div class="flex gap-3 pt-4">
                    <button
                        type="button"
                        @click="closeModal"
                        class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        :disabled="isSubmitting"
                        class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <Icon
                            v-if="isSubmitting"
                            name="heroicons:arrow-path-20-solid"
                            class="w-4 h-4 animate-spin"
                        />
                        {{ isSubmitting ? 'Membuat...' : 'Buat CV' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
// filepath: /Users/rasya2121/Documents/code/pkl/JHIC/aicademy-frontend/app/components/modal/student/CvCreateModal.vue
import { ref, watch } from 'vue'

interface Props {
    isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'update:isOpen': [value: boolean]
    'cv-created': []
    'show-alert': [type: string, title: string, message: string]
}>()

const config = useRuntimeConfig()

// State
const title = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')

// Watch for modal open/close
watch(() => props.isOpen, (isOpen) => {
    if (!isOpen) {
        resetForm()
    }
})

const handleSubmit = async () => {
    if (isSubmitting.value) return

    try {
        isSubmitting.value = true
        errorMessage.value = ''

        const response = await $fetch('/student/cv/generate', {
            baseURL: config.public.apiBase,
            credentials: 'include',
            method: 'POST',
            body: {
                title: title.value
            }
        })

        if (response?.success) {
            emit('show-alert', 'success', 'Berhasil!', 'CV berhasil dibuat.')
            emit('cv-created')
            closeModal()
        }
    } catch (error: any) {
        console.error('Error generating CV:', error)
        errorMessage.value = error?.data?.message || 'Gagal membuat CV. Silakan coba lagi.'
    } finally {
        isSubmitting.value = false
    }
}

const closeModal = () => {
    emit('update:isOpen', false)
}

const resetForm = () => {
    title.value = ''
    isSubmitting.value = false
    errorMessage.value = ''
}
</script>