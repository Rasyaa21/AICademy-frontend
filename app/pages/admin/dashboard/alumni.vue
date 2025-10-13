<template>
    <AlertModal 
        v-model:isOpen="alertModal.isOpen"
        :type="alertModal.type"
        :title="alertModal.title"
        :message="alertModal.message"
        @ok="handleAlertOk"
    />
    <AlumniDetailPopup
        v-model:is-open="openAlumniDetail"
        :alumni-id="selectedAlumniId"
    />
    
    <div class="space-y-6">
        <AdminPageHeader
            title="Alumni Management"
            description="Kelola data alumni dan monitor aktivitas mereka"
        />

        <AlumniStatsSection :alumni-stats="alumniStats" />

        <!-- Loading State -->
        <div v-if="pending" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p class="text-gray-500 mt-2">Memuat data alumni...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8">
            <p class="text-red-500">Error: {{ error.message }}</p>
            <button @click="refresh()" class="mt-2 px-4 py-2 bg-primary text-white rounded-lg">
                Coba Lagi
            </button>
        </div>

        <!-- Content -->
        <template v-else>
            <AlumniFilter
                v-model:searchQuery="searchQuery"
                v-model:sortBy="sortBy"
                :filteredCount="totalItems"
                :totalCount="totalItems"
                :activeFiltersCount="activeFiltersCount"
                :hasActiveFilters="hasActiveFilters"
                @clear-filters="clearAllFilters"
            />

            <AlumniTableSection
                :paginated-alumni="alumni"
                @view-alumni="viewAlumni"
                @delete-alumni="deleteAlumni"
            />

            <AlumniEmptyState
                v-if="alumni.length === 0"
                :search-query="searchQuery"
                @clear-filters="clearAllFilters"
            />

            <AlumniPaginationSection
                v-if="totalPages > 1"
                :current-page="currentPage"
                :total-pages="totalPages"
                :total-items="totalItems"
                :items-per-page="itemsPerPage"
                @page-changed="handlePageChange"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AdminPageHeader from '~/components/dashboard-admin/shared/AdminPageHeader.vue'
import AlumniStatsSection from '~/components/dashboard-admin/alumni/AlumniStatsSection.vue'
import AlumniTableSection from '~/components/dashboard-admin/alumni/AlumniTableSection.vue'
import AlumniEmptyState from '~/components/dashboard-admin/alumni/AlumniEmptyState.vue'
import AlumniPaginationSection from '~/components/dashboard-admin/alumni/AlumniPaginationSection.vue'
import AlumniFilter from '~/components/dashboard-admin/alumni/AlumniFilter.vue'

import AlertModal from '~/components/modal/basic-modal/AlertModal.vue'
import AlumniDetailPopup from '~/components/modal/admin/dashboard/alumni/AlumniDetailPopup.vue'
import type { Alumni } from '~/types/Alumni'

definePageMeta({
    layout: 'admin-dashboard-layout'
})

const config = useRuntimeConfig()

// Alert modal state
const alertModal = ref({
    isOpen: false,
    type: 'success' as 'success' | 'error' | 'warning' | 'info',
    title: '',
    message: ''
})

// Filter states
const openAlumniDetail = ref(false)
const searchQuery = ref('')
const sortBy = ref('newest')
const selectedAlumniId = ref()

// Pagination
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
    
    if (sortBy.value) {
        params.append('sort', sortBy.value)
    }
    
    return params.toString()
}

// Fetch data from API
const { data: alumniData, pending, error, refresh } = await useAsyncData('alumniData', () => 
    $fetch(`/admin/users/alumni?${buildApiQuery()}`, {
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers
    }), {
        watch: [currentPage, searchQuery, sortBy]
    }
)

// Use API data directly
const alumni = computed(() => alumniData.value?.data?.data || [])
const totalPages = computed(() => alumniData.value?.data?.total_pages || 1)
const totalItems = computed(() => alumniData.value?.data?.total || 0)

const alumniStats = computed(() => {
    // For accurate stats, you might need a separate API endpoint
    const newThisMonth = alumni.value.filter(a => {
        const createdDate = new Date(a.created_at)
        const now = new Date()
        return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear()
    }).length
    
    return {
        total: totalItems.value,
        newThisMonth,
        withCv: alumni.value.filter(a => a.cv_file).length
    }
})

const hasActiveFilters = computed(() => {
    return !!(searchQuery.value)
})

const activeFiltersCount = computed(() => {
    let count = 0
    if (searchQuery.value) count++
    return count
})

// Methods
const clearAllFilters = () => {
    searchQuery.value = ''
    currentPage.value = 1
}

const handlePageChange = (page: number) => {
    currentPage.value = page
}

const viewAlumni = (alumni: Alumni) => {
    selectedAlumniId.value = alumni.id
    openAlumniDetail.value = true
}

const deleteAlumni = async (alumni: Alumni) => {
    if (confirm('Apakah Anda yakin ingin menghapus alumni ini?')) {
        try {
            await $fetch(`/admin/users/alumni/${alumni.id}`, {
                method: 'DELETE',
                baseURL: config.public.apiBase,
                credentials: 'include',
                headers
            })
            showSuccessModal('Alumni berhasil dihapus')
            refresh()
        } catch (error) {
            console.error('Error deleting alumni:', error)
            showErrorModal('Gagal menghapus alumni')
        }
    }
}

// Alert modal handlers
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
        refresh()
    }
}

// Reset page when filters change
watch([searchQuery, sortBy], () => {
    currentPage.value = 1
})
</script>