<template>  
    <div v-if="isOpen" class="flex fixed inset-0 z-50 justify-center items-center min-h-screen bg-black bg-opacity-50">
        <div class="mx-4 w-full max-w-md bg-white rounded-xl shadow-xl">
            <div class="p-6 border-b border-gray-200">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-gray-900">Upload CSV File</h3>
                    <button 
                        @click="closeModal"
                        class="text-gray-400 hover:text-gray-600"
                    >
                        <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
                <!-- File Upload Field -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                        File CSV Siswa
                    </label>
                    <div class="relative">
                        <input 
                            type="file" 
                            accept=".csv,text/csv"
                            ref="fileInput"
                            @change="onFileChange"
                            class="block px-3 py-2 w-full rounded-lg border border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        >
                    </div>
                    
                    <!-- File Info -->
                    <div v-if="fileName" class="flex gap-2 items-center text-sm text-green-600">
                        <Icon name="heroicons:document-check-20-solid" class="w-4 h-4" />
                        <span>{{ fileName }}</span>
                    </div>
                    
                    <!-- Instructions -->
                    <p class="text-xs text-gray-500">
                        Format: CSV dengan kolom fullname, nis, class, email
                    </p>
                </div>

                <!-- Error Display -->
                <div v-if="error" class="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div class="flex gap-2 items-center">
                        <Icon name="heroicons:exclamation-circle-20-solid" class="w-4 h-4 text-red-500" />
                        <span class="text-sm text-red-600">{{ error }}</span>
                    </div>
                </div>

                <!-- Success Display -->
                <div v-if="message" class="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div class="flex gap-2 items-center">
                        <Icon name="heroicons:check-circle-20-solid" class="w-4 h-4 text-green-500" />
                        <span class="text-sm text-green-600">{{ message }}</span>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-3 pt-4">
                    <button
                        type="button"
                        @click="reset"
                        class="flex-1 px-4 py-2 text-gray-700 rounded-lg border border-gray-300 transition-colors hover:bg-gray-50"
                        :disabled="loading"
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        :disabled="!file || loading"
                        class="flex-1 px-4 py-2 text-white rounded-lg transition-colors bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {{ loading ? 'Uploading...' : 'Upload CSV' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

defineProps<{
    isOpen: boolean
}>()

const emit = defineEmits<{
    'update:isOpen': [value: boolean]
    'show-success-modal': [message: string]
    'show-error-modal': [message: string]
}>()

const file = ref<File | null>(null)
const fileName = computed(() => file.value?.name ?? '')
const loading = ref(false)
const error = ref('')
const message = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const onFileChange = (event: Event) => {
    error.value = ''
    message.value = ''
    
    const input = event.target as HTMLInputElement
    const selectedFile = input.files?.[0] || null
    
    if (!selectedFile) {
        file.value = null
        return
    }
    
    // Validate file type
    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
        error.value = 'Harap pilih file dengan format .csv'
        file.value = null
        if (fileInput.value) fileInput.value.value = ''
        return
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (selectedFile.size > maxSize) {
        error.value = 'Ukuran file terlalu besar. Maksimal 5MB'
        file.value = null
        if (fileInput.value) fileInput.value.value = ''
        return
    }
    
    file.value = selectedFile
}

const reset = () => {
    if (fileInput.value) fileInput.value.value = ''
    file.value = null
    error.value = ''
    message.value = ''
}

const closeModal = () => {
    emit('update:isOpen', false)
    reset()
}

const handleSubmit = async () => {
    if (!file.value) {
        error.value = 'Harap pilih file CSV terlebih dahulu'
        return
    }
    
    loading.value = true
    error.value = ''
    message.value = ''
    
    // Create FormData for file upload
    const formData = new FormData()
    formData.append('file', file.value)
    
    try {
        const res = await $fetch('/admin/students/upload-csv', {
            method: 'POST',
            body: formData,
            credentials: 'include',
            baseURL: config.public.apiBase
        })
        
        // Success response
        if (res) {
            console.log("success")
            const successMessage = `Berhasil mengupload ${file.value.name}. Data siswa telah ditambahkan.`
            emit('show-success-modal', successMessage)
            closeModal()
        }
    } catch (error: unknown) {
        console.error('Error uploading CSV:', error)
        
        const err = error as { 
            status?: number; 
            statusCode?: number; 
            data?: { message?: string; error?: string }; 
            message?: string 
        }
        
        let errorMessage = 'Terjadi kesalahan saat mengupload file CSV'
        
        // Handle specific error status codes
        if (err.status === 400 || err.statusCode === 400) {
            // Bad request - validation error
            if (err.data?.message) {
                errorMessage = err.data.message
            } else {
                errorMessage = 'Format file CSV tidak valid atau data tidak sesuai'
            }
        } else if (err.status === 413 || err.statusCode === 413) {
            // File too large
            errorMessage = 'Ukuran file terlalu besar'
        } else if (err.status === 415 || err.statusCode === 415) {
            // Unsupported media type
            errorMessage = 'Format file tidak didukung. Harap gunakan file .csv'
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
        loading.value = false
    }
}
</script>