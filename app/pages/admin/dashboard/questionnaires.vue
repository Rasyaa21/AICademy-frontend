<template>
    <GenerateInputPopup v-model:is-open="openQuestionnaireInput"/>
    <div class="space-y-6">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">Questionnaires Management</h1>
                <p class="text-gray-600 mt-1">
                    Kelola kuisioner dan analisis respons siswa
                </p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white p-6 rounded-xl shadow-sm border">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm">Total Kuisioner</p>
                        <p class="text-2xl font-bold text-gray-900">{{ questionnaireStats.total }}</p>
                    </div>
                    <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Icon name="heroicons:document-text-20-solid" class="w-6 h-6 text-primary" />
                    </div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-sm border">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm">Kuisioner Aktif</p>
                        <p class="text-2xl font-bold text-green-600">{{ questionnaireStats.active }}</p>
                    </div>
                    <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Icon name="heroicons:check-circle-20-solid" class="w-6 h-6 text-green-600" />
                    </div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-sm border">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm">Total Respons</p>
                        <p class="text-2xl font-bold text-purple-600">{{ questionnaireStats.totalResponses }}</p>
                    </div>
                    <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Icon name="heroicons:chat-bubble-left-right-20-solid" class="w-6 h-6 text-purple-600" />
                    </div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-sm border">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm">Rata-rata Respons</p>
                        <p class="text-2xl font-bold text-blue-600">{{ questionnaireStats.averageResponses }}%</p>
                    </div>
                    <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Icon name="heroicons:chart-bar-20-solid" class="w-6 h-6 text-blue-600" />
                    </div>
                </div>
            </div>
        </div>

        <QuestionnaireFilter
            v-model:searchQuery="searchQuery"
            v-model:selectedStatus="selectedStatus"
            v-model:selectedType="selectedType"
            v-model:sortBy="sortBy"
            :filteredCount="filteredQuestionnaires.length"
            :totalCount="questionnaires.length"
            :activeFiltersCount="activeFiltersCount"
            :hasActiveFilters="hasActiveFilters"
            @clear-filters="clearAllFilters"
            @generate-questionnaire="openQuestionnaireInput = true"
        />

        <!-- Questionnaires Table -->
        <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Kuisioner</th>
                            <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Tipe</th>
                            <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Jumlah Pertanyaan</th>
                            <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Status</th>
                            <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Respons</th>
                            <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Dibuat</th>
                            <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="questionnaire in paginatedQuestionnaires" :key="questionnaire.id" class="border-b border-gray-100 hover:bg-gray-50">
                            <td class="py-4 px-6">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Icon name="heroicons:document-text-20-solid" class="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <div class="font-medium text-gray-900 text-sm">{{ questionnaire.title }}</div>
                                        <div class="text-xs text-gray-500">{{ questionnaire.description }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="py-4 px-6">
                                <span 
                                    :class="[
                                        'px-2 py-1 rounded-full text-xs font-medium',
                                        questionnaire.type === 'ai-generated' 
                                            ? 'bg-purple-100 text-purple-800' 
                                            : 'bg-blue-100 text-blue-800'
                                    ]"
                                >
                                    {{ questionnaire.type === 'ai-generated' ? 'AI Generated' : 'Manual' }}
                                </span>
                            </td>
                            <td class="py-4 px-6 text-sm text-gray-600">{{ questionnaire.questions_count }} pertanyaan</td>
                            <td class="py-4 px-6">
                                <div class="flex items-center gap-2">
                                    <span 
                                        :class="[
                                            'px-2 py-1 rounded-full text-xs font-medium',
                                            questionnaire.status === 'active' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        ]"
                                    >
                                        {{ questionnaire.status === 'active' ? 'Aktif' : 'Draft' }}
                                    </span>
                                    <button 
                                        @click="toggleStatus(questionnaire)"
                                        class="text-xs text-gray-500 hover:text-gray-700"
                                    >
                                        Toggle
                                    </button>
                                </div>
                            </td>
                            <td class="py-4 px-6 text-sm text-gray-600">
                                <div class="flex items-center gap-2">
                                    <span>{{ questionnaire.responses_count }}</span>
                                    <button 
                                        v-if="questionnaire.responses_count > 0"
                                        @click="viewResponses(questionnaire)"
                                        class="text-primary hover:text-primary/80 text-xs"
                                    >
                                        Lihat
                                    </button>
                                </div>
                            </td>
                            <td class="py-4 px-6 text-sm text-gray-600">
                                {{ formatDate(questionnaire.created_at) }}
                            </td>
                            <td class="py-4 px-6">
                                <div class="flex items-center gap-1">
                                    <button 
                                        @click="previewQuestionnaire(questionnaire)"
                                        class="p-1 hover:bg-gray-200 rounded"
                                        title="Preview"
                                    >
                                        <Icon name="heroicons:eye-20-solid" class="w-4 h-4 text-gray-600" />
                                    </button>
                                    <button 
                                        @click="deleteQuestionnaire(questionnaire)"
                                        class="p-1 hover:bg-gray-200 rounded"
                                        title="Hapus"
                                    >
                                        <Icon name="heroicons:trash-20-solid" class="w-4 h-4 text-red-600" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredQuestionnaires.length === 0" class="text-center py-12">
            <div class="text-gray-400 mb-4">
                <Icon name="heroicons:document-text-20-solid" class="w-16 h-16 mx-auto" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Tidak ada kuisioner ditemukan</h3>
            <p class="text-gray-500 mb-4">
                {{ searchQuery ? 'Coba ubah kata kunci pencarian atau' : 'Mulai dengan membuat kuisioner' }} 
            </p>
            <div class="flex justify-center gap-3">
                <button 
                    @click="openQuestionnaireInput = true"
                    class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 font-medium"
                >
                    Generate dengan AI
                </button>
                <button 
                    @click="openQuestionnaireInput = true"
                    class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 font-medium"
                >
                    Buat Manual
                </button>
            </div>
        </div>

        <!-- Pagination -->
        <div v-if="filteredQuestionnaires.length > itemsPerPage" class="flex justify-center">
            <nav class="flex items-center gap-2">
                <button 
                    @click="currentPage--"
                    :disabled="currentPage === 1"
                    class="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium
                            disabled:opacity-50 disabled:cursor-not-allowed
                            hover:bg-gray-50 transition-colors"
                >
                    Previous
                </button>
                
                <span class="px-4 py-2 text-sm text-gray-600">
                    Page {{ currentPage }} of {{ totalPages }}
                </span>
                
                <button 
                    @click="currentPage++"
                    :disabled="currentPage === totalPages"
                    class="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium
                        disabled:opacity-50 disabled:cursor-not-allowed
                        hover:bg-gray-50 transition-colors"
                >
                    Next
                </button>
            </nav>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import QuestionnaireFilter from '~/components/dashboard-admin/questionnaires/QuestionnaireFilter.vue'
import GenerateInputPopup from '~/components/modal/admin/dashboard/GenerateInputPopup.vue'
import type { Questionnaire } from '~/types/Questionnaire'

definePageMeta({
    layout: 'admin-dashboard-layout'
})

const openQuestionnaireInput = ref(false)
const openResponseModal = ref(false)
const selectedQuestionnaire = ref<Questionnaire | null>(null)

const searchQuery = ref('')
const selectedStatus = ref('')
const selectedType = ref('')
const sortBy = ref('newest')

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

// Sample data
const questionnaires = ref<Questionnaire[]>([
    {
        id: '1',
        title: 'Evaluasi Pembelajaran JavaScript',
        description: 'Kuisioner untuk mengevaluasi pemahaman siswa tentang JavaScript',
        type: 'ai-generated',
        status: 'active',
        questions_count: 15,
        responses_count: 24,
        created_at: '2024-01-15T08:00:00Z',
        updated_at: '2024-01-15T08:00:00Z'
    },
    {
        id: '2',
        title: 'Feedback Pembelajaran React',
        description: 'Kuisioner feedback untuk materi React',
        type: 'manual',
        status: 'active',
        questions_count: 10,
        responses_count: 18,
        created_at: '2024-01-20T08:00:00Z',
        updated_at: '2024-01-20T08:00:00Z'
    },
    {
        id: '3',
        title: 'Pre-Assessment Database',
        description: 'Kuisioner untuk mengukur pengetahuan awal database',
        type: 'ai-generated',
        status: 'draft',
        questions_count: 20,
        responses_count: 0,
        created_at: '2024-02-01T08:00:00Z',
        updated_at: '2024-02-01T08:00:00Z'
    }
])

const filteredQuestionnaires = computed(() => {
    let filtered = questionnaires.value

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(q => 
            q.title.toLowerCase().includes(query) ||
            q.description.toLowerCase().includes(query)
        )
    }

    if (selectedStatus.value) {
        filtered = filtered.filter(q => q.status === selectedStatus.value)
    }

    if (selectedType.value) {
        filtered = filtered.filter(q => q.type === selectedType.value)
    }

    // Sort
    filtered.sort((a, b) => {
        switch (sortBy.value) {
            case 'newest':
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            case 'title':
                return a.title.localeCompare(b.title)
            case 'responses':
                return b.responses_count - a.responses_count
            case 'questions':
                return b.questions_count - a.questions_count
            default:
                return 0
        }
    })

    return filtered
})

const paginatedQuestionnaires = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredQuestionnaires.value.slice(start, end)
})

const totalPages = computed(() => {
    return Math.ceil(filteredQuestionnaires.value.length / itemsPerPage)
})

const questionnaireStats = computed(() => {
    const active = questionnaires.value.filter(q => q.status === 'active').length
    const totalResponses = questionnaires.value.reduce((sum, q) => sum + q.responses_count, 0)
    const averageResponses = questionnaires.value.length > 0 
        ? Math.round((totalResponses / (questionnaires.value.length * 30)) * 100)
        : 0
    
    return {
        total: questionnaires.value.length,
        active,
        totalResponses,
        averageResponses
    }
})

const hasActiveFilters = computed(() => {
    return !!(searchQuery.value || selectedStatus.value || selectedType.value)
})

const activeFiltersCount = computed(() => {
    let count = 0
    if (searchQuery.value) count++
    if (selectedStatus.value) count++
    if (selectedType.value) count++
    return count
})

// Methods
const clearAllFilters = () => {
    searchQuery.value = ''
    selectedStatus.value = ''
    selectedType.value = ''
    currentPage.value = 1
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

// Action handlers
const toggleStatus = (questionnaire: Questionnaire) => {
    questionnaire.status = questionnaire.status === 'active' ? 'draft' : 'active'
    console.log('Toggle status:', questionnaire)
}

const viewResponses = (questionnaire: Questionnaire) => {
    selectedQuestionnaire.value = questionnaire
    openResponseModal.value = true
}

const previewQuestionnaire = (questionnaire: Questionnaire) => {
    console.log('Preview questionnaire:', questionnaire)
    // Navigate to preview page
}

const editQuestionnaire = (questionnaire: Questionnaire) => {
    console.log('Edit questionnaire:', questionnaire)
    // Open edit modal or navigate to edit page
}

const duplicateQuestionnaire = (questionnaire: Questionnaire) => {
    console.log('Duplicate questionnaire:', questionnaire)
    // Implement duplicate logic
}

const deleteQuestionnaire = (questionnaire: Questionnaire) => {
    console.log('Delete questionnaire:', questionnaire)
    // Implement delete logic with confirmation
}

// Watch for filter changes to reset pagination
watch([searchQuery, selectedStatus, selectedType], () => {
    currentPage.value = 1
})
</script>