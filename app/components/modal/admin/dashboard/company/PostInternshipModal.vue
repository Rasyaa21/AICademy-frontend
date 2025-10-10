<template>
    <div v-if="isOpen" class="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div 
            class="fixed inset-0 bg-black bg-opacity-60 transition-opacity"
            @click="closeModal"
        ></div>
        
        <!-- Modal -->
        <div class="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
                <h3 class="text-xl font-semibold text-gray-900">Post Internship Baru</h3>
                <button 
                    @click="closeModal"
                    class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                    :disabled="isSubmitting"
                >
                    <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
                </button>
            </div>
            
            <!-- Form -->
            <div class="max-h-[calc(90vh-120px)] overflow-y-auto">
                <form @submit.prevent="submitForm" class="p-6 space-y-6">
                    <!-- Title -->
                    <div>
                        <label for="title" class="block text-sm font-semibold text-gray-700 mb-2">
                            Judul Internship <span class="text-red-500">*</span>
                        </label>
                        <input
                            id="title"
                            v-model="formData.title"
                            type="text"
                            class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                            placeholder="Masukkan judul internship"
                            :class="{ 'border-red-500 focus:border-red-500': errors.title }"
                            :disabled="isSubmitting"
                        >
                        <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
                    </div>

                    <!-- Description -->
                    <div>
                        <label for="description" class="block text-sm font-semibold text-gray-700 mb-2">
                            Deskripsi <span class="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            v-model="formData.description"
                            rows="4"
                            class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none"
                            placeholder="Masukkan deskripsi internship"
                            :class="{ 'border-red-500 focus:border-red-500': errors.description }"
                            :disabled="isSubmitting"
                        ></textarea>
                        <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
                    </div>

                    <!-- Type -->
                    <div>
                        <label for="type" class="block text-sm font-semibold text-gray-700 mb-2">
                            Tipe Internship <span class="text-red-500">*</span>
                        </label>
                        <select
                            id="type"
                            v-model="formData.type"
                            class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                            :class="{ 'border-red-500 focus:border-red-500': errors.type }"
                            :disabled="isSubmitting"
                        >
                            <option value="PKL">PKL (Praktik Kerja Lapangan)</option>
                            <!-- Future-proof for more types -->
                            <!-- <option value="MAGANG">Magang</option> -->
                            <!-- <option value="INTERNSHIP">Internship</option> -->
                        </select>
                        <p v-if="errors.type" class="mt-1 text-sm text-red-600">{{ errors.type }}</p>
                    </div>

                    <!-- Deadline -->
                    <div>
                        <label for="deadline" class="block text-sm font-semibold text-gray-700 mb-2">
                            Deadline <span class="text-red-500">*</span>
                        </label>
                        <input
                            id="deadline"
                            v-model="formData.deadline"
                            type="datetime-local"
                            class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                            :class="{ 'border-red-500 focus:border-red-500': errors.deadline }"
                            :disabled="isSubmitting"
                            :min="minDateTime"
                        >
                        <p v-if="errors.deadline" class="mt-1 text-sm text-red-600">{{ errors.deadline }}</p>
                        <p class="mt-1 text-xs text-gray-500">Pilih tanggal dan waktu deadline untuk aplikasi internship</p>
                    </div>
                </form>
            </div>

            <!-- Footer -->
            <div class="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                    type="button"
                    @click="closeModal"
                    class="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:ring-offset-2"
                    :disabled="isSubmitting"
                >
                    Batal
                </button>
                <button
                    @click="submitForm"
                    :disabled="isSubmitting || !isFormValid"
                    class="flex-1 px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary/90 active:bg-primary/95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
                >
                    {{ isSubmitting ? 'Memposting...' : 'Post Internship' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
    isOpen: boolean
    companyId: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'update:isOpen': [value: boolean]
    'show-success-modal': [message: string]
    'show-error-modal': [message: string]
    'internship-posted': []
}>()

const config = useRuntimeConfig()
const headers = useRequestHeaders(['cookie'])

// Form data
const formData = ref({
    title: '',
    description: '',
    type: 'PKL',
    deadline: ''
})

// Form validation
const errors = ref({
    title: '',
    description: '',
    type: '',
    deadline: ''
})

const isSubmitting = ref(false)

// Minimum datetime (current time)
const minDateTime = computed(() => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
})

// Form validation
const isFormValid = computed(() => {
    return formData.value.title.trim().length >= 3 &&
           formData.value.description.trim().length >= 10 &&
           formData.value.type &&
           formData.value.deadline &&
           new Date(formData.value.deadline) > new Date()
})

// Watch for modal close to reset form
watch(() => props.isOpen, (newVal) => {
    if (!newVal) {
        resetForm()
    }
})

const validateForm = () => {
    errors.value = {
        title: '',
        description: '',
        type: '',
        deadline: ''
    }

    let isValid = true

    // Title validation
    if (!formData.value.title.trim()) {
        errors.value.title = 'Judul internship wajib diisi'
        isValid = false
    } else if (formData.value.title.trim().length < 3) {
        errors.value.title = 'Judul minimal 3 karakter'
        isValid = false
    } else if (formData.value.title.trim().length > 100) {
        errors.value.title = 'Judul maksimal 100 karakter'
        isValid = false
    }

    // Description validation
    if (!formData.value.description.trim()) {
        errors.value.description = 'Deskripsi wajib diisi'
        isValid = false
    } else if (formData.value.description.trim().length < 10) {
        errors.value.description = 'Deskripsi minimal 10 karakter'
        isValid = false
    }

    // Type validation
    const allowedTypes = ['PKL']
    if (!allowedTypes.includes(formData.value.type)) {
        errors.value.type = 'Tipe internship tidak valid'
        isValid = false
    }

    // Deadline validation
    if (!formData.value.deadline) {
        errors.value.deadline = 'Deadline wajib diisi'
        isValid = false
    } else if (new Date(formData.value.deadline) <= new Date()) {
        errors.value.deadline = 'Deadline harus lebih dari waktu sekarang'
        isValid = false
    }

    return isValid
}

const submitForm = async () => {
    if (!validateForm() || !props.companyId || isSubmitting.value) {
        return
    }

    try {
        isSubmitting.value = true

        // Convert local datetime to UTC ISO string with T23:59:00Z
        const deadlineDate = new Date(formData.value.deadline)
        const deadlineISO = deadlineDate.toISOString()

        const requestBody = {
            company_id: props.companyId,
            title: formData.value.title.trim(),
            description: formData.value.description.trim(),
            type: formData.value.type,
            deadline: deadlineISO
        }

        console.log('Posting internship:', requestBody)

        const response = await $fetch('/admin/users/internships', {
            method: 'POST',
            body: requestBody,
            baseURL: config.public.apiBase,
            credentials: 'include',
            headers
        })

        console.log('Internship posted successfully:', response)

        emit('show-success-modal', 'Internship berhasil diposting')
        emit('internship-posted')
        closeModal()
    } catch (error: any) {
        console.error('Error posting internship:', error)
        const errorMessage = error?.data?.message || error?.message || 'Gagal memposting internship'
        emit('show-error-modal', errorMessage)
    } finally {
        isSubmitting.value = false
    }
}

const resetForm = () => {
    formData.value = {
        title: '',
        description: '',
        type: 'PKL',
        deadline: ''
    }
    errors.value = {
        title: '',
        description: '',
        type: '',
        deadline: ''
    }
    isSubmitting.value = false
}

const closeModal = () => {
    if (!isSubmitting.value) {
        emit('update:isOpen', false)
    }
}
</script>