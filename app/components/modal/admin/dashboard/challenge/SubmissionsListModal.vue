<template>
    <div v-if="isOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
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
                        <Icon name="heroicons:document-text-20-solid" class="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h2 class="text-xl font-semibold text-gray-900">Submissions Challenge</h2>
                        <p class="text-sm text-gray-500">{{ challenge?.title || 'Loading...' }}</p>
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
                <!-- Search & Filter -->
                <div class="bg-gray-50 rounded-xl p-4">
                    <div class="flex gap-4 items-center">
                        <div class="flex-1 relative">
                            <Icon name="heroicons:magnifying-glass-20-solid" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                v-model="searchQuery"
                                type="text"
                                placeholder="Cari berdasarkan nama tim..."
                                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                @input="debouncedSearch"
                            />
                        </div>
                        <select
                            v-model="sortBy"
                            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            @change="fetchSubmissions"
                        >
                            <option value="newest">Terbaru</option>
                            <option value="oldest">Terlama</option>
                            <option value="highest_score">Skor Tertinggi</option>
                            <option value="lowest_score">Skor Terendah</option>
                        </select>
                    </div>
                    <div class="mt-2 text-sm text-gray-600">
                        Total {{ totalSubmissions }} submissions
                    </div>
                </div>

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
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">
                        {{ searchQuery ? 'Tidak ada hasil pencarian' : 'Belum ada submission' }}
                    </h3>
                    <p class="text-gray-600">
                        {{ searchQuery ? 'Coba ubah kata kunci pencarian' : 'Belum ada tim yang submit untuk challenge ini' }}
                    </p>
                </div>

                <!-- Submissions List -->
                <div v-else class="bg-white border rounded-xl">
                    <div class="divide-y divide-gray-200">
                        <div 
                            v-for="submission in submissions" 
                            :key="submission.id"
                            class="p-6 hover:bg-gray-50 transition-colors"
                        >
                            <div class="flex items-start justify-between gap-6">
                                <!-- Submission Info -->
                                <div class="flex-1">
                                    <div class="flex items-center gap-3 mb-3">
                                        <div class="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-semibold">
                                            {{ getTeamInitials(submission.team_name) }}
                                        </div>
                                        <div>
                                            <h4 class="font-semibold text-gray-900 text-lg">{{ submission.team_name }}</h4>
                                            <p class="text-sm text-gray-500">{{ formatDate(submission.submitted_at) }}</p>
                                        </div>
                                        <span class="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full font-medium">
                                            {{ submission.points }} pts
                                        </span>
                                    </div>
                                    
                                    <p class="text-gray-700 mb-4 leading-relaxed line-clamp-2">{{ submission.description }}</p>
                                    
                                    <!-- Links -->
                                    <div class="flex items-center gap-4 text-sm text-gray-500">
                                        <!-- GitHub Link -->
                                        <DocumentLink
                                            v-if="submission.github_url"
                                            :file-url="submission.github_url"
                                            :title="`GitHub - ${submission.team_name}`"
                                            :subtitle="submission.challenge_name"
                                            type="github"
                                            link-text="GitHub"
                                            :show-preview="false"
                                            :show-download="false"
                                            @view="handleGithubView"
                                        />
                                        
                                        <!-- Document Link -->
                                        <DocumentLink
                                            v-if="submission.live_url"
                                            :file-url="submission.live_url"
                                            :title="`Dokumen - ${submission.team_name}`"
                                            :subtitle="submission.challenge_name"
                                            :file-name="`${submission.team_name}_Document.pdf`"
                                            type="document"
                                            link-text="Dokumen"
                                            preview-text="Preview"
                                            @view="handleDocumentView"
                                            @download="handleDocumentDownload"
                                        />
                                    </div>
                                </div>

                                <!-- Score Input -->
                                <div class="text-right space-y-3 flex-shrink-0">
                                    <div class="space-y-2">
                                        <label class="text-sm text-gray-600">Update Skor</label>
                                        <input
                                            v-model.number="scoreInputs[submission.id]"
                                            type="number"
                                            min="0"
                                            max="100"
                                            placeholder="0-100"
                                            class="w-20 px-2 py-1 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                                        />
                                        <button
                                            @click="updateScore(submission)"
                                            :disabled="scoringSubmissions.includes(submission.id) || scoreInputs[submission.id] === undefined || scoreInputs[submission.id] === submission.points"
                                            class="w-full px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Icon 
                                                v-if="scoringSubmissions.includes(submission.id)"
                                                name="heroicons:arrow-path-20-solid" 
                                                class="w-4 h-4 animate-spin mx-auto" 
                                            />
                                            <span v-else>Update</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Pagination -->
                    <div v-if="totalPages > 1" class="p-4 border-t border-gray-200 bg-gray-50">
                        <div class="flex items-center justify-between">
                            <div class="text-sm text-gray-600">
                                Halaman {{ currentPage }} dari {{ totalPages }}
                            </div>
                            <div class="flex gap-2">
                                <button
                                    @click="changePage(currentPage - 1)"
                                    :disabled="currentPage <= 1"
                                    class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Icon name="heroicons:chevron-left-20-solid" class="w-4 h-4" />
                                </button>
                                <button
                                    @click="changePage(currentPage + 1)"
                                    :disabled="currentPage >= totalPages"
                                    class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Icon name="heroicons:chevron-right-20-solid" class="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Add PDF Viewer -->
    <PDFViewer
        v-model:is-open="pdfViewerOpen"
        :file-url="pdfViewerUrl"
        :title="pdfViewerTitle"
        :subtitle="pdfViewerSubtitle"
        :file-name="pdfViewerFileName"
        @download="handlePDFDownload"
        @view="handlePDFView"
    />
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import PDFViewer from '~/components/shared/PDFViewer.vue'
import DocumentLink from '~/components/shared/DocumentLink.vue'

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

interface Challenge {
    id: string
    title: string
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
const route = useRoute()

// Determine if this is admin or teacher based on route
const isAdmin = computed(() => route.path.includes('/admin/'))
const apiPrefix = computed(() => isAdmin.value ? '/admin' : '/teacher')

// Data
const submissions = ref<Submission[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const sortBy = ref('newest')
const currentPage = ref(1)
const totalPages = ref(1)
const totalSubmissions = ref(0)
const scoreInputs = ref<Record<string, number>>({})
const scoringSubmissions = ref<string[]>([])

// Add PDF viewer state
const pdfViewerOpen = ref(false)
const pdfViewerUrl = ref<string | null>(null)
const pdfViewerTitle = ref('')
const pdfViewerSubtitle = ref('')
const pdfViewerFileName = ref('')

// Watch for modal open and challenge changes
watch([() => props.isOpen, () => props.challenge], ([isOpen, challenge]) => {
    if (isOpen && challenge?.id) {
        resetPagination()
        fetchSubmissions()
    } else {
        resetData()
    }
})

// Debounced search
const debouncedSearch = useDebounceFn(() => {
    currentPage.value = 1
    fetchSubmissions()
}, 300)

const fetchSubmissions = async () => {
    if (!props.challenge?.id) return
    
    try {
        loading.value = true
        error.value = null
        
        const params = new URLSearchParams({
            page: currentPage.value.toString(),
            limit: '10'
        })
        
        if (searchQuery.value.trim()) {
            params.append('search', searchQuery.value.trim())
        }
        
        if (sortBy.value) {
            params.append('sort', sortBy.value)
        }
        
        const response = await $fetch(`${apiPrefix.value}/challenges/${props.challenge.id}/submissions?${params}`, {
            baseURL: config.public.apiBase,
            credentials: 'include'
        }) as {
            success: boolean
            message: string
            data: {
                data: Submission[]
                total: number
                page: number
                limit: number
                total_pages: number
            }
        }
        
        if (response.success && response.data) {
            submissions.value = response.data.data || []
            totalSubmissions.value = response.data.total || 0
            currentPage.value = response.data.page || 1
            totalPages.value = response.data.total_pages || 1
            
            // Initialize score inputs with current scores
            submissions.value.forEach(submission => {
                if (scoreInputs.value[submission.id] === undefined) {
                    scoreInputs.value[submission.id] = submission.points
                }
            })
        } else {
            throw new Error(response.message || 'Failed to fetch submissions')
        }
    } catch (err: any) {
        console.error('Error fetching submissions:', err)
        error.value = err.message || 'Gagal memuat data submissions'
        submissions.value = []
    } finally {
        loading.value = false
    }
}

const updateScore = async (submission: Submission) => {
    const newScore = scoreInputs.value[submission.id]
    
    if (newScore === undefined || newScore < 0 || newScore > 100) {
        emit('show-error-modal', 'Skor harus antara 0-100')
        return
    }
    
    if (newScore === submission.points) {
        emit('show-error-modal', 'Skor tidak berubah')
        return
    }
    
    try {
        scoringSubmissions.value.push(submission.id)
        
        const response = await $fetch(`${apiPrefix.value}/challenges/submissions/${submission.id}/score`, {
            method: 'PUT',
            baseURL: config.public.apiBase,
            credentials: 'include',
            body: {
                points: newScore
            }
        }) as { success: boolean; message: string }
        
        if (response.success) {
            // Update local data
            const submissionIndex = submissions.value.findIndex(s => s.id === submission.id)
            if (submissionIndex !== -1) {
                submissions.value[submissionIndex].points = newScore
            }
            
            emit('show-success-modal', `Skor untuk tim "${submission.team_name}" berhasil diupdate menjadi ${newScore} poin`)
            emit('submission-updated')
        } else {
            throw new Error(response.message || 'Failed to update score')
        }
    } catch (err: any) {
        console.error('Error updating score:', err)
        emit('show-error-modal', err.message || 'Gagal mengupdate skor')
        
        // Reset input to original value
        scoreInputs.value[submission.id] = submission.points
    } finally {
        scoringSubmissions.value = scoringSubmissions.value.filter(id => id !== submission.id)
    }
}

const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        fetchSubmissions()
    }
}

const resetPagination = () => {
    currentPage.value = 1
    searchQuery.value = ''
    sortBy.value = 'newest'
}

const resetData = () => {
    submissions.value = []
    totalSubmissions.value = 0
    totalPages.value = 1
    scoreInputs.value = {}
    scoringSubmissions.value = []
    error.value = null
    loading.value = false
}

const closeModal = () => {
    emit('update:isOpen', false)
}

const getTeamInitials = (teamName: string) => {
    return teamName
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
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
        return 'Invalid Date'
    }
}

// Event handlers
const handleGithubView = (url: string) => {
    // GitHub links should always open in new tab
    window.open(url, '_blank', 'noopener,noreferrer')
}

const handleDocumentView = (url: string) => {
    console.log('Document viewed:', url)
}

const handleDocumentDownload = (url: string) => {
    console.log('Document downloaded:', url)
}

const handlePDFView = (url: string) => {
    console.log('PDF viewed in viewer:', url)
}

const handlePDFDownload = (url: string) => {
    console.log('PDF downloaded:', url)
}
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>