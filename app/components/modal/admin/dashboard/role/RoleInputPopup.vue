<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4">
            <div class="p-6 border-b border-gray-200">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-gray-900">
                        {{ isEditing ? 'Edit Role' : 'Tambah Role Baru' }}
                    </h3>
                    <button 
                        @click="closeModal"
                        class="text-gray-400 hover:text-gray-600"
                    >
                        <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
                <MainTextfield 
                    v-model="formData.name"
                    name="name" 
                    placeholder="Nama Role" 
                    label="Nama Role"
                    required
                >
                    <template #icon>
                        <Icon name="heroicons:clipboard-document-list" class="w-5 h-5 text-gray-400" />
                    </template>
                </MainTextfield>

                <MainTextfield 
                    v-model="formData.description"
                    name="description" 
                    placeholder="Deskripsi Role" 
                    label="Role"
                >
                    <template #icon>
                        <Icon name="heroicons:clipboard-document-list" class="w-5 h-5 text-gray-400" />
                    </template>
                </MainTextfield>

                <MainTextfield 
                    v-model="formData.category"
                    name="class" 
                    placeholder="class" 
                    label="class"
                >
                    <template #icon>
                        <Icon name="heroicons:clipboard-document-list" class="w-5 h-5 text-gray-400" />
                    </template>
                </MainTextfield>

                <div class="flex gap-3 pt-4">
                    <button
                        type="button"
                        @click="closeModal"
                        class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        {{ isEditing ? 'Update' : 'Simpan' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import MainTextfield from '../../../../textfield/MainTextfield.vue'



const config = useRuntimeConfig();
const props = defineProps<{
    isOpen: boolean
    editData?: {
        id?: string
        name?: string
        description?: string
        class?: string
    }
}>()

const emit = defineEmits<{
    'update:isOpen': [value: boolean]
    'submit': [data: {
        name: string
        description: string
        class: string
    }]
    'show-success-modal': [message: string]
    'show-error-modal': [message: string]
}>()

const isEditing = computed(() => !!props.editData)

const formData = ref({
    name: '',
    description: '',
    category: '',
})

const resetForm = () => {
    formData.value = {
        name: '',
        description: '',
        category: '',
    }
}

const closeModal = () => {
    emit('update:isOpen', false)
    resetForm()
}


const handleSubmit = async () => {
    const payload = {
        name: formData.value.name,
        description: formData.value.description,
        category: formData.value.category,
    }

    try {
        const res = await $fetch('/admin/questionnaires/target-roles', {
            method: "POST",
            body: payload,
            credentials: 'include',
            headers: {
                'Content-Type' : 'application/json'
            },
            baseURL: config.public.apiBase
        })
        
        if (res) {
            closeModal()
            emit('update:isOpen', false)
            emit('show-success-modal', 'Berhasil menambahkan data role baru')
        }
    } catch (error: unknown) {
        emit('update:isOpen', false)
        console.error('Error submitting student data:', error)
        
        const err = error as { status?: number; statusCode?: number; data?: { message?: string; error?: string; field?: string }; message?: string }
        
        let errorMessage = 'Terjadi kesalahan saat menyimpan data siswa'
        
        // Handle specific error status codes
        if (err.status === 409 || err.statusCode === 409) {
            // Conflict - data already exists
            if (err.data?.message) {
                errorMessage = err.data.message
            } else if (err.data?.field) {
                const field = err.data.field
                const fieldNames: Record<string, string> = {
                    'description': 'description',
                    'email': 'Email',
                    'name': 'Nama lengkap'
                }
                errorMessage = `${fieldNames[field] || field} sudah terdaftar dalam sistem`
            } else {
                errorMessage = 'Data siswa sudah ada dalam sistem'
            }
        } else if (err.status === 400 || err.statusCode === 400) {
            // Bad request - validation error
            if (err.data?.message) {
                errorMessage = err.data.message
            } else {
                errorMessage = 'Data yang dimasukkan tidak valid'
            }
        } else if (err.status === 500 || err.statusCode === 500) {
            // Server error
            errorMessage = 'Terjadi kesalahan pada server, silakan coba lagi'
        } else if (err.data?.message) {
            errorMessage = err.data.message
        } else if (err.message) {
            errorMessage = err.message
        }
        
        emit('show-error-modal', errorMessage)
    }
}

// watch(() => props.editData, (newData) => {
//     if (newData) {
//         formData.value = {
//             name: newData.name || '',
//             description: newData.description || '',
//             class: newData.class || '',
//             description: newData.description || '',
//             email: newData.email || '',
//             password: ''
//         }
//     }
// }, { immediate: true })

watch(() => props.isOpen, (isOpen) => {
    if (!isOpen) {
        resetForm()
    }
})
</script>