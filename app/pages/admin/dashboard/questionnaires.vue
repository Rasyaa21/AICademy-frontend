<template>
    <GenerateInputPopup v-model:is-open="openQuestionnaireInput"/>
    <div class="space-y-6">
        <AdminPageHeader
            title="Questionnaires Management"
            description="Kelola kuisioner dan analisis respons siswa"
        />

        <QuestionnairesStatsSection :questionnaire-stats="questionnaireStats" />

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

        <QuestionnairesTableSection
            :paginated-questionnaires="paginatedQuestionnaires"
            @toggle-status="toggleStatus"
            @view-responses="viewResponses"
            @preview-questionnaire="previewQuestionnaire"
            @delete-questionnaire="deleteQuestionnaire"
        />

        <AdminEmptyState
            v-if="filteredQuestionnaires.length === 0"
            icon="heroicons:document-text-20-solid"
            title="Tidak ada kuisioner ditemukan"
            :description="searchQuery ? 'Coba ubah kata kunci pencarian atau filter untuk melihat kuisioner lainnya' : 'Mulai dengan membuat kuisioner'"
            :show-clear-button="!!searchQuery"
            @clear-filters="clearAllFilters"
        >
            <template #actions>
                <button 
                    @click="openQuestionnaireInput = true"
                    class="px-4 py-2 font-medium text-white rounded-lg bg-primary hover:bg-primary/90"
                >
                    Generate dengan AI
                </button>
                <button 
                    @click="openQuestionnaireInput = true"
                    class="px-4 py-2 font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700"
                >
                    Buat Manual
                </button>
            </template>
        </AdminEmptyState>

        <AdminPaginationSection
            :current-page="currentPage"
            :total-pages="totalPages"
            :total-items="filteredQuestionnaires.length"
            :items-per-page="itemsPerPage"
            @page-changed="(page: number) => currentPage = page"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AdminPageHeader from '~/components/dashboard-admin/shared/AdminPageHeader.vue'
import AdminEmptyState from '~/components/dashboard-admin/shared/AdminEmptyState.vue'
import AdminPaginationSection from '~/components/dashboard-admin/shared/AdminPaginationSection.vue'
import QuestionnairesStatsSection from '~/components/dashboard-admin/questionnaires/QuestionnairesStatsSection.vue'
import QuestionnairesTableSection from '~/components/dashboard-admin/questionnaires/QuestionnairesTableSection.vue'
import QuestionnaireFilter from '~/components/dashboard-admin/questionnaires/QuestionnaireFilter.vue'
import GenerateInputPopup from '~/components/modal/admin/dashboard/GenerateInputPopup.vue'

definePageMeta({
    layout: 'admin-dashboard-layout'
})

interface Questionnaire {
    id: string
    title: string
    description: string
    type: string
    status: string
    questions_count: number
    responses_count: number
    created_at: string
    updated_at: string
}

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

const deleteQuestionnaire = (questionnaire: Questionnaire) => {
    console.log('Delete questionnaire:', questionnaire)
    // Implement delete logic with confirmation
}

// Watch for filter changes to reset pagination
watch([searchQuery, selectedStatus, selectedType], () => {
    currentPage.value = 1
})
</script>