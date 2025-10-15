<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 max-h-[95vh] overflow-hidden">
            <div class="p-6 border-b border-gray-200">
                <div class="flex items-center justify-between">
                    <h2 class="text-xl font-semibold text-gray-900">Review Submission</h2>
                    <button 
                        class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        @click="closeModal"
                    >
                        <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5 text-gray-500" />
                    </button>
                </div>
            </div>

            <div class="p-6 space-y-6 overflow-y-auto max-h-[calc(95vh-200px)]">
                <!-- Submission Details -->
                <div class="bg-gray-50 rounded-xl p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Detail Submission</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-3">
                            <div>
                                <p class="text-sm text-gray-500">Siswa</p>
                                <p class="font-medium text-gray-900">{{ submission?.student_name }}</p>
                                <p class="text-sm text-gray-600">{{ submission?.student_email }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Roadmap</p>
                                <p class="font-medium text-gray-900">{{ submission?.roadmap_name }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Langkah</p>
                                <p class="font-medium text-gray-900">Langkah {{ submission?.step_order }}: {{ submission?.step_title }}</p>
                            </div>
                        </div>
                        <div class="space-y-3">
                            <div>
                                <p class="text-sm text-gray-500">Tanggal Submit</p>
                                <p class="font-medium text-gray-900">{{ formatDate(submission?.submitted_at) }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Tipe Evidence</p>
                                <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                    {{ submission?.evidence_type }}
                                </span>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Link Evidence</p>
                                <a 
                                    :href="submission?.evidence_link" 
                                    target="_blank"
                                    class="text-blue-600 hover:text-blue-800 text-sm break-all"
                                >
                                    {{ submission?.evidence_link }}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Learning Objectives -->
                <div class="bg-blue-50 rounded-xl p-6">
                    <h4 class="text-md font-semibold text-gray-900 mb-2">Tujuan Pembelajaran</h4>
                    <p class="text-gray-700">{{ submission?.learning_objectives }}</p>
                </div>

                <!-- Submission Guidelines -->
                <div class="bg-yellow-50 rounded-xl p-6">
                    <h4 class="text-md font-semibold text-gray-900 mb-2">Panduan Submission</h4>
                    <p class="text-gray-700">{{ submission?.submission_guidelines }}</p>
                </div>

                <!-- Submission Notes -->
                <div class="bg-green-50 rounded-xl p-6">
                    <h4 class="text-md font-semibold text-gray-900 mb-2">Catatan Siswa</h4>
                    <p class="text-gray-700">{{ submission?.submission_notes || 'Tidak ada catatan' }}</p>
                </div>

                <!-- Review Form -->
                <div class="border-t border-gray-200 pt-6">
                    <h4 class="text-lg font-semibold text-gray-900 mb-4">Review Submission</h4>
                    
                    <div class="space-y-4">
                        <!-- Action Selection -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Aksi</label>
                            <div class="flex gap-4">
                                <label class="flex items-center">
                                    <input 
                                        v-model="reviewData.action"
                                        type="radio"
                                        value="approve"
                                        class="mr-2 text-green-600 focus:ring-green-500"
                                    >
                                    <span class="text-green-700 font-medium">Setujui</span>
                                </label>
                                <label class="flex items-center">
                                    <input 
                                        v-model="reviewData.action"
                                        type="radio"
                                        value="reject"
                                        class="mr-2 text-red-600 focus:ring-red-500"
                                    >
                                    <span class="text-red-700 font-medium">Tolak</span>
                                </label>
                            </div>
                        </div>

                        <!-- Validation Score (only for approve) -->
                        <div v-if="reviewData.action === 'approve'">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Skor Validasi (0-100)
                            </label>
                            <input
                                v-model.number="reviewData.validation_score"
                                type="number"
                                min="0"
                                max="100"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="contoh: 90"
                            >
                        </div>

                        <!-- Validation Notes -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Catatan Validasi
                            </label>
                            <textarea
                                v-model="reviewData.validation_notes"
                                rows="4"
                                required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                                :placeholder="reviewData.action === 'approve' ? 'Berikan feedback positif...' : 'Jelaskan apa yang perlu diperbaiki...'"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="p-6 border-t border-gray-200">
                <div class="flex gap-3">
                    <button
                        type="button"
                        class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        @click="closeModal"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        class="flex-1 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                        :class="reviewData.action === 'approve' 
                            ? 'bg-green-600 text-white hover:bg-green-700' 
                            : 'bg-red-600 text-white hover:bg-red-700'"
                        :disabled="!canSubmit || isSubmitting"
                        @click="handleSubmitReview"
                    >
                        {{ isSubmitting ? 'Memproses...' : (reviewData.action === 'approve' ? 'Setujui Submission' : 'Tolak Submission') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { RoadmapSubmission } from '~/types/RoadmapSubmission'

interface Props {
    isOpen: boolean
    submission: RoadmapSubmission | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'update:isOpen': [value: boolean]
    'show-success-modal': [message: string]
    'show-error-modal': [message: string]
    'submission-reviewed': []
}>()

const config = useRuntimeConfig()
const isSubmitting = ref(false)

const reviewData = ref({
    action: 'approve' as 'approve' | 'reject',
    validation_score: 85,
    validation_notes: ''
})

const canSubmit = computed(() => {
    if (!reviewData.value.action || !reviewData.value.validation_notes.trim()) {
        return false
    }
    
    if (reviewData.value.action === 'approve' && !reviewData.value.validation_score) {
        return false
    }
    
    return true
})

const resetForm = () => {
    reviewData.value = {
        action: 'approve',
        validation_score: 85,
        validation_notes: ''
    }
}

const closeModal = () => {
    emit('update:isOpen', false)
    resetForm()
}

const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    try {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch {
        return 'Tanggal Tidak Valid'
    }
}

const handleSubmitReview = async () => {
    if (!props.submission?.id || !canSubmit.value) {
        return
    }
    
    isSubmitting.value = true
    
    try {
        const submitData: any = {
            action: reviewData.value.action,
            validation_notes: reviewData.value.validation_notes
        }
        
        if (reviewData.value.action === 'approve') {
            submitData.validation_score = reviewData.value.validation_score
        }
        
        const response = await $fetch(`/teacher/roadmaps/submissions/${props.submission.id}/review`, {
            method: 'POST',
            body: submitData,
            credentials: 'include',
            baseURL: config.public.apiBase
        })
        
        if (response) {
            const message = reviewData.value.action === 'approve' 
                ? 'Submission berhasil disetujui'
                : 'Submission berhasil ditolak'
            emit('show-success-modal', message)
            emit('submission-reviewed')
            closeModal()
        }
    } catch (error: unknown) {
        console.error('Error submitting review:', error)
        
        const err = error as { status?: number; statusCode?: number; data?: { message?: string; error?: string }; message?: string }
        
        let errorMessage = 'Terjadi kesalahan saat submit review'
        
        if (err.status === 400 || err.statusCode === 400) {
            errorMessage = err.data?.message || 'Data review tidak valid'
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

watch(() => props.isOpen, (isOpen) => {
    if (!isOpen) {
        resetForm()
    }
})
</script>