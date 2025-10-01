<template>
    <AlertModal 
        v-model:isOpen="alertModal.isOpen"
        :type="alertModal.type"
        :title="alertModal.title"
        :message="alertModal.message"
        @ok="handleAlertOk"
    />
    <GenerateInputPopup 
        v-model:is-open="openQuestionnaireInput"
        @show-success-modal="showSuccessModal"
        @show-error-modal="showErrorModal"
    />

    <EditStatusPopup
        :questionnaires-id="selectedQuestionnaire"
        v-model:is-open="openEditQuestionnaireStatus"
        @show-success-modal="showSuccessModal"
        @show-error-modal="showErrorModal"
    />

    <DetailQuestionnairesPopup
        :questionnaire-id="selectedQuestionnaire"
        v-model:is-open="openDetailQuestionnaire"
    />

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
            :totalCount="questionnairesData?.data?.total || 0"
            :activeFiltersCount="activeFiltersCount"
            :hasActiveFilters="hasActiveFilters"
            @clear-filters="clearAllFilters"
            @generate-questionnaire="openQuestionnaireInput = true"
        />

        <!-- Loading State -->
        <div v-if="pending" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p class="text-gray-500 mt-2">Memuat data kuisioner...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8">
            <p class="text-red-500">Error: {{ error.message }}</p>
            <button @click="refresh()" class="mt-2 px-4 py-2 bg-primary text-white rounded-lg">
                Coba Lagi
            </button>
        </div>

        <QuestionnairesTableSection
            v-else
            :paginated-questionnaires="paginatedQuestionnaires"
            @view-responses="viewResponses"
            @edit-questionnaire="editStatus"
            @preview-questionnaire="previewQuestionnaire"
            @delete-questionnaire="deleteQuestionnaire"
        />

        <AdminEmptyState
            v-if="!pending && !error && filteredQuestionnaires.length === 0"
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
            v-if="!pending && !error && totalPages > 1"
            :current-page="currentPage"
            :total-pages="totalPages"
            :total-items="questionnairesData?.data?.total || 0"
            :items-per-page="itemsPerPage"
            @page-changed="handlePageChange"
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
import GenerateInputPopup from '~/components/modal/admin/dashboard/questionnaires/GenerateInputPopup.vue'
import AlertModal from '~/components/modal/basic-modal/AlertModal.vue'
import type { Questionnaire } from '~/types/Questionnaire'
import EditStatusPopup from '~/components/modal/admin/dashboard/questionnaires/EditStatusPopup.vue'
import DetailQuestionnairesPopup from '~/components/modal/admin/dashboard/questionnaires/DetailQuestionnairesPopup.vue'

definePageMeta({
    layout: 'admin-dashboard-layout'
})

const config = useRuntimeConfig()

const alertModal = ref({
    isOpen: false,
    type: 'success' as 'success' | 'error' | 'warning' | 'info',
    title: '',
    message: ''
})

const openQuestionnaireInput = ref(false)
const openResponseModal = ref(false)
const selectedQuestionnaire = ref<string | null>(null)
const openEditQuestionnaireStatus = ref(false)
const openDetailQuestionnaire = ref(false)

const searchQuery = ref('')
const selectedStatus = ref('')
const selectedType = ref('')
const sortBy = ref('newest')

const currentPage = ref(1)
const itemsPerPage = 10


const headers = useRequestHeaders(['cookie']) 
const { data: questionnairesData, pending, error, refresh } = await useAsyncData('questionnairesData', () => 
    $fetch(`/admin/questionnaires?page=${currentPage.value}&limit=${itemsPerPage}`, {
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers
    }), {
        watch: [currentPage]
    }
)

// Computed properties based on API response structure
const questionnaires = computed(() => questionnairesData.value?.data?.data || [])

const filteredQuestionnaires = computed(() => {
    let filtered = [...questionnaires.value]

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(q => 
            q.title.toLowerCase().includes(query) ||
            q.description.toLowerCase().includes(query)
        )
    }

    if (selectedStatus.value) {
        const isActive = selectedStatus.value === 'active'
        filtered = filtered.filter(q => q.active === isActive)
    }

    if (selectedType.value) {
        filtered = filtered.filter(q => q.target_roles === selectedType.value)
    }

    filtered.sort((a, b) => {
        switch (sortBy.value) {
            case 'newest':
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            case 'title':
                return a.title.localeCompare(b.title)
            case 'version':
                return a.version.localeCompare(b.version)
            default:
                return 0
        }
    })

    return filtered
})

const paginatedQuestionnaires = computed(() => {
    if (hasActiveFilters.value) {
        const start = (currentPage.value - 1) * itemsPerPage
        const end = start + itemsPerPage
        return filteredQuestionnaires.value.slice(start, end)
    }
    return filteredQuestionnaires.value
})

const totalPages = computed(() => {
    if (hasActiveFilters.value) {
        return Math.ceil(filteredQuestionnaires.value.length / itemsPerPage)
    }
    return questionnairesData.value?.data?.total_pages || 1
})

const questionnaireStats = computed(() => {
    const active = questionnaires.value.filter(q => q.active).length
    const inactive = questionnaires.value.filter(q => !q.active).length
    
    return {
        total: questionnairesData.value?.data?.total || 0,
        active,
        inactive,
        draft: inactive // assuming inactive = draft
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

const handlePageChange = (page: number) => {
    currentPage.value = page
}

const viewResponses = (questionnaire: Questionnaire) => {
    // selectedQuestionnaire.value = questionnaire
    openResponseModal.value = true
    console.log('View responses:', questionnaire)
}


const previewQuestionnaire = (questionnaire: Questionnaire) => {
    selectedQuestionnaire.value = questionnaire.id
    openDetailQuestionnaire.value = true
}

const deleteQuestionnaire = async (questionnaire: Questionnaire) => {
    if (confirm('Apakah Anda yakin ingin menghapus kuisioner ini?')) {
        try {
            await $fetch(`/admin/questionnaires/${questionnaire.id}`, {
                method: 'DELETE',
                baseURL: config.public.apiBase,
                credentials: 'include',
                headers
            })
            showSuccessModal('Kuisioner berhasil dihapus')
            refresh()
        } catch (error) {
            console.error('Error deleting questionnaire:', error)
            showErrorModal('Gagal menghapus kuisioner')
        }
    }
}

// Alert modal handlers - sama seperti roles
const showSuccessModal = (message: string) => {
    alertModal.value = {
        isOpen: true,
        type: 'success',
        title: 'Berhasil',
        message: message
    }
}

const showErrorModal = (message: string) => {
    alertModal.value = {
        isOpen: true,
        type: 'error',
        title: 'Gagal',
        message: message
    }
}

const handleAlertOk = () => {
    alertModal.value.isOpen = false
    if (alertModal.value.type === 'success') {
        refresh() // Refresh data after success
    }
}

const editStatus = (data : Questionnaire) => {
    selectedQuestionnaire.value = data.id
    openEditQuestionnaireStatus.value = true
}

watch([searchQuery, selectedStatus, selectedType], () => {
    currentPage.value = 1
})
</script>