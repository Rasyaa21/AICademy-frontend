<template>
    <SubmissionsListModal
        v-model:is-open="submissionsModal.isOpen"
        :challenge="selectedChallenge"
        @show-success-modal="showSuccessModal"
        @show-error-modal="showErrorModal"
        @submission-updated="fetchChallengeSubmissions"
    />

    <div v-if="isOpen" class="fixed inset-0 z-[65] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div 
            class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            @click="closeModal"
        />
        
        <!-- Modal -->
        <div class="relative bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <div class="flex items-center gap-4">
                    <div class="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl">
                        <Icon name="heroicons:trophy-20-solid" class="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h2 class="text-xl font-semibold text-gray-900">Detail Challenge</h2>
                        <p class="text-sm text-gray-500">Informasi lengkap dan submission</p>
                    </div>
                </div>
                <button 
                    class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    @click="closeModal"
                >
                    <Icon name="heroicons:x-mark-20-solid" class="w-6 h-6 text-gray-500" />
                </button>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-6 space-y-6">
                <!-- Loading State -->
                <div v-if="loading" class="flex items-center justify-center py-12">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    <span class="ml-3 text-gray-600">Memuat detail challenge...</span>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="text-center py-12">
                    <div class="text-red-500 mb-4">
                        <Icon name="heroicons:exclamation-triangle-20-solid" class="mx-auto w-12 h-12" />
                    </div>
                    <p class="text-gray-600 mb-4">{{ error }}</p>
                    <button 
                        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                        @click="fetchChallengeDetail"
                    >
                        Coba Lagi
                    </button>
                </div>

                <!-- Challenge Detail -->
                <template v-else-if="challengeDetail">
                    <!-- Basic Info -->
                    <div class="bg-gray-50 rounded-xl p-6">
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div class="space-y-4">
                                <div>
                                    <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ challengeDetail.title }}</h3>
                                    <p class="text-gray-600">{{ challengeDetail.description }}</p>
                                </div>
                                
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <p class="text-sm text-gray-500">Prize</p>
                                        <p class="text-lg font-semibold text-green-600">{{ challengeDetail.prize }}</p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-500">Max Peserta</p>
                                        <p class="text-lg font-semibold text-gray-900">{{ challengeDetail.max_participants }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <p class="text-sm text-gray-500">Deadline</p>
                                        <p class="text-sm font-medium text-gray-900">{{ formatDate(challengeDetail.deadline) }}</p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-500">Status</p>
                                        <span 
                                            :class="getStatusClass(challengeDetail.deadline)"
                                            class="inline-block px-2 py-1 text-xs font-medium rounded-full"
                                        >
                                            {{ getStatusText(challengeDetail.deadline) }}
                                        </span>
                                    </div>
                                </div>

                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <p class="text-sm text-gray-500">Peserta Saat Ini</p>
                                        <p class="text-lg font-semibold text-blue-600">{{ challengeDetail.current_participants || 0 }}</p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-500">Total Submission</p>
                                        <p class="text-lg font-semibold text-purple-600">{{ submissions.length }}</p>
                                    </div>
                                </div>

                                <div>
                                    <p class="text-sm text-gray-500">Dibuat</p>
                                    <p class="text-sm text-gray-900">{{ formatDate(challengeDetail.created_at) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Submissions Section -->
                    <div class="bg-white border rounded-xl">
                        <div class="flex items-center justify-between p-4 border-b border-gray-200">
                            <h4 class="text-lg font-semibold text-gray-900">
                                Submissions ({{ submissions.length }})
                            </h4>
                            <button
                                v-if="submissions.length > 0"
                                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                                @click="viewAllSubmissions"
                            >
                                Lihat Semua Submission
                            </button>
                        </div>

                        <!-- Loading Submissions -->
                        <div v-if="submissionsLoading" class="p-6 text-center">
                            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto" />
                            <p class="mt-2 text-sm text-gray-600">Memuat submissions...</p>
                        </div>

                        <!-- Submissions Error -->
                        <div v-else-if="submissionsError" class="p-6 text-center">
                            <p class="text-red-600 text-sm">{{ submissionsError }}</p>
                        </div>

                        <!-- No Submissions -->
                        <div v-else-if="submissions.length === 0" class="p-6 text-center">
                            <Icon name="heroicons:document-text-20-solid" class="mx-auto w-12 h-12 text-gray-400 mb-3" />
                            <p class="text-gray-600">Belum ada submission untuk challenge ini</p>
                        </div>

                        <!-- Submissions List -->
                        <div v-else class="divide-y divide-gray-200">
                            <div 
                                v-for="submission in submissions.slice(0, 5)" 
                                :key="submission.id"
                                class="p-4 hover:bg-gray-50"
                            >
                                <div class="flex items-center justify-between">
                                    <div class="flex-1">
                                        <div class="flex items-center gap-3">
                                            <h5 class="font-medium text-gray-900">{{ submission.team_name }}</h5>
                                            <span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                                {{ submission.points }} pts
                                            </span>
                                        </div>
                                        <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ submission.description }}</p>
                                        <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                            <span>{{ formatDate(submission.submitted_at) }}</span>
                                            <a 
                                                v-if="submission.github_url"
                                                :href="submission.github_url"
                                                target="_blank"
                                                class="text-blue-600 hover:text-blue-800"
                                            >
                                                GitHub
                                            </a>
                                            <a 
                                                v-if="submission.live_url"
                                                :href="submission.live_url"
                                                target="_blank"
                                                class="text-green-600 hover:text-green-800"
                                            >
                                                Live Demo
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import SubmissionsListModal from './SubmissionsListModal.vue'

interface ChallengeDetail {
    id: string
    title: string
    description: string
    deadline: string
    prize: string
    max_participants: number
    current_participants: number
    winner_team_id: string | null
    created_by_admin_id: string
    created_by_teacher_id: string | null
    created_at: string
    updated_at: string
}

interface Submission {
    id: string
    challenge_id: string
    challenge_name: string
    team_name: string
    github_url: string
    live_url: string
    description: string
    points: number
    submitted_at: string
}

interface Props {
    isOpen: boolean
    challengeId: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'update:isOpen': [value: boolean]
    'show-success-modal': [message: string]
    'show-error-modal': [message: string]
}>()

const config = useRuntimeConfig()
const headers = useRequestHeaders(['cookie'])

const challengeDetail = ref<ChallengeDetail | null>(null)
const submissions = ref<Submission[]>([])
const loading = ref(false)
const submissionsLoading = ref(false)
const error = ref<string | null>(null)
const submissionsError = ref<string | null>(null)

// Modal states
const submissionsModal = ref({ isOpen: false })
const selectedChallenge = ref<ChallengeDetail | null>(null)

// Watch for modal open and challengeId changes
watch([() => props.isOpen, () => props.challengeId], async ([isOpen, challengeId]) => {
    if (isOpen && challengeId) {
        await fetchChallengeDetail()
        await fetchChallengeSubmissions()
    } else {
        // Reset state when modal closes
        challengeDetail.value = null
        submissions.value = []
        error.value = null
        submissionsError.value = null
        loading.value = false
        submissionsLoading.value = false
    }
})

const fetchChallengeDetail = async () => {
    if (!props.challengeId) {
        error.value = 'Challenge ID tidak tersedia'
        return
    }
    
    try {
        loading.value = true
        error.value = null
        
        const response = await $fetch(`/admin/challenges/${props.challengeId}`, {
            baseURL: config.public.apiBase,
            credentials: 'include',
            headers
        }) as any
        
        if (response && response.success && response.data) {
            challengeDetail.value = response.data
        } else {
            error.value = 'Gagal memuat detail challenge'
        }
    } catch (err: any) {
        console.error('Error fetching challenge detail:', err)
        error.value = err.message || 'Gagal memuat detail challenge'
        challengeDetail.value = null
    } finally {
        loading.value = false
    }
}

const fetchChallengeSubmissions = async () => {
    if (!props.challengeId) {
        submissionsError.value = 'Challenge ID tidak tersedia'
        return
    }
    
    try {
        submissionsLoading.value = true
        submissionsError.value = null
        
        const response = await $fetch(`/admin/challenges/${props.challengeId}/submissions`, {
            baseURL: config.public.apiBase,
            credentials: 'include',
            headers
        }) as any
        
        if (response && response.success) {
            submissions.value = response.data?.data || []
        } else {
            submissionsError.value = 'Gagal memuat data submissions'
        }
    } catch (err: any) {
        console.error('Error fetching challenge submissions:', err)
        submissionsError.value = err.message || 'Gagal memuat data submissions'
        submissions.value = []
    } finally {
        submissionsLoading.value = false
    }
}

const viewAllSubmissions = () => {
    selectedChallenge.value = challengeDetail.value
    submissionsModal.value.isOpen = true
}

const closeModal = () => {
    emit('update:isOpen', false)
}

const formatDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch {
        return 'Invalid Date'
    }
}

const getStatusText = (deadline: string) => {
    return new Date(deadline) > new Date() ? 'Aktif' : 'Selesai'
}

const getStatusClass = (deadline: string) => {
    return new Date(deadline) > new Date() 
        ? 'bg-green-100 text-green-800' 
        : 'bg-gray-100 text-gray-800'
}

const showSuccessModal = (message: string) => {
    emit('show-success-modal', message)
}

const showErrorModal = (message: string) => {
    emit('show-error-modal', message)
}
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>