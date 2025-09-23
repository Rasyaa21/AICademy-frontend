<template>
    <TeacherInputPopup v-model:is-open="openTeacherInput"/>
    <div class="space-y-6">
        <AdminPageHeader
            title="Teachers Management"
            description="Kelola data guru dan monitor aktivitas mereka"
        />

        <TeachersStatsSection :teacher-stats="teacherStats" />

        <TeacherFilter
            v-model:searchQuery="searchQuery"
            v-model:selectedStatus="selectedStatus"
            v-model:sortBy="sortBy"
            :filteredCount="filteredTeachers.length"
            :totalCount="teachers.length"
            :activeFiltersCount="activeFiltersCount"
            :hasActiveFilters="hasActiveFilters"
            @clear-filters="clearAllFilters"
            @add-teacher="openTeacherInput = true"
        />

        <TeachersTableSection
            :paginated-teachers="paginatedTeachers"
            @view-teacher="viewTeacher"
            @edit-teacher="editTeacher"
            @delete-teacher="deleteTeacher"
        />

        <TeachersEmptyState
            v-if="filteredTeachers.length === 0"
            :search-query="searchQuery"
            @clear-filters="clearAllFilters"
        />

        <TeachersPaginationSection
            :current-page="currentPage"
            :total-pages="totalPages"
            :total-items="filteredTeachers.length"
            :items-per-page="itemsPerPage"
            @page-changed="(page: number) => currentPage = page"
        />
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
import TeacherInputPopup from '~/components/modal/TeacherInputPopup.vue'
import type { Teacher } from '~/types/Teacher'

definePageMeta({
    layout: 'admin-dashboard-layout'
})

// Types


// Filter states
const openTeacherInput = ref(false)
const searchQuery = ref('')
const selectedStatus = ref('')
const sortBy = ref('newest')

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

// Sample data
const teachers = ref<Teacher[]>([
    {
        id: '1',
        user_id: 'user1',
        fullname: 'Dr. Agus Dwi Cahaya S.Kom',
        email: 'agus.dwi@teacher.smk.sch.id',
        role: 'Guru Pengampu',
        status: 'active',
        created_at: '2024-01-10T08:00:00Z'
    },
    {
        id: '2',
        user_id: 'user2',
        fullname: 'Siti Nurhasanah S.Pd',
        email: 'siti.nur@teacher.smk.sch.id',
        role: 'Guru Pengampu',
        status: 'active',
        created_at: '2024-01-12T08:00:00Z'
    },
    {
        id: '3',
        user_id: 'user3',
        fullname: 'Ahmad Rizki M.Kom',
        email: 'ahmad.rizki@teacher.smk.sch.id',
        role: 'Guru Pengampu',
        status: 'inactive',
        created_at: '2024-01-15T08:00:00Z'
    }
])

// Computed properties
const filteredTeachers = computed(() => {
    let filtered = teachers.value

    // Search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(teacher => 
            teacher.fullname.toLowerCase().includes(query) ||
            teacher.email.toLowerCase().includes(query)
        )
    }

    // Status filter
    if (selectedStatus.value) {
        filtered = filtered.filter(t => t.status === selectedStatus.value)
    }

    // Sort
    filtered.sort((a, b) => {
        switch (sortBy.value) {
            case 'newest':
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            case 'name':
                return a.fullname.localeCompare(b.fullname)
            case 'email':
                return a.email.localeCompare(b.email)
            default:
                return 0
        }
    })

    return filtered
})

const paginatedTeachers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredTeachers.value.slice(start, end)
})

const totalPages = computed(() => {
    return Math.ceil(filteredTeachers.value.length / itemsPerPage)
})

const teacherStats = computed(() => {
    const active = teachers.value.filter(t => t.status === 'active').length
    
    return {
        total: teachers.value.length,
        active,
        challengeOrganizers: Math.floor(teachers.value.length * 0.8)
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

// Utility functions moved to TeachersTableSection component

const viewTeacher = (teacher: Teacher) => {
    console.log('View teacher:', teacher)
}

const editTeacher = (teacher: Teacher) => {
    console.log('Edit teacher:', teacher)
}

const deleteTeacher = (teacher: Teacher) => {
    console.log('Delete teacher:', teacher)
}

watch([searchQuery, selectedStatus], () => {
    currentPage.value = 1
})
</script>