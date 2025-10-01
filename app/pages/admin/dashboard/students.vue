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

        <!-- Filter Component -->
        <StudentFilter
            v-model:searchQuery="searchQuery"
            v-model:selectedClass="selectedClass"
            v-model:selectedStatus="selectedStatus"
            v-model:sortBy="sortBy"
            :filteredCount="filteredStudents.length"
            :totalCount="students.length"
            :hasActiveFilters="hasActiveFilters"
            @clear-filters="clearAllFilters"
            @import-csv="openCsvPopup = true"
            @add-student="openStudentInput = true"
        />

        <!-- Students Table -->
        <StudentsTableSection 
            :paginated-students="paginatedStudents"
            @view-student="viewStudent"
            @edit-student="editStudent"
            @delete-student="deleteStudent"
        />

        <!-- Empty State -->
        <StudentsEmptyState 
            v-if="filteredStudents.length === 0"
            :search-query="searchQuery"
            @clear-filters="clearAllFilters"
        />

        <!-- Pagination -->
        <StudentsPaginationSection
            :current-page="currentPage"
            :total-pages="totalPages"
            :total-items="filteredStudents.length"
            :items-per-page="itemsPerPage"
            @page-changed="(page: number) => currentPage = page"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import StudentFilter from '~/components/dashboard-admin/students/StudentFilter.vue'
import StudentInputPopup from '~/components/modal/StudentInputPopup.vue'
import UploadCsvPopup from '~/components/modal/UploadCsvPopup.vue'
import AlertModal from '~/components/modal/basic-modal/AlertModal.vue'
import StudentsStatsSection from '~/components/dashboard-admin/students/StudentsStatsSection.vue'
import StudentsTableSection from '~/components/dashboard-admin/students/StudentsTableSection.vue'
import StudentsEmptyState from '~/components/dashboard-admin/students/StudentsEmptyState.vue'
import StudentsPaginationSection from '~/components/dashboard-admin/students/StudentsPaginationSection.vue'
import type { Student } from '~/types/Student'

definePageMeta({
    layout: 'admin-dashboard-layout'
})

const alertModal = ref({
    isOpen: false,
    type: 'success' as 'success' | 'error' | 'warning' | 'info',
    title: '',
    message: ''
})

const openCsvPopup = ref(false)
const openStudentInput = ref(false)
const searchQuery = ref('')
const selectedClass = ref('')
const selectedStatus = ref('')
const sortBy = ref('newest')

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

// Sample data
const students = ref<Student[]>([
    {
        id: '1',
        nis: '2024001',
        name: 'Ahmad Rizki Pratama',
        username: 'ahmadrizki',
        email: 'ahmad.rizki@student.smk.sch.id',
        class: 'XII RPL 1',
        created_at: '2024-01-15T08:00:00Z'
    },
    {
        id: '2',
        nis: '2024002',
        name: 'Siti Nurhaliza',
        username: 'sitinur',
        email: 'siti.nur@student.smk.sch.id',
        class: 'XII RPL 1',
        created_at: '2024-01-16T08:00:00Z'
    },
    {
        id: '3',
        nis: '2024003',
        name: 'Budi Santoso',
        username: 'budisantoso',
        email: 'budi.santoso@student.smk.sch.id',
        class: 'XI RPL 2',
        created_at: '2024-02-01T08:00:00Z'
    },
    {
        id: '4',
        nis: '2024004',
        name: 'Dewi Sartika',
        username: 'dewisartika',
        email: 'dewi.sartika@student.smk.sch.id',
        class: 'XII RPL 2',
        created_at: '2024-02-15T08:00:00Z'
    }
])

const filteredStudents = computed(() => {
    let filtered = students.value

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(student => 
            student.name.toLowerCase().includes(query) ||
            student.nis.toLowerCase().includes(query) ||
            student.email.toLowerCase().includes(query) ||
            student.username.toLowerCase().includes(query)
        )
    }

    if (selectedClass.value) {
        filtered = filtered.filter(s => s.class === selectedClass.value)
    }


    // Sort
    filtered.sort((a, b) => {
        switch (sortBy.value) {
            case 'newest':
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            case 'name':
                return a.name.localeCompare(b.name)
            case 'nis':
                return a.nis.localeCompare(b.nis)
            case 'class':
                return a.class.localeCompare(b.class)
            default:
                return 0
        }
    })

    return filtered
})

const paginatedStudents = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredStudents.value.slice(start, end)
})

const totalPages = computed(() => {
    return Math.ceil(filteredStudents.value.length / itemsPerPage)
})

const studentStats = computed(() => {
    const newThisMonth = students.value.filter(s => {
        const createdDate = new Date(s.created_at)
        const now = new Date()
        return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear()
    }).length
    
    return {
        total: students.value.length,
        newThisMonth,
        challengeParticipants: Math.floor(students.value.length * 0.7)
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

const viewStudent = (student: Student) => {
    console.log('View student:', student)
}

const editStudent = (student: Student) => {
    console.log('Edit student:', student)
}

const deleteStudent = (student: Student) => {
    console.log('Delete student:', student)
    // Implement delete student logic
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
    // Optionally refresh data after successful operation
    if (alertModal.value.type === 'success') {
        // You could refresh the student list here
        // await refreshStudentList()
    }
}

// Watch for filter changes to reset pagination
watch([searchQuery, selectedClass, selectedStatus], () => {
    currentPage.value = 1
})


</script>