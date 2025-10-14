<template>
    <AlertModal 
        v-model:is-open="alertModal.isOpen"
        :type="alertModal.type"
        :title="alertModal.title"
        :message="alertModal.message"
        @ok="handleAlertOk"
    />
    <ChallengeInputPopup 
        v-model:is-open="openChallengeInput"
        :edit-data="editingChallenge"
        @show-success-modal="showSuccessModal"
        @show-error-modal="showErrorModal"
    />
    <ChallengeDetailPopup
        v-model:is-open="openChallengeDetail"
        :challenge-id="selectedChallengeId"
    />
    
    <div class="space-y-6">
        <AdminPageHeader
            title="Manajemen Challenge"
            description="Kelola data challenge dan monitor submission tim"
        />

        <ChallengesStatsSection :challenge-stats="challengeStats" />

        <!-- Loading State -->
        <div v-if="pending" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p class="mt-4 text-gray-600">Memuat data challenge...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8">
            <div class="text-red-500 mb-4">
                <Icon name="heroicons:exclamation-triangle-20-solid" class="mx-auto w-12 h-12" />
            </div>
            <p class="text-gray-600">Gagal memuat data challenge</p>
            <button class="mt-2 text-primary hover:text-primary/80" @click="refresh()">Coba lagi</button>
        </div>

        <!-- Content -->
        <template v-else>
            <ChallengeFilter
                v-model:search-query="searchQuery"
                v-model:selected-status="selectedStatus"
                v-model:sort-by="sortBy"
                :filtered-count="challenges.length"
                :total-count="totalItems"
                :active-filters-count="activeFiltersCount"
                :has-active-filters="hasActiveFilters"
                @clear-filters="clearAllFilters"
                @add-challenge="openChallengeInput = true"
            />

            <ChallengesEmptyState 
                v-if="challenges.length === 0"
                :search-query="searchQuery"
                @clear-filters="clearAllFilters"
            />
            
            <template v-else>
                <ChallengesTableSection
                    :paginated-challenges="challenges"
                    @view-challenge="viewChallenge"
                    @edit-challenge="editChallenge"
                    @delete-challenge="deleteChallenge"
                />

                <ChallengesPaginationSection
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
import AdminPageHeader from '~/components/dashboard-admin/shared/AdminPageHeader.vue'
import ChallengesStatsSection from '~/components/dashboard-admin/challenges/ChallengesStatsSection.vue'
import ChallengesTableSection from '~/components/dashboard-admin/challenges/ChallengesTableSection.vue'
import ChallengesEmptyState from '~/components/dashboard-admin/challenges/ChallengesEmptyState.vue'
import ChallengesPaginationSection from '~/components/dashboard-admin/challenges/ChallengesPaginationSection.vue'
import ChallengeFilter from '~/components/dashboard-admin/challenges/ChallengesFilter.vue'
import ChallengeInputPopup from '~/components/modal/admin/dashboard/challenge/ChallengeInputPopup.vue'
import AlertModal from '~/components/modal/basic-modal/AlertModal.vue'
import ChallengeDetailPopup from '~/components/modal/admin/dashboard/challenge/ChallengeDetailPopup.vue'
import type { Challenge } from '~/types/Challenge'

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

// Filter states
const openChallengeInput = ref(false)
const openChallengeDetail = ref(false)
const searchQuery = ref('')
const selectedStatus = ref('')
const sortBy = ref('newest')
const selectedChallengeId = ref<string | null>(null)
const editingChallenge = ref(null)

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

const headers = useRequestHeaders(['cookie'])

// ✅ Build API query with all parameters
const buildApiQuery = () => {
    const params = new URLSearchParams({
        page: currentPage.value.toString(),
        limit: itemsPerPage.toString()
    })
    
    if (searchQuery.value.trim()) {
        params.append('search', searchQuery.value.trim())
    }
    
    if (selectedStatus.value) {
        params.append('status', selectedStatus.value)
    }
    
    if (sortBy.value) {
        params.append('sort', sortBy.value)
    }
    
    return params.toString()
}

// ✅ Fetch data from API
const { data: challengeData, pending, error, refresh } = await useAsyncData('challengeData', () => 
    $fetch(`/admin/challenges?${buildApiQuery()}`, {
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers
    }), {
        watch: [currentPage, searchQuery, selectedStatus, sortBy]
    }
)

// ✅ Use API data directly (no client-side filtering)
const challenges = computed(() => challengeData.value?.data?.data || [])
const totalPages = computed(() => challengeData.value?.data?.total_pages || 1)
const totalItems = computed(() => challengeData.value?.data?.total || 0)

// ✅ Challenge stats from API data
const challengeStats = computed(() => {
    const activeChallenges = challenges.value.filter(c => new Date(c.deadline) > new Date()).length
    const completedChallenges = challenges.value.filter(c => new Date(c.deadline) <= new Date()).length
    
    return {
        total: totalItems.value,
        active: activeChallenges,
        completed: completedChallenges,
        totalSubmissions: challenges.value.reduce((sum, c) => sum + (c.current_participants || 0), 0)
    }
})

const hasActiveFilters = computed(() => {
    return !!(searchQuery.value || selectedStatus.value)
})

const activeFiltersCount = computed(() => {
    let count = 0
    if (searchQuery.value) count++
    if (selectedStatus.value) count++
    return count
})

// Methods
const clearAllFilters = () => {
    searchQuery.value = ''
    selectedStatus.value = ''
    currentPage.value = 1
}

// ✅ Proper page change handler
const handlePageChange = (page: number) => {
    currentPage.value = page
}

// Action handlers
const viewChallenge = (challenge: Challenge) => {
    selectedChallengeId.value = challenge.id
    openChallengeDetail.value = true
}

const editChallenge = (challenge: Challenge) => {
    editingChallenge.value = {
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        deadline: challenge.deadline,
        prize: challenge.prize,
        max_participants: challenge.max_participants
    }
    openChallengeInput.value = true
}

const deleteChallenge = async (challenge: Challenge) => {
    if (confirm('Apakah Anda yakin ingin menghapus challenge ini?')) {
        try {
            await $fetch(`/admin/challenges/${challenge.id}`, {
                method: 'DELETE',
                baseURL: config.public.apiBase,
                credentials: 'include',
                headers
            })
            
            showSuccessModal('Challenge berhasil dihapus')
            await refresh()
        } catch (error) {
            console.error('Error deleting challenge:', error)
            showErrorModal('Gagal menghapus challenge')
        }
    }
}

// Alert modal handlers
const showSuccessModal = (message: string) => {
    alertModal.value = {
        isOpen: true,
        type: 'success',
        title: 'Berhasil',
        message
    }
}

const showErrorModal = (message: string) => {
    alertModal.value = {
        isOpen: true,
        type: 'error',
        title: 'Gagal',
        message
    }
}

const handleAlertOk = () => {
    alertModal.value.isOpen = false
    if (alertModal.value.type === 'success') {
        refresh()
    }
}

// ✅ Reset page when filters change
watch([searchQuery, selectedStatus, sortBy], () => {
    currentPage.value = 1
})
</script>