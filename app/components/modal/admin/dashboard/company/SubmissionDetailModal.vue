<template>
    <div v-if="isOpen" class="fixed inset-0 z-[80] flex items-center justify-center">
        <!-- Backdrop -->
        <div 
            class="fixed inset-0 bg-black bg-opacity-60 transition-opacity"
            @click="closeModal"
        ></div>
        
        <!-- Modal -->
        <div class="relative bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 class="text-xl font-semibold text-gray-900">Detail Submission</h3>
                <button 
                    @click="closeModal"
                    class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                    <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
                </button>
            </div>
            
            <!-- Loading State -->
            <div v-if="loading" class="p-8 text-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p class="text-gray-500 mt-2">Memuat detail submission...</p>
            </div>
            
            <!-- Error State -->
            <div v-else-if="error" class="p-8 text-center">
                <div class="text-red-500 mb-4">
                    <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <p class="text-red-600 font-medium">{{ error }}</p>
                <button 
                    @click="fetchSubmissionDetail"
                    class="mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Coba Lagi
                </button>
            </div>
            
            <!-- Content -->
            <div v-else-if="submissionDetail" class="max-h-[calc(90vh-180px)] overflow-y-auto">
                <div class="p-6 space-y-6">
                    <!-- Student Information -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
                            <Icon name="heroicons:academic-cap-20-solid" class="w-5 h-5 mr-2" />
                            Informasi Siswa
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                                <p class="mt-1 text-gray-900">{{ submissionDetail.student.fullname || 'Tidak tersedia' }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Email</label>
                                <p class="mt-1 text-gray-900">{{ submissionDetail.student.email || 'Tidak tersedia' }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">NIS</label>
                                <p class="mt-1 text-gray-900">{{ submissionDetail.student.nis || 'Tidak tersedia' }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Kelas</label>
                                <p class="mt-1 text-gray-900">{{ submissionDetail.student.class || 'Tidak tersedia' }}</p>
                            </div>
                        </div>
                        <div v-if="submissionDetail.student.headline" class="mt-4">
                            <label class="block text-sm font-medium text-gray-700">Bio/Headline</label>
                            <p class="mt-1 text-gray-900">{{ submissionDetail.student.headline }}</p>
                        </div>
                    </div>

                    <!-- Internship Information -->
                    <div class="bg-blue-50 rounded-lg p-4">
                        <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
                            <Icon name="heroicons:briefcase-20-solid" class="w-5 h-5 mr-2" />
                            Informasi Internship
                        </h4>
                        <div class="space-y-2">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Judul</label>
                                <p class="mt-1 text-gray-900 font-medium">{{ submissionDetail.internship.title || 'Tidak tersedia' }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Tipe</label>
                                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {{ submissionDetail.internship.type || 'Tidak tersedia' }}
                                </span>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Deadline</label>
                                <p class="mt-1 text-gray-900">{{ formatDate(submissionDetail.internship.deadline) }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- CV Section -->
                    <div class="bg-green-50 rounded-lg p-4">
                        <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
                            <Icon name="heroicons:document-text-20-solid" class="w-5 h-5 mr-2" />
                            Curriculum Vitae (CV)
                        </h4>
                        <div v-if="submissionDetail.cv_file" class="flex items-center space-x-3">
                            <div class="flex-shrink-0">
                                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Icon name="heroicons:document-arrow-down-20-solid" class="w-5 h-5 text-green-600" />
                                </div>
                            </div>
                            <div class="flex-1">
                                <p class="text-sm font-medium text-gray-900">CV tersedia</p>
                                <p class="text-xs text-gray-500">Klik untuk melihat atau mengunduh CV</p>
                            </div>
                            <a 
                                :href="submissionDetail.cv_file" 
                                target="_blank"
                                rel="noopener noreferrer"
                                class="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 active:bg-green-800 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:ring-offset-2"
                            >
                                Lihat CV
                            </a>
                        </div>
                        <div v-else class="flex items-center space-x-3">
                            <div class="flex-shrink-0">
                                <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <Icon name="heroicons:document-minus-20-solid" class="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                            <div class="flex-1">
                                <p class="text-sm font-medium text-gray-500">CV belum diunggah</p>
                                <p class="text-xs text-gray-400">Siswa belum mengunggah CV</p>
                            </div>
                        </div>
                    </div>

                    <!-- Submission Status -->
                    <div class="bg-yellow-50 rounded-lg p-4">
                        <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
                            <Icon name="heroicons:clipboard-document-check-20-solid" class="w-5 h-5 mr-2" />
                            Status Submission
                        </h4>
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-700">Status saat ini:</p>
                                <span 
                                    class="inline-flex px-3 py-1 text-sm font-semibold rounded-full mt-1"
                                    :class="getStatusClass(submissionDetail.status)"
                                >
                                    {{ getStatusText(submissionDetail.status) }}
                                </span>
                            </div>
                            <div class="text-sm text-gray-500">
                                <p>Tanggal apply: {{ formatDate(submissionDetail.applied_at) }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Footer Actions -->
            <div v-if="submissionDetail" class="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
                <button 
                    @click="closeModal"
                    class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:ring-offset-2"
                >
                    Tutup
                </button>
                
                <div v-if="submissionDetail.status === 'pending'" class="flex space-x-3">
                    <button
                        @click="updateSubmissionStatus('rejected')"
                        :disabled="isUpdating"
                        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:ring-offset-2"
                    >
                        <Icon v-if="isUpdating && pendingAction === 'rejected'" name="heroicons:arrow-path-20-solid" class="w-4 h-4 animate-spin" />
                        <Icon v-else name="heroicons:x-mark-20-solid" class="w-4 h-4" />
                        {{ isUpdating && pendingAction === 'rejected' ? 'Menolak...' : 'Tolak' }}
                    </button>
                    <button
                        @click="updateSubmissionStatus('approved')"
                        :disabled="isUpdating"
                        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:ring-offset-2"
                    >
                        <Icon v-if="isUpdating && pendingAction === 'approved'" name="heroicons:arrow-path-20-solid" class="w-4 h-4 animate-spin" />
                        <Icon v-else name="heroicons:check-20-solid" class="w-4 h-4" />
                        {{ isUpdating && pendingAction === 'approved' ? 'Menyetujui...' : 'Setujui' }}
                    </button>
                </div>

                <div v-else class="text-sm text-gray-500">
                    Status sudah diperbarui: 
                    <span 
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-1"
                        :class="getStatusClass(submissionDetail.status)"
                    >
                        {{ getStatusText(submissionDetail.status) }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Student {
    id: string
    fullname: string
    email: string
    nis: string
    class: string
    headline?: string
}

interface Internship {
    id: string
    title: string
    type: string
    deadline: string
}

interface SubmissionDetail {
    id: string
    student_id: string
    internship_id: string
    status: 'pending' | 'approved' | 'rejected'
    applied_at: string
    cv_file?: string | null
    student: Student
    internship: Internship
}

interface Props {
    isOpen: boolean
    submissionId: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'update:isOpen': [value: boolean]
    'show-success-modal': [message: string]
    'show-error-modal': [message: string]
    'submission-updated': []
}>()

const config = useRuntimeConfig()
const headers = useRequestHeaders(['cookie'])

const submissionDetail = ref<SubmissionDetail | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const isUpdating = ref(false)
const pendingAction = ref<'approved' | 'rejected' | null>(null)

// Watch for modal open and submissionId changes
watch([() => props.isOpen, () => props.submissionId], async ([isOpen, submissionId]) => {
    if (isOpen && submissionId) {
        await fetchSubmissionDetail()
    } else {
        // Reset state when modal closes
        submissionDetail.value = null
        error.value = null
        loading.value = false
        isUpdating.value = false
        pendingAction.value = null
    }
})

const fetchSubmissionDetail = async () => {
    if (!props.submissionId) {
        error.value = 'Submission ID tidak tersedia'
        return
    }
    
    try {
        loading.value = true
        error.value = null
        
        const response = await $fetch(`/admin/submission/${props.submissionId}`, {
            baseURL: config.public.apiBase,
            credentials: 'include',
            headers
        })
        
        if (response && response.success && response.data) {
            submissionDetail.value = response.data
        } else {
            throw new Error(response?.message || 'Data submission tidak ditemukan')
        }
    } catch (err: any) {
        console.error('Error fetching submission detail:', err)
        error.value = err.message || 'Gagal memuat detail submission'
        submissionDetail.value = null
    } finally {
        loading.value = false
    }
}

const updateSubmissionStatus = async (status: 'approved' | 'rejected') => {
    if (!props.submissionId || isUpdating.value) return

    try {
        isUpdating.value = true
        pendingAction.value = status
        
        const response = await $fetch(`/admin/submission/${props.submissionId}/status`, {
            method: 'POST', // or 'PATCH' based on your API
            body: { status },
            baseURL: config.public.apiBase,
            credentials: 'include',
            headers
        })

        if (response && response.success) {
            // Update local data
            if (submissionDetail.value) {
                submissionDetail.value.status = status
            }
            
            const message = status === 'approved' 
                ? 'Submission berhasil disetujui' 
                : 'Submission berhasil ditolak'
            
            emit('show-success-modal', message)
            emit('submission-updated')
        } else {
            throw new Error(response?.message || 'Gagal memperbarui status submission')
        }
    } catch (err: any) {
        console.error('Error updating submission status:', err)
        const errorMessage = err?.data?.message || err?.message || 'Gagal memperbarui status submission'
        emit('show-error-modal', errorMessage)
    } finally {
        isUpdating.value = false
        pendingAction.value = null
    }
}

const closeModal = () => {
    if (!isUpdating.value) {
        emit('update:isOpen', false)
    }
}

const formatDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch {
        return dateString
    }
}

const getStatusClass = (status: string) => {
    switch (status) {
        case 'approved':
            return 'bg-green-100 text-green-800'
        case 'rejected':
            return 'bg-red-100 text-red-800'
        case 'pending':
        default:
            return 'bg-yellow-100 text-yellow-800'
    }
}

const getStatusText = (status: string) => {
    switch (status) {
        case 'approved':
            return 'Disetujui'
        case 'rejected':
            return 'Ditolak'
        case 'pending':
        default:
            return 'Menunggu'
    }
}
</script>