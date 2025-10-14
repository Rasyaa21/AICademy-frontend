<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4">
            <div class="p-6 border-b border-gray-200">
                <div class="flex items-center justify-between">
                    <h2 class="text-xl font-semibold text-gray-900">
                        {{ isEditing ? 'Edit Challenge' : 'Tambah Challenge Baru' }}
                    </h2>
                    <button 
                        class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        @click="closeModal"
                    >
                        <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5 text-gray-500" />
                    </button>
                </div>
            </div>

            <form class="p-6 space-y-4" @submit.prevent="handleSubmit">
                <MainTextfield 
                    v-model="formData.title"
                    label="Judul Challenge"
                    placeholder="Masukkan judul challenge"
                    :required="true"
                >
                    <template #icon>
                        <Icon name="heroicons:trophy-20-solid" class="w-5 h-5 text-gray-400" />
                    </template>
                </MainTextfield>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Deskripsi Challenge</label>
                    <textarea
                        v-model="formData.description"
                        rows="4"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                        placeholder="Jelaskan detail challenge..."
                    />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                        <input
                            v-model="formData.deadline"
                            type="datetime-local"
                            required
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                    </div>

                    <MainTextfield 
                        v-model="formData.prize"
                        label="Hadiah"
                        placeholder="e.g., Rp 10.000.000"
                        :required="true"
                    >
                        <template #icon>
                            <Icon name="heroicons:currency-dollar-20-solid" class="w-5 h-5 text-gray-400" />
                        </template>
                    </MainTextfield>
                </div>

                <MainTextfield 
                    v-model.number="formData.max_participants"
                    label="Maksimal Peserta"
                    type="number"
                    placeholder="100"
                    :required="true"
                >
                    <template #icon>
                        <Icon name="heroicons:user-group-20-solid" class="w-5 h-5 text-gray-400" />
                    </template>
                </MainTextfield>

                <div class="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        @click="closeModal"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                        :disabled="isSubmitting"
                    >
                        {{ isSubmitting ? 'Menyimpan...' : (isEditing ? 'Update Challenge' : 'Tambah Challenge') }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import MainTextfield from '~/components/textfield/MainTextfield.vue'

const config = useRuntimeConfig()

const props = defineProps<{
    isOpen: boolean
    editData?: {
        id?: string
        title?: string
        description?: string
        deadline?: string
        prize?: string
        max_participants?: number
    }
}>()

const emit = defineEmits<{
    'update:isOpen': [value: boolean]
    'show-success-modal': [message: string]
    'show-error-modal': [message: string]
}>()

const isEditing = computed(() => !!props.editData)
const isSubmitting = ref(false)

const formData = ref({
    title: '',
    description: '',
    deadline: '',
    prize: '',
    max_participants: 100
})

const resetForm = () => {
    formData.value = {
        title: '',
        description: '',
        deadline: '',
        prize: '',
        max_participants: 100
    }
}

const closeModal = () => {
    emit('update:isOpen', false)
    resetForm()
}

const formatDateTimeLocal = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toISOString().slice(0, 16)
}

const handleSubmit = async () => {
    isSubmitting.value = true
    
    try {
        const submitData = {
            title: formData.value.title,
            description: formData.value.description,
            deadline: new Date(formData.value.deadline).toISOString(),
            prize: formData.value.prize,
            max_participants: formData.value.max_participants
        }
        
        const endpoint = isEditing.value 
            ? `/teacher/challenges/${props.editData?.id}` 
            : '/teacher/challenges'
        
        const method = isEditing.value ? 'PUT' : 'POST'
        
        const res = await $fetch(endpoint, {
            method,
            body: submitData,
            credentials: 'include',
            baseURL: config.public.apiBase
        })
        
        // Success response
        if (res) {
            const message = isEditing.value 
                ? 'Challenge berhasil diupdate'
                : 'Challenge baru berhasil ditambahkan'
            emit('show-success-modal', message)
            closeModal()
        }
    } catch (error: unknown) {
        console.error('Error submitting challenge data:', error)
        
        const err = error as { status?: number; statusCode?: number; data?: { message?: string; error?: string }; message?: string }
        
        let errorMessage = 'Terjadi kesalahan saat menyimpan data challenge'
        
        // Handle specific error status codes
        if (err.status === 400 || err.statusCode === 400) {
            if (err.data?.message) {
                errorMessage = err.data.message
            } else {
                errorMessage = 'Data yang dimasukkan tidak valid'
            }
        } else if (err.status === 500 || err.statusCode === 500) {
            errorMessage = 'Terjadi kesalahan pada server, silakan coba lagi'
        } else if (err.data?.message) {
            errorMessage = err.data.message
        } else if (err.message) {
            errorMessage = err.message
        }
        
        emit('show-error-modal', errorMessage)
    } finally {
        isSubmitting.value = false
    }
}

watch(() => props.editData, (newData) => {
    if (newData) {
        formData.value = {
            title: newData.title || '',
            description: newData.description || '',
            deadline: formatDateTimeLocal(newData.deadline || ''),
            prize: newData.prize || '',
            max_participants: newData.max_participants || 100
        }
    }
}, { immediate: true })

watch(() => props.isOpen, (isOpen) => {
    if (!isOpen) {
        resetForm()
    }
})
</script>