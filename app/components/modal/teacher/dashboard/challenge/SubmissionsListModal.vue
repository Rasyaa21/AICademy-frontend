<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div 
            class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            @click="closeModal"
        />
        
        <!-- Modal -->
        <div class="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                    <h2 class="text-xl font-semibold text-gray-900">Submissions</h2>
                    <p class="text-sm text-gray-500">{{ challenge?.title }}</p>
                </div>
                <button 
                    class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    @click="closeModal"
                >
                    <Icon name="heroicons:x-mark-20-solid" class="w-6 h-6 text-gray-500" />
                </button>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-6">
                <!-- Loading State -->
                <div v-if="loading" class="flex items-center justify-center py-12">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    <span class="ml-3 text-gray-600">Memuat submissions...</span>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="text-center py-12">
                    <div class="text-red-500 mb-4">
                        <Icon name="heroicons:exclamation-triangle-20-solid" class="mx-auto w-12 h-12" />
                    </div>
                    <p class="text-gray-600 mb-4">{{ error }}</p>
                    <button 
                        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                        @click="fetchSubmissions"
                    >
                        Coba Lagi
                    </button>
                </div>

                <!-- No Submissions -->
                <div v-else-if="submissions.length === 0" class="text-center py-12">
                    <Icon name="heroicons:document-text-20-solid" class="mx-auto w-16 h-16 text-gray-400 mb-4" />
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Belum ada submission</h3>
                    <p class="text-gray-600">Challenge ini belum memiliki submission dari tim manapun</p>
                </div>

                <!-- Submissions List -->
                <div v-else class="space-y-4">
                    <div 
                        v-for="submission in submissions" 
                        :key="submission.id"
                        class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                        <div class="flex items-start justify-between mb-4">
                            <div class="flex-1">
                                <div class="flex items-center gap-3 mb-2">
                                    <h4 class="text-lg font-semibold text-gray-900">{{ submission.team_name }}</h4>
                                    <div class="flex items-center gap-2">
                                        <span class="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full font-medium">
                                            {{ submission.points }} pts
                                        </span>
                                    </div>
                                </div>
                                <p class="text-gray-600 mb-3">{{ submission.description }}</p>
                                
                                <div class="flex items-center gap-4 text-sm">
                                    <span class="text-gray-500">
                                        <Icon name="heroicons:clock-20-solid" class="w-4 h-4 inline mr-1" />
                                        {{ formatDate(submission.submitted_at) }}
                                    </span>
                                    
                                    <a 
                                        v-if="submission.github_url"
                                        :href="submission.github_url"
                                        target="_blank"
                                        class="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        <Icon name="heroicons:code-bracket-20-solid" class="w-4 h-4" />
                                        GitHub Repository
                                    </a>
                                    
                                    <a 
                                        v-if="submission.live_url"
                                        :href="submission.live_url"
                                        target="_blank"
                                        class="flex items-center gap-1 text-green-600 hover:text-green-800 transition-colors"
                                    >
                                        <Icon name="heroicons:link-20-solid" class="w-4 h-4" />
                                        Live Demo
                                    </a>
                                </div>
                            </div>
                            
                            <div class="flex items-center gap-2 ml-4">
                                <button
                                    class="px-3 py-1 text-sm border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
                                    @click="openScoreModal(submission)"
                                >
                                    <Icon name="heroicons:star-20-solid" class="w-4 h-4 inline mr-1" />
                                    Beri Nilai
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Score Modal -->
    <div v-if="showScoreModal" class="fixed inset-0 z-60 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeScoreModal" />
        <div class="relative bg-white rounded-xl shadow-xl w-full max-w-md">
            <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Beri Nilai Submission</h3>
                <div class="mb-4">
                    <p class="text-sm text-gray-600 mb-2">Tim: <span class="font-medium">{{ selectedSubmission?.team_name }}</span></p>
                    <p class="text-sm text-gray-600">Nilai saat ini: <span class="font-medium">{{ selectedSubmission?.points }} pts</span></p>
                </div>
                
                <form @submit.prevent="submitScore">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Nilai Baru (0-100)</label>
                        <input
                            v-model.number="scoreForm.points"
                            type="number"
                            min="0"
                            max="100"
                            required
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="0-100"
                        >
                    </div>
                    
                    <div class="flex gap-3">
                        <button
                            type="button"
                            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            @click="closeScoreModal"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                            :disabled="scoring"
                        >
                            {{ scoring ? 'Menyimpan...' : 'Simpan Nilai' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Challenge {
    id: string
    title: string
}

interface Submission {
    id: string
    challenge_id: string
    team_name: string
    github_url: string
    live_url: string
    description: string
    points: number
    submitted_at: string
}

interface Props {
    isOpen: boolean
    challenge: Challenge | null
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

const submissions = ref<Submission[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Score modal states
const showScoreModal = ref(false)
const selectedSubmission = ref<Submission | null>(null)
const scoring = ref(false)
const scoreForm = ref({
    points: 0
})

// Watch for modal open and challenge changes
watch([() => props.isOpen, () => props.challenge], async ([isOpen, challenge]) => {
    if (isOpen && challenge) {
        await fetchSubmissions()
    } else {
        // Reset state when modal closes
        submissions.value = []
        error.value = null
        loading.value = false
    }
})

const fetchSubmissions = async () => {
    if (!props.challenge?.id) {
        error.value = 'Challenge ID tidak tersedia'
        return
    }
    
    try {
        loading.value = true
        error.value = null
        
        const response = await $fetch(`/teacher/challenges/${props.challenge.id}/submissions`, {
            baseURL: config.public.apiBase,
            credentials: 'include',
            headers
        }) as { success: boolean; data?: { data?: Submission[] } }
        
        if (response && response.success) {
            submissions.value = response.data?.data || []
        } else {
            error.value = 'Gagal memuat data submissions'
        }
    } catch (err: unknown) {
        console.error('Error fetching submissions:', err)
        const errorMsg = err instanceof Error ? err.message : 'Gagal memuat data submissions'
        error.value = errorMsg
        submissions.value = []
    } finally {
        loading.value = false
    }
}

const openScoreModal = (submission: Submission) => {
    selectedSubmission.value = submission
    scoreForm.value.points = submission.points
    showScoreModal.value = true
}

const closeScoreModal = () => {
    showScoreModal.value = false
    selectedSubmission.value = null
    scoreForm.value.points = 0
}

const submitScore = async () => {
    if (!selectedSubmission.value) return
    
    try {
        scoring.value = true
        
        const response = await $fetch('/teacher/challenges/submissions/score', {
            method: 'POST',
            body: {
                submission_id: selectedSubmission.value.id,
                points: scoreForm.value.points
            },
            baseURL: config.public.apiBase,
            credentials: 'include',
            headers
        }) as { success: boolean; message?: string }
        
        if (response && response.success) {
            emit('show-success-modal', 'Nilai berhasil disimpan')
            closeScoreModal()
            await fetchSubmissions()
            emit('submission-updated')
        }
    } catch (err: unknown) {
        console.error('Error submitting score:', err)
        const errorMsg = err instanceof Error ? err.message : 'Gagal menyimpan nilai'
        emit('show-error-modal', errorMsg)
    } finally {
        scoring.value = false
    }
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
</script>