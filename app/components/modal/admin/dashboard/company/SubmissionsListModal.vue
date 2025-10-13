<template>
    <!-- Submission Detail Modal -->
    <SubmissionDetailModal
        v-model:isOpen="submissionDetailModal.isOpen"
        :submission-id="selectedSubmissionId"
        @show-success-modal="(msg) => emit('show-success-modal', msg)"
        @show-error-modal="(msg) => emit('show-error-modal', msg)"
        @submission-updated="handleSubmissionUpdate"
    />

    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div 
            class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            @click="closeModal"
        ></div>
        
        <!-- Modal -->
        <div class="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                    <h3 class="text-xl font-semibold text-gray-900">Submissions - {{ internship?.title }}</h3>
                    <p class="text-sm text-gray-500 mt-1">Total: {{ internship?.submissions?.length || 0 }} submissions</p>
                </div>
                <button 
                    @click="closeModal"
                    class="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
                </button>
            </div>
            
            <!-- Content -->
            <div class="max-h-[calc(90vh-180px)] overflow-y-auto">
                <!-- Internship Info -->
                <div v-if="internship" class="p-6 bg-blue-50 border-b border-gray-200">
                    <div class="flex items-start space-x-4">
                        <div class="flex-shrink-0">
                            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Icon name="heroicons:briefcase-20-solid" class="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <div class="flex-1 min-w-0">
                            <h4 class="text-lg font-semibold text-gray-900">{{ internship.title }}</h4>
                            <p class="text-sm text-gray-600 mt-1">{{ internship.description }}</p>
                            <div class="flex items-center space-x-4 mt-2">
                                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {{ internship.type }}
                                </span>
                                <span class="text-sm text-gray-500">
                                    Deadline: {{ formatDate(internship.deadline) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Submissions Table -->
                <div class="p-6">
                    <div v-if="!internship?.submissions || internship.submissions.length === 0" class="text-center py-12">
                        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon name="heroicons:document-text-20-solid" class="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">Belum Ada Submission</h3>
                        <p class="text-gray-500">Belum ada siswa yang mengajukan aplikasi untuk internship ini.</p>
                    </div>

                    <div v-else class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Siswa
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kelas
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tanggal Apply
                                    </th>
                                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="submission in internship.submissions" :key="submission.id" class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="flex-shrink-0 h-10 w-10">
                                                <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <span class="text-sm font-medium text-gray-700">
                                                        {{ getInitials(submission.student.fullname) }}
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="ml-4">
                                                <div class="text-sm font-medium text-gray-900">
                                                    {{ submission.student.fullname }}
                                                </div>
                                                <div class="text-sm text-gray-500">
                                                    {{ submission.student.email }}
                                                </div>
                                                <div class="text-xs text-gray-400">
                                                    NIS: {{ submission.student.nis }}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {{ submission.student.class }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span 
                                            class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                                            :class="getStatusClass(submission.status)"
                                        >
                                            {{ getStatusText(submission.status) }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {{ formatDate(submission.applied_at) }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            @click="viewSubmissionDetail(submission.id)"
                                            class="text-primary hover:text-primary/80 transition-colors"
                                        >
                                            Detail
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                <button 
                    @click="closeModal"
                    class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Tutup
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SubmissionDetailModal from './SubmissionDetailModal.vue'

interface Student {
    id: string
    fullname: string
    email: string
    nis: string
    class: string
    headline?: string
}

interface Submission {
    id: string
    student_id: string
    internship_id: string
    status: 'pending' | 'approved' | 'rejected'
    applied_at: string
    student: Student
}

interface Internship {
    id: string
    company_id: string
    title: string
    description: string
    type: string
    deadline: string
    created_at: string
    submissions_count: number
    submissions: Submission[]
}

interface Props {
    isOpen: boolean
    internship: Internship | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'update:isOpen': [value: boolean]
    'show-success-modal': [message: string]
    'show-error-modal': [message: string]
    'submission-updated': []
}>()

// Modal states
const submissionDetailModal = ref({ isOpen: false })
const selectedSubmissionId = ref<string | null>(null)

const viewSubmissionDetail = (submissionId: string) => {
    selectedSubmissionId.value = submissionId
    submissionDetailModal.value.isOpen = true
}

const handleSubmissionUpdate = (message?: string) => {
    if (message) {
        emit('show-success-modal', message)
    }
    emit('submission-updated')
    // Close the detail modal but keep this modal open to see updated data
}

const closeModal = () => {
    emit('update:isOpen', false)
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

const getInitials = (fullname: string) => {
    return fullname
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase()
}
</script>