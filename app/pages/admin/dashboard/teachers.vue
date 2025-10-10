<template>
    <AlertModal 
        v-model:isOpen="alertModal.isOpen"
        :type="alertModal.type"
        :title="alertModal.title"
        :message="alertModal.message"
        @ok="handleAlertOk"
    />
    <TeacherInputPopup 
        v-model:is-open="openTeacherInput"
        @show-success-modal="showSuccessModal"
        @show-error-modal="showErrorModal"
    />
    <div class="space-y-6">
        <AdminPageHeader
            title="Teachers Management"
            description="Kelola data guru dan monitor aktivitas mereka"
        />

        <TeachersStatsSection :teacher-stats="teacherStats" />

        <!-- Loading State -->
        <div v-if="pending" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p class="text-gray-500 mt-2">Memuat data guru...</p>
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
            <TeacherFilter
                v-model:searchQuery="searchQuery"
                v-model:selectedStatus="selectedStatus"
                v-model:sortBy="sortBy"
                :filteredCount="totalItems"
                :totalCount="totalItems"
                :activeFiltersCount="activeFiltersCount"
                :hasActiveFilters="hasActiveFilters"
                @clear-filters="clearAllFilters"
                @add-teacher="openTeacherInput = true"
            />

            <TeachersTableSection
                :paginated-teachers="teachers"
                @edit-teacher="editTeacher"
                @delete-teacher="deleteTeacher"
            />

            <TeachersEmptyState
                v-if="teachers.length === 0"
                :search-query="searchQuery"
                @clear-filters="clearAllFilters"
            />

            <TeachersPaginationSection
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
import TeachersStatsSection from '~/components/dashboard-admin/teachers/TeachersStatsSection.vue'
import TeachersTableSection from '~/components/dashboard-admin/teachers/TeachersTableSection.vue'
import TeachersEmptyState from '~/components/dashboard-admin/teachers/TeachersEmptyState.vue'
import TeachersPaginationSection from '~/components/dashboard-admin/teachers/TeachersPaginationSection.vue'
import TeacherFilter from '~/components/dashboard-admin/teachers/TeacherFilter.vue'

import AlertModal from '~/components/modal/basic-modal/AlertModal.vue'
import type { Teacher } from '~/types/Teacher'
import TeacherInputPopup from '~/components/modal/admin/dashboard/teacher/TeacherInputPopup.vue'

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
const openTeacherInput = ref(false)
const searchQuery = ref('')
const selectedStatus = ref('')
const sortBy = ref('newest')

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
const { data: teacherData, pending, error, refresh } = await useAsyncData('teacherData', () => 
    $fetch(`/admin/users/teachers?${buildApiQuery()}`, {
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers
    }), {
        watch: [currentPage, searchQuery, selectedStatus, sortBy]
    }
)

// ✅ Use API data directly
const teachers = computed(() => teacherData.value?.data || [])
const totalPages = computed(() => teacherData.value?.data?.total_pages || 1)
const totalItems = computed(() => teacherData.value?.data?.total || 0)

const teacherStats = computed(() => {
    // For accurate stats, you might need a separate API endpoint
    const active = teachers.value.filter(t => t.status === 'active').length
    
    return {
        total: totalItems.value, // ✅ Use totalItems from API
        active,
        challengeOrganizers: Math.floor(totalItems.value * 0.8)
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

const handlePageChange = (page: number) => {
    currentPage.value = page
}

const editTeacher = (teacher: Teacher) => {
    console.log('Edit teacher:', teacher)
    // You can implement edit logic here
}

const deleteTeacher = async (teacher: Teacher) => {
    if (confirm('Apakah Anda yakin ingin menghapus guru ini?')) {
        try {
            await $fetch(`/admin/users/teachers/${teacher.id}`, {
                method: 'DELETE',
                baseURL: config.public.apiBase,
                credentials: 'include',
                headers
            })
            showSuccessModal('Guru berhasil dihapus')
            refresh()
        } catch (error) {
            console.error('Error deleting teacher:', error)
            showErrorModal('Gagal menghapus guru')
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

// ✅ Reset page when filters change
watch([searchQuery, selectedStatus, sortBy], () => {
    currentPage.value = 1
})
</script>