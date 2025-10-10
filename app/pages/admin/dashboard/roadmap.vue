<template>
    <AlertModal 
        v-model:isOpen="alertModal.isOpen"
        :type="alertModal.type"
        :title="alertModal.title"
        :message="alertModal.message"
        @ok="handleAlertOk"
    />

    <CreateRoadmapPopup 
        :is-open="openCreateRoadmap"
        @show-success-modal="showSuccessModal"
        @show-error-modal="showErrorModal"
        @close="openCreateRoadmap = false"
    />

    <EditRoadmapPopup
        :is-open="openEditRoadmap"
        :roadmap-id="selectedRoadmap"
        :initial-data="selectedRoadmapData"
        @show-success-modal="showSuccessModal"
        @show-error-modal="showErrorModal"
        @close="openEditRoadmap = false"
        @roadmap-updated="refresh"
    />

    <DetailRoadmapPopup
        :is-open="openDetailRoadmap"
        :roadmap-id="selectedRoadmap"
        @close="openDetailRoadmap = false"
        @show-success-modal="showSuccessModal"
        @show-error-modal="showErrorModal"
    />

    <EditStatusPopup
        :is-open="openEditRoadmapStatus"
        :roadmap-id="selectedRoadmap"
        :current-status="selectedRoadmapData?.status"
        @show-success-modal="showSuccessModal"
        @show-error-modal="showErrorModal"
        @close="openEditRoadmapStatus = false"
        @status-updated="refresh"
    />

    <div class="space-y-6">
        <AdminPageHeader
            title="Roadmap Management"
            description="Kelola roadmap dan langkah-langkah pembelajaran"
        />

        <RoadmapStatsSection :roadmap-stats="roadmapStats" />

        <div v-if="pending" class="flex flex-col items-center justify-center py-12">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <p class="text-gray-500 mt-4">Memuat roadmap...</p>
        </div>

        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
            <div class="flex items-center">
                <Icon name="heroicons:exclamation-triangle-20-solid" class="w-5 h-5 text-red-500 mr-2" />
                <p class="text-red-700 font-medium">Gagal memuat roadmap</p>
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
            <RoadmapFilter
                :search-query="searchQuery"
                :selected-status="selectedStatus"
                :sort-by="sortBy"
                :filtered-count="roadmaps.length"
                :total-count="totalItems"
                :has-active-filters="hasActiveFilters"
                @update:search-query="searchQuery = $event"
                @update:selected-status="selectedStatus = $event"
                @update:sort-by="sortBy = $event"
                @clear-filters="clearAllFilters"
                @add-roadmap="openCreateRoadmap = true"
            />

            <RoadmapEmptyState
                v-if="roadmaps.length === 0"
                :search-query="searchQuery"
                @clear-filters="clearAllFilters"
                @add-roadmap="openCreateRoadmap = true"
            />

            <template v-else>
                <RoadmapTableSection
                    :roadmaps="roadmaps"
                    :current-page="currentPage"
                    :total-pages="totalPages"
                    :total-items="totalItems"
                    :items-per-page="itemsPerPage"
                    @view-roadmap="viewRoadmap"
                    @edit-roadmap="editRoadmap"
                    @delete-roadmap="confirmDeleteRoadmap"
                    @edit-status="editStatus"
                    @page-changed="handlePageChange"
                />

                <RoadmapPaginationSection
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
import AdminPageHeader from '~/components/dashboard-admin/shared/AdminPageHeader.vue'
import RoadmapStatsSection from '~/components/dashboard-admin/roadmap/RoadmapStatsSection.vue'
import RoadmapTableSection from '~/components/dashboard-admin/roadmap/RoadmapTableSection.vue'
import RoadmapFilter from '~/components/dashboard-admin/roadmap/RoadmapFilter.vue'
import RoadmapEmptyState from '~/components/dashboard-admin/roadmap/RoadmapEmptyState.vue'
import RoadmapPaginationSection from '~/components/dashboard-admin/roadmap/RoadmapPaginationSection.vue'
import CreateRoadmapPopup from '~/components/modal/admin/dashboard/roadmap/CreateRoadmapPopup.vue'
import EditRoadmapPopup from '~/components/modal/admin/dashboard/roadmap/EditRoadmapPopup.vue'
import DetailRoadmapPopup from '~/components/modal/admin/dashboard/roadmap/DetailRoadmapPopup.vue'
import EditStatusPopup from '~/components/modal/admin/dashboard/roadmap/EditStatusPopup.vue'
import AlertModal from '~/components/modal/basic-modal/AlertModal.vue'
import type { Roadmap } from '~/types/Roadmap'

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

const confirmModal = ref({
    isOpen: false,
    type: 'danger' as 'danger' | 'warning',
    title: '',
    message: '',
    confirmText: '',
    cancelText: 'Batal',
    action: null as (() => Promise<void>) | null
})

const openCreateRoadmap = ref(false)
const openEditRoadmap = ref(false)
const openDetailRoadmap = ref(false)
const openEditRoadmapStatus = ref(false)
const selectedRoadmap = ref<string | null>(null)
const selectedRoadmapData = ref<Roadmap | null>(null)

const searchQuery = ref('')
const selectedStatus = ref('')
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
    
    if (selectedStatus.value) {
        params.append('status', selectedStatus.value)
    }
    
    if (sortBy.value) {
        params.append('sort', sortBy.value)
    }
    
    return params.toString()
}

// Watch all filter parameters
const { data: roadmapsData, pending, error, refresh } = await useAsyncData('roadmapsData', () => 
    $fetch(`/admin/roadmaps?${buildApiQuery()}`, {
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers
    }), {
        watch: [currentPage, searchQuery, selectedStatus, sortBy]
    }
)

// Use API data directly (no client-side filtering)
const roadmaps = computed(() => roadmapsData.value?.data?.data || [])
const totalPages = computed(() => roadmapsData.value?.data?.total_pages || 1)
const totalItems = computed(() => roadmapsData.value?.data?.total || 0)

const roadmapStats = computed(() => {
    if (!roadmapsData.value?.data?.stats) {
        // Fallback calculation if stats not provided by API
        const allRoadmaps = roadmaps.value
        const active = allRoadmaps.filter(r => r.status === 'active').length
        const draft = allRoadmaps.filter(r => r.status === 'draft').length
        const inactive = allRoadmaps.filter(r => r.status === 'inactive').length
        
        return {
            total: totalItems.value,
            active,
            draft,
            inactive
        }
    }
    
    return roadmapsData.value.data.stats
})

const hasActiveFilters = computed(() => {
    return !!(searchQuery.value || selectedStatus.value)
})

// Methods
const clearAllFilters = () => {
    searchQuery.value = ''
    selectedStatus.value = ''
    sortBy.value = 'newest'
    currentPage.value = 1
}

const handlePageChange = (page: number) => {
    currentPage.value = page
}

const viewRoadmap = (roadmap: Roadmap) => {
    selectedRoadmap.value = roadmap.id
    selectedRoadmapData.value = roadmap
    openDetailRoadmap.value = true
}

const editRoadmap = (roadmap: Roadmap) => {
    selectedRoadmap.value = roadmap.id
    selectedRoadmapData.value = roadmap
    openEditRoadmap.value = true
}

const editStatus = (roadmap: Roadmap) => {
    selectedRoadmap.value = roadmap.id
    selectedRoadmapData.value = roadmap
    openEditRoadmapStatus.value = true
}

const confirmDeleteRoadmap = (roadmap: Roadmap) => {
    confirmModal.value = {
        isOpen: true,
        type: 'danger',
        title: 'Hapus Roadmap',
        message: `Apakah Anda yakin ingin menghapus roadmap "${roadmap.roadmap_name}"? Tindakan ini tidak dapat dibatalkan.`,
        confirmText: 'Hapus',
        cancelText: 'Batal',
        action: () => deleteRoadmap(roadmap)
    }
}

const deleteRoadmap = async (roadmap: Roadmap) => {
    try {
        await $fetch(`/admin/roadmaps/${roadmap.id}`, {
            method: 'DELETE',
            baseURL: config.public.apiBase,
            credentials: 'include',
            headers
        })
        showSuccessModal('Roadmap berhasil dihapus')
        refresh()
    } catch (error) {
        console.error('Error deleting roadmap:', error)
        showErrorModal('Gagal menghapus roadmap')
    }
}

const handleConfirmAction = async () => {
    if (confirmModal.value.action) {
        await confirmModal.value.action()
    }
    confirmModal.value.isOpen = false
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
watch([searchQuery, selectedStatus, sortBy], () => {
    currentPage.value = 1
})
</script>