<template>
    <div v-if="isOpen" class="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
        <div class="mx-4 w-full max-w-xl bg-white rounded-xl shadow-xl">
            <div class="p-6 border-b border-gray-200">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-gray-900">
                        {{ isEditing ? 'Edit Siswa' : 'Tambah Siswa Baru' }}
                    </h3>
                    <button 
                        @click="closeModal"
                        class="text-gray-400 hover:text-gray-600"
                    >
                        <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <form class="p-6 space-y-4" @submit.prevent="handleSubmit" >
                <MainTextfield 
                    v-model="formData.fullname"
                    name="fullname" 
                    placeholder="Nama Lengkap" 
                    label="Nama Lengkap"
                    required
                >
                    <template #icon>
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                    </template>
                </MainTextfield>

                <MainTextfield 
                    v-model="formData.nis"
                    name="nis" 
                    placeholder="NIS" 
                    label="NIS"
                    required
                > 
                    <template #icon>
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v2a1 1 0 01-1 1h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V8H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 3v1h6V3H9zm0 5v10h6V8H9z"></path>
                        </svg>
                    </template>
                </MainTextfield>

                <MainTextfield 
                    v-model="formData.class"
                    name="class" 
                    placeholder="Kelas" 
                    label="Kelas"
                    required
                >
                    <template #icon>
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M4 5h16v10H4zM4 15l-2 4h20l-2-4M12 5v10" />
                        </svg>
                    </template>
                </MainTextfield>

                <MainTextfield 
                    v-model="formData.email"
                    name="email" 
                    placeholder="Email" 
                    label="Email"
                    type="email"
                    required
                >
                    <template #icon>
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                        </svg>
                    </template> 
                </MainTextfield>

                <div class="flex gap-3 pt-4">
                    <button
                        type="button"
                        @click="closeModal"
                        class="flex-1 px-4 py-2 text-gray-700 rounded-lg border border-gray-300 transition-colors hover:bg-gray-50"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        class="flex-1 px-4 py-2 text-white rounded-lg transition-colors bg-primary hover:bg-primary/90"
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
import MainTextfield from '../textfield/MainTextfield.vue'

const config = useRuntimeConfig();
const props = defineProps<{
    isOpen: boolean
    editData?: {
        id?: string
        fullname?: string
        nis?: string
        class?: string
        email?: string
    }
}>()

const emit = defineEmits<{
    'update:isOpen': [value: boolean]
    'submit': [data: {
        fullname: string
        nis: string
        class: string
        email: string
    }]
    'show-success-modal': [message: string]
    'show-error-modal': [message: string]
}>()

const isEditing = computed(() => !!props.editData)


const formData = ref({
    fullname: '',
    nis: '',
    class: '',
    email: '',
})

const resetForm = () => {
    formData.value = {
        fullname: '',
        nis: '',
        class: '',
        email: '',
    }
}

const closeModal = () => {
    emit('update:isOpen', false)
    resetForm()
}

const handleSubmit = async () => {
    const payload = {
        fullname: formData.value.fullname,
        nis: formData.value.nis,
        class: formData.value.class,
        email: formData.value.email
    }

    try {
        const res = await $fetch('/admin/students', {
            method: "POST",
            body: payload,
            credentials: 'include',
            headers: {
                'Content-Type' : 'application/json'
            },
            baseURL: config.public.apiBase
        })
        
        // Success response
        if (res) {
            emit('show-success-modal', 'Berhasil menambahkan data siswa baru')
            closeModal()
        }
    } catch (error: unknown) {
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
                    'nis': 'NIS',
                    'email': 'Email',
                    'fullname': 'Nama lengkap'
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

watch(() => props.editData, (newData) => {
    if (newData) {
        formData.value = {
            fullname: newData.fullname || '',
            nis: newData.nis || '',
            class: newData.class || '',
            email: newData.email || '',
        }
    }
}, { immediate: true })

watch(() => props.isOpen, (isOpen) => {
    if (!isOpen) {
        resetForm()
    }
})
</script>