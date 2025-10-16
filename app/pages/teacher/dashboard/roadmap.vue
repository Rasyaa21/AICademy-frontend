<template>
    <AlertModal 
        v-model:isOpen="alertModal.isOpen"
        :type="alertModal.type"
        :title="alertModal.title"
        :message="alertModal.message"
        @ok="handleAlertOk"
    />

    <SubmissionReviewModal
        v-model:is-open="reviewModal.isOpen"
        :submission="selectedSubmission"
        @show-success-modal="showSuccessModal"
        @show-error-modal="showErrorModal"
        @submission-reviewed="refresh"
    />

    <div class="space-y-6">
        <TeacherPageHeader
            title="Roadmap Submissions"
            description="Review dan validasi submission roadmap dari siswa"
        />

        <SubmissionStatsSection :submission-stats="submissionStats" />

        <div v-if="pending" class="flex flex-col items-center justify-center py-12">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <p class="text-gray-500 mt-4">Memuat submissions...</p>
        </div>

        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
            <div class="flex items-center">
                <Icon name="heroicons:exclamation-triangle-20-solid" class="w-5 h-5 text-red-500 mr-2" />
                <p class="text-red-700 font-medium">Gagal memuat submissions</p>
            </div>
            <p class="text-red-600 mt-1 text-sm">{{ error.message }}</p>
            <button 
                @click="refresh()" 
                class="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
                Coba Lagi
            </button>
        </div>

        <template v-else>
            <SubmissionFilter
                :search-query="searchQuery"
                :selected-roadmap="selectedRoadmap"
                :sort-by="sortBy"
                :filtered-count="submissions.length"
                :total-count="totalItems"
                :has-active-filters="hasActiveFilters"
                @update:search-query="searchQuery = $event"
                @update:selected-roadmap="selectedRoadmap = $event"
                @update:sort-by="sortBy = $event"
                @clear-filters="clearAllFilters"
            />

            <RoadmapEmptyState
                v-if="submissions.length === 0"
                :search-query="searchQuery"
                @clear-filters="clearAllFilters"
            />

            <template v-else>
                <SubmissionTableSection
                    :submissions="submissions"
                    :current-page="currentPage"
                    :total-pages="totalPages"
                    :total-items="totalItems"
                    :items-per-page="itemsPerPage"
                    @review-submission="reviewSubmission"
                    @page-changed="handlePageChange"
                />

                <SubmissionPaginationSection
                    v-if="totalPages > 1"
                    :current-page="currentPage"
                    :total-pages="totalPages"
                    :total-items="totalItems"
                    :items-per-page="itemsPerPage"
                    @page-changed="handlePageChange"
                />
            </template>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import RoadmapEmptyState from '~/components/dashboard-admin/roadmap/RoadmapEmptyState.vue'
import SubmissionStatsSection from '~/components/dashboard-teacher/roadmap-submission/SubmissionStatsSection.vue'
import SubmissionTableSection from '~/components/dashboard-teacher/roadmap-submission/SubmissionTableSection.vue'
import TeacherPageHeader from '~/components/dashboard-teacher/shared/TeacherPageHeader.vue'

import AlertModal from '~/components/modal/basic-modal/AlertModal.vue'
import SubmissionReviewModal from '~/components/modal/teacher/dashboard/roadmap/SubmissionReviewModal.vue'
import type { RoadmapSubmission } from '~/types/RoadmapSubmission'

definePageMeta({
    layout: 'teacher-dashboard-layout'
})

const config = useRuntimeConfig()

const alertModal = ref({
    isOpen: false,
    type: 'success' as 'success' | 'error' | 'warning' | 'info',
    title: '',
    message: ''
})

const reviewModal = ref({
    isOpen: false
})

const selectedSubmission = ref<RoadmapSubmission | null>(null)

const searchQuery = ref('')
const selectedRoadmap = ref('')
const sortBy = ref('newest')

const currentPage = ref(1)
const itemsPerPage = 10

const headers = useRequestHeaders(['cookie'])

// Build API query with all parameters
const buildApiQuery = () => {
    const params = new URLSearchParams({
        page: currentPage.value.toString(),
        limit: itemsPerPage.toString()
    })
    
    if (searchQuery.value.trim()) {
        params.append('search', searchQuery.value.trim())
    }
    
    if (selectedRoadmap.value) {
        params.append('roadmap', selectedRoadmap.value)
    }
    
    if (sortBy.value) {
        params.append('sort', sortBy.value)
    }
    
    return params.toString()
}

// Fetch submissions data
const { data: submissionsData, pending, error, refresh } = await useAsyncData('submissionsData', () => 
    $fetch(`/teacher/roadmaps/submissions?${buildApiQuery()}`, {
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers
    }), {
        watch: [currentPage, searchQuery, selectedRoadmap, sortBy]
    }
)

const submissions = computed(() => submissionsData.value?.data?.data || [])
const totalPages = computed(() => submissionsData.value?.data?.total_pages || 1)
const totalItems = computed(() => submissionsData.value?.data?.total || 0)

const submissionStats = computed(() => {
    const allSubmissions = submissions.value
    const pending = allSubmissions.length // All submissions are pending by default
    
    return {
        total: totalItems.value,
        pending,
        approved: 0,
        rejected: 0
    }
})

const hasActiveFilters = computed(() => {
    return !!(searchQuery.value || selectedRoadmap.value)
})

// Methods
const clearAllFilters = () => {
    searchQuery.value = ''
    selectedRoadmap.value = ''
    sortBy.value = 'newest'
    currentPage.value = 1
}

const handlePageChange = (page: number) => {
    currentPage.value = page
}

const reviewSubmission = (submission: RoadmapSubmission) => {
    selectedSubmission.value = submission
    reviewModal.value.isOpen = true
}

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
        title: 'Error',
        message: message
    }
}

const handleAlertOk = () => {
    alertModal.value.isOpen = false
    if (alertModal.value.type === 'success') {
        refresh()
    }
}

// Reset page when filters change
watch([searchQuery, selectedRoadmap, sortBy], () => {
    currentPage.value = 1
})
</script>