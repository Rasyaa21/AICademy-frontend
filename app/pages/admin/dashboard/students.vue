<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">Students Management</h1>
                <p class="text-gray-600 mt-1">
                    Kelola data siswa dan monitor aktivitas mereka
                </p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <div class="bg-white p-6 rounded-xl shadow-lg border">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm">Total Siswa</p>
                        <p class="text-2xl font-bold text-gray-900">{{ studentStats.total }}</p>
                    </div>
                    <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Icon name="heroicons:users-20-solid" class="w-6 h-6 text-primary" />
                    </div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-lg border">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm">Partisipasi Challenge</p>
                        <p class="text-2xl font-bold text-purple-600">{{ studentStats.challengeParticipants }}</p>
                    </div>
                    <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Icon name="heroicons:trophy-20-solid" class="w-6 h-6 text-purple-600" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Filter Component -->
        <StudentFilter
            v-model:searchQuery="searchQuery"
            v-model:selectedClass="selectedClass"
            v-model:selectedStatus="selectedStatus"
            v-model:sortBy="sortBy"
            :filteredCount="filteredStudents.length"
            :totalCount="students.length"
            :activeFiltersCount="activeFiltersCount"
            :hasActiveFilters="hasActiveFilters"
            @clear-filters="clearAllFilters"
            @import-csv="handleImportCSV"
            @add-student="handleAddStudent"
        />

        <!-- Students Table -->
        <div class="bg-white rounded-xl shadow-lg border overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Siswa</th>
                            <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">NIS</th>
                            <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Kelas</th>
                            <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Email</th>
                            <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Status</th>
                            <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Bergabung</th>
                            <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="student in paginatedStudents" :key="student.id" class="border-b border-gray-100 hover:bg-gray-50">
                            <td class="py-4 px-6">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <span class="text-primary font-semibold text-sm">{{ getInitials(student.name) }}</span>
                                    </div>
                                    <div>
                                        <div class="font-medium text-gray-900 text-sm">{{ student.name }}</div>
                                        <div class="text-xs text-gray-500">{{ student.username }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="py-4 px-6 text-sm text-gray-600">{{ student.nis }}</td>
                            <td class="py-4 px-6 text-sm text-gray-600">{{ student.class }}</td>
                            <td class="py-4 px-6 text-sm text-gray-600">{{ student.email }}</td>
                            <td class="py-4 px-6">
                                <span 
                                    :class="[
                                        'px-2 py-1 rounded-full text-xs font-medium',
                                        student.status === 'active' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    ]"
                                >
                                    {{ student.status === 'active' ? 'Aktif' : 'Tidak Aktif' }}
                                </span>
                            </td>
                            <td class="py-4 px-6 text-sm text-gray-600">
                                {{ formatDate(student.created_at) }}
                            </td>
                            <td class="py-4 px-6">
                                <div class="flex items-center gap-1">
                                    <button 
                                        @click="viewStudent(student)"
                                        class="p-1 hover:bg-gray-200 rounded"
                                        title="Lihat Detail"
                                    >
                                        <Icon name="heroicons:eye-20-solid" class="w-4 h-4 text-gray-600" />
                                    </button>
                                    <button 
                                        @click="editStudent(student)"
                                        class="p-1 hover:bg-gray-200 rounded"
                                        title="Edit"
                                    >
                                        <Icon name="heroicons:pencil-20-solid" class="w-4 h-4 text-gray-600" />
                                    </button>
                                    <button 
                                        @click="deleteStudent(student)"
                                        class="p-1 hover:bg-gray-200 rounded"
                                        title="Hapus"
                                    >
                                        <Icon name="heroicons:trash-20-solid" class="w-4 h-4 text-red-600" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredStudents.length === 0" class="text-center py-12">
            <div class="text-gray-400 mb-4">
                <Icon name="heroicons:users-20-solid" class="w-16 h-16 mx-auto" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Tidak ada siswa ditemukan</h3>
            <p class="text-gray-500 mb-4">
                {{ searchQuery ? 'Coba ubah kata kunci pencarian atau' : 'Coba ubah' }} filter untuk melihat siswa lainnya
            </p>
            <button 
                @click="clearAllFilters"
                class="text-primary hover:text-primary/80 font-medium"
            >
                Reset semua filter
            </button>
        </div>

        <!-- Pagination -->
        <div v-if="filteredStudents.length > itemsPerPage" class="flex justify-center">
            <nav class="flex items-center gap-2">
                <button 
                    @click="currentPage--"
                    :disabled="currentPage === 1"
                    class="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium
                           disabled:opacity-50 disabled:cursor-not-allowed
                           hover:bg-gray-50 transition-colors"
                >
                    Previous
                </button>
                
                <span class="px-4 py-2 text-sm text-gray-600">
                    Page {{ currentPage }} of {{ totalPages }}
                </span>
                
                <button 
                    @click="currentPage++"
                    :disabled="currentPage === totalPages"
                    class="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium
                        disabled:opacity-50 disabled:cursor-not-allowed
                        hover:bg-gray-50 transition-colors"
                >
                    Next
                </button>
            </nav>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import StudentFilter from '~/components/dashboard-admin/StudentFilter.vue'

definePageMeta({
    layout: 'admin-dashboard-layout'
})

// Types
interface Student {
    id: string
    nis: string
    name: string
    username: string
    email: string
    class: string
    status: 'active' | 'inactive'
    created_at: string
}

// Filter states
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
        status: 'active',
        created_at: '2024-01-15T08:00:00Z'
    },
    {
        id: '2',
        nis: '2024002',
        name: 'Siti Nurhaliza',
        username: 'sitinur',
        email: 'siti.nur@student.smk.sch.id',
        class: 'XII RPL 1',
        status: 'active',
        created_at: '2024-01-16T08:00:00Z'
    },
    {
        id: '3',
        nis: '2024003',
        name: 'Budi Santoso',
        username: 'budisantoso',
        email: 'budi.santoso@student.smk.sch.id',
        class: 'XI RPL 2',
        status: 'inactive',
        created_at: '2024-02-01T08:00:00Z'
    },
    {
        id: '4',
        nis: '2024004',
        name: 'Dewi Sartika',
        username: 'dewisartika',
        email: 'dewi.sartika@student.smk.sch.id',
        class: 'XII RPL 2',
        status: 'active',
        created_at: '2024-02-15T08:00:00Z'
    }
])

// Computed properties
const filteredStudents = computed(() => {
    let filtered = students.value

    // Search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(student => 
            student.name.toLowerCase().includes(query) ||
            student.nis.toLowerCase().includes(query) ||
            student.email.toLowerCase().includes(query) ||
            student.username.toLowerCase().includes(query)
        )
    }

    // Class filter
    if (selectedClass.value) {
        filtered = filtered.filter(s => s.class === selectedClass.value)
    }

    // Status filter
    if (selectedStatus.value) {
        filtered = filtered.filter(s => s.status === selectedStatus.value)
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
    const active = students.value.filter(s => s.status === 'active').length
    const newThisMonth = students.value.filter(s => {
        const createdDate = new Date(s.created_at)
        const now = new Date()
        return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear()
    }).length
    
    return {
        total: students.value.length,
        active,
        newThisMonth,
        challengeParticipants: Math.floor(students.value.length * 0.7)
    }
})

const hasActiveFilters = computed(() => {
    return !!(searchQuery.value || selectedClass.value || selectedStatus.value)
})

const activeFiltersCount = computed(() => {
    let count = 0
    if (searchQuery.value) count++
    if (selectedClass.value) count++
    if (selectedStatus.value) count++
    return count
})

// Methods
const clearAllFilters = () => {
    searchQuery.value = ''
    selectedClass.value = ''
    selectedStatus.value = ''
    currentPage.value = 1
}

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

// Action handlers
const handleImportCSV = () => {
    console.log('Import CSV clicked')
    // Implement CSV import logic
}

const handleAddStudent = () => {
    console.log('Add student clicked')
    // Implement add student logic
}

const viewStudent = (student: Student) => {
    console.log('View student:', student)
    // Implement view student logic
}

const editStudent = (student: Student) => {
    console.log('Edit student:', student)
    // Implement edit student logic
}

const deleteStudent = (student: Student) => {
    console.log('Delete student:', student)
    // Implement delete student logic
}

// Watch for filter changes to reset pagination
watch([searchQuery, selectedClass, selectedStatus], () => {
    currentPage.value = 1
})
</script>