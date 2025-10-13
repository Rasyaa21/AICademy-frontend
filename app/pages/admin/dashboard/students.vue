<template>
    <AlertModal 
        v-model:isOpen="alertModal.isOpen"
        :type="alertModal.type"
        :title="alertModal.title"
        :message="alertModal.message"
        @ok="handleAlertOk"
    />
    <UploadCsvPopup v-model:is-open="openCsvPopup"        
        @show-success-modal="showSuccessModal"
        @show-error-modal="showErrorModal"/>
    <StudentInputPopup 
        v-model:is-open="openStudentInput"
        @show-success-modal="showSuccessModal"
        @show-error-modal="showErrorModal"
    />
    <StudentDetailPopup
        v-model:is-open="openStudentDetail"
        :student-id="selectedStudentId"
    />
    
    <div class="space-y-6">
        <div class="flex flex-col gap-4 justify-between lg:flex-row lg:items-center">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">Students Management</h1>
                <p class="mt-1 text-gray-600">
                    Kelola data siswa dan monitor aktivitas mereka
                </p>
            </div>
        </div>

        <StudentsStatsSection :student-stats="studentStats" />

        <!-- Loading State -->
        <div v-if="pending" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p class="text-gray-500 mt-2">Memuat data siswa...</p>
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
            <!-- Filter Component -->
            <StudentFilter
                v-model:searchQuery="searchQuery"
                v-model:selectedClass="selectedClass"
                v-model:selectedStatus="selectedStatus"
                v-model:sortBy="sortBy"
                :filteredCount="totalItems"
                :totalCount="totalItems"
                :hasActiveFilters="hasActiveFilters"
                @clear-filters="clearAllFilters"
                @import-csv="openCsvPopup = true"
                @add-student="openStudentInput = true"
            />

            <!-- Students Table -->
            <StudentsTableSection 
                :paginated-students="students"
                @view-student="viewStudent"
                @edit-student="editStudent"
                @delete-student="deleteStudent"
            />

            <!-- Empty State -->
            <StudentsEmptyState 
                v-if="students.length === 0"
                :search-query="searchQuery"
                @clear-filters="clearAllFilters"
            />

            <!-- Pagination -->
            <StudentsPaginationSection
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
import StudentFilter from '~/components/dashboard-admin/students/StudentFilter.vue'

import UploadCsvPopup from '~/components/modal/UploadCsvPopup.vue'
import AlertModal from '~/components/modal/basic-modal/AlertModal.vue'
import StudentsStatsSection from '~/components/dashboard-admin/students/StudentsStatsSection.vue'
import StudentsTableSection from '~/components/dashboard-admin/students/StudentsTableSection.vue'
import StudentsEmptyState from '~/components/dashboard-admin/students/StudentsEmptyState.vue'
import StudentsPaginationSection from '~/components/dashboard-admin/students/StudentsPaginationSection.vue'
import StudentDetailPopup from '~/components/modal/admin/dashboard/student/StudentDetailPopup.vue'
import type { Student } from '~/types/Student'
import StudentInputPopup from '~/components/modal/admin/dashboard/student/StudentInputPopup.vue'

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

const openCsvPopup = ref(false)
const openStudentInput = ref(false)
const openStudentDetail = ref(false)
const searchQuery = ref('')
const selectedClass = ref('')
const selectedStatus = ref('')
const sortBy = ref('newest')
const selectedStudentId = ref()

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

const headers = useRequestHeaders(['cookie'])

// ✅ FIXED: Build API query with all parameters
const buildApiQuery = () => {
    const params = new URLSearchParams({
        page: currentPage.value.toString(),
        limit: itemsPerPage.toString()
    })
    
    if (searchQuery.value.trim()) {
        params.append('search', searchQuery.value.trim())
    }
    
    if (selectedClass.value) {
        params.append('class', selectedClass.value)
    }
    
    if (selectedStatus.value) {
        params.append('status', selectedStatus.value)
    }
    
    if (sortBy.value) {
        params.append('sort', sortBy.value)
    }
    
    return params.toString()
}

// ✅ FIXED: Watch all filter parameters
const { data: studentData, pending, error, refresh } = await useAsyncData('studentData', () => 
    $fetch(`/admin/users/students?${buildApiQuery()}`, {
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers
    }), {
        watch: [currentPage, searchQuery, selectedClass, selectedStatus, sortBy]
    }
)

// ✅ FIXED: Use API data directly (no client-side filtering)
const students = computed(() => studentData.value?.data || [])
const totalPages = computed(() => studentData.value?.data?.total_pages || 1)
const totalItems = computed(() => studentData.value?.data?.total || 0)

// ✅ FIXED: Remove client-side filtering and pagination
// const filteredStudents = computed(() => { ... }) // ← HAPUS
// const paginatedStudents = computed(() => { ... }) // ← HAPUS

const studentStats = computed(() => {
    // For accurate stats, you might need a separate API endpoint
    const newThisMonth = students.value.filter(s => {
        const createdDate = new Date(s.created_at)
        const now = new Date()
        return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear()
    }).length
    
    return {
        total: totalItems.value, // ✅ FIXED: Use totalItems from API
        newThisMonth,
        challengeParticipants: Math.floor(totalItems.value * 0.7)
    }
})

const hasActiveFilters = computed(() => {
    return !!(searchQuery.value || selectedClass.value || selectedStatus.value)
})

// Methods
const clearAllFilters = () => {
    searchQuery.value = ''
    selectedClass.value = ''
    selectedStatus.value = ''
    currentPage.value = 1
}

// ✅ FIXED: Proper page change handler
const handlePageChange = (page: number) => {
    currentPage.value = page
}

const viewStudent = (student: Student) => {
    selectedStudentId.value = student.id
    openStudentDetail.value = true
}

const editStudent = (student: Student) => {
    console.log('Edit student:', student)
    // You can implement edit logic here
}

const deleteStudent = async (student: Student) => {
    if (confirm('Apakah Anda yakin ingin menghapus siswa ini?')) {
        try {
            await $fetch(`/admin/users/students/${student.id}`, {
                method: 'DELETE',
                baseURL: config.public.apiBase,
                credentials: 'include',
                headers
            })
            showSuccessModal('Siswa berhasil dihapus')
        refresh()
        } catch (error) {
            console.error('Error deleting student:', error)
            showErrorModal('Gagal menghapus siswa')
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

// ✅ FIXED: Reset page when filters change
watch([searchQuery, selectedClass, selectedStatus, sortBy], () => {
    currentPage.value = 1
})
</script>