<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4">
            <div class="p-6 border-b border-gray-200">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-gray-900">
                        {{ isEditing ? 'Edit Perusahaan' : 'Tambah Perusahaan Baru' }}
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
                    v-model="formData.company_name"
                    name="company_name" 
                    placeholder="Nama Perusahaan" 
                    label="Nama Perusahaan"
                    required
                >
                    <template #icon>
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                    </template>
                </MainTextfield>

                <!-- Company Logo File Upload -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Logo Perusahaan</label>
                    <div class="flex items-center space-x-4">
                        <!-- Preview -->
                        <div class="flex-shrink-0">
                            <div class="w-16 h-16 rounded-lg border-2 border-gray-300 border-dashed flex items-center justify-center overflow-hidden">
                                <img 
                                    v-if="logoPreview" 
                                    :src="logoPreview" 
                                    alt="Logo preview" 
                                    class="w-full h-full object-cover rounded-lg"
                                />
                                <div v-else class="text-gray-400">
                                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <!-- Upload Button -->
                        <div class="flex-1">
                            <input
                                ref="fileInput"
                                type="file"
                                accept="image/*"
                                @change="handleFileUpload"
                                class="hidden"
                            />
                            <button
                                type="button"
                                @click="$refs.fileInput.click()"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                {{ logoFile ? 'Ganti Logo' : 'Pilih Logo' }}
                            </button>
                        </div>
                    </div>
                    <p v-if="logoFile" class="text-xs text-gray-500">{{ logoFile.name }}</p>
                </div>

                <MainTextfield 
                    v-model="formData.company_location"
                    name="company_location" 
                    placeholder="Lokasi Perusahaan" 
                    label="Lokasi Perusahaan"
                >
                    <template #icon>
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                    </template>
                </MainTextfield>

                <MainTextfield 
                    v-model="formData.description"
                    name="description" 
                    placeholder="Deskripsi Perusahaan" 
                    label="Deskripsi"
                    :is-textarea="true"
                    rows="3"
                >
                    <template #icon>
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </template>
                </MainTextfield>

                <MainTextfield 
                    v-model="formData.email"
                    name="email" 
                    placeholder="Email Perusahaan" 
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

                <MainTextfield 
                    v-if="!isEditing"
                    v-model="formData.password"
                    name="password" 
                    placeholder="Password" 
                    label="Password"
                    :is-password="true"
                    required
                >
                    <template #icon>
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
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
                        :disabled="isSubmitting"
                        class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {{ isSubmitting ? 'Menyimpan...' : (isEditing ? 'Update' : 'Simpan') }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import MainTextfield from '~/components/textfield/MainTextfield.vue';

const config = useRuntimeConfig()

const props = defineProps<{
    isOpen: boolean
    editData?: {
        id?: string
        company_name?: string
        company_logo?: string
        company_location?: string
        description?: string
        email?: string
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
    company_name: '',
    company_location: '',
    description: '',
    email: '',
    password: ''
})

const logoFile = ref<File | null>(null)
const logoPreview = ref<string | null>(null)

const resetForm = () => {
    formData.value = {
        company_name: '',
        company_location: '',
        description: '',
        email: '',
        password: ''
    }
    logoFile.value = null
    logoPreview.value = null
}

const closeModal = () => {
    emit('update:isOpen', false)
    resetForm()
}

const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    
    if (file) {
        logoFile.value = file
        
        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
            logoPreview.value = e.target?.result as string
        }
        reader.readAsDataURL(file)
    }
}

const handleSubmit = async () => {
    isSubmitting.value = true
    
    try {
        const submitData = new FormData()
        
        // Add required fields
        submitData.append('company_name', formData.value.company_name)
        submitData.append('email', formData.value.email)
        
        if (!isEditing.value) {
            submitData.append('password', formData.value.password)
        }
        
        // Add optional fields
        if (formData.value.company_location) {
            submitData.append('company_location', formData.value.company_location)
        }
        
        if (formData.value.description) {
            submitData.append('description', formData.value.description)
        }
        
        // Add logo file if exists
        if (logoFile.value) {
            submitData.append('company_logo', logoFile.value)
        }
        
        const endpoint = isEditing.value 
            ? `/admin/users/companies/${props.editData?.id}` 
            : '/admin/users/companies'
        
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
                ? 'Berhasil mengupdate data perusahaan' 
                : 'Berhasil menambahkan perusahaan baru'
            emit('show-success-modal', message)
            closeModal()
        }
    } catch (error: unknown) {
        console.error('Error submitting company data:', error)
        
        const err = error as { status?: number; statusCode?: number; data?: { message?: string; error?: string; field?: string }; message?: string }
        
        let errorMessage = 'Terjadi kesalahan saat menyimpan data perusahaan'
        
        // Handle specific error status codes
        if (err.status === 409 || err.statusCode === 409) {
            // Conflict - data already exists
            if (err.data?.message) {
                errorMessage = err.data.message
            } else if (err.data?.field) {
                const field = err.data.field
                const fieldNames: Record<string, string> = {
                    'email': 'Email',
                    'company_name': 'Nama perusahaan'
                }
                errorMessage = `${fieldNames[field] || field} sudah terdaftar dalam sistem`
            } else {
                errorMessage = 'Data perusahaan sudah ada dalam sistem'
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
    } finally {
        isSubmitting.value = false
    }
}

watch(() => props.editData, (newData) => {
    if (newData) {
        formData.value = {
            company_name: newData.company_name || '',
            company_location: newData.company_location || '',
            description: newData.description || '',
            email: newData.email || '',
            password: ''
        }
        
        // Set logo preview if exists
        if (newData.company_logo) {
            logoPreview.value = newData.company_logo
        }
    }
}, { immediate: true })

watch(() => props.isOpen, (isOpen) => {
    if (!isOpen) {
        resetForm()
    }
})
</script>