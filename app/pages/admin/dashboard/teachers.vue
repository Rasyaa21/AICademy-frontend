<template>
    <TeacherInputPopup v-model:is-open="openTeacherInput"/>
    <div class="space-y-6">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">Teachers Management</h1>
                <p class="text-gray-600 mt-1">
                    Kelola data guru dan monitor aktivitas mereka
                </p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="bg-white p-6 rounded-xl shadow-sm border">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm">Total Guru</p>
                        <p class="text-2xl font-bold text-gray-900">{{ teacherStats.total }}</p>
                    </div>
                    <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Icon name="heroicons:academic-cap-20-solid" class="w-6 h-6 text-primary" />
                    </div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-sm border">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm">Guru Aktif</p>
                        <p class="text-2xl font-bold text-green-600">{{ teacherStats.active }}</p>
                    </div>
                    <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Icon name="heroicons:check-circle-20-solid" class="w-6 h-6 text-green-600" />
                    </div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-sm border">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm">Challenge Organizer</p>
                        <p class="text-2xl font-bold text-purple-600">{{ teacherStats.challengeOrganizers }}</p>
                    </div>
                    <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Icon name="heroicons:trophy-20-solid" class="w-6 h-6 text-purple-600" />
                    </div>
                </div>
            </div>
        </div>

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

        <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Guru</th>
                            <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Email</th>
                            <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Status</th>
                            <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Bergabung</th>
                            <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="teacher in paginatedTeachers" :key="teacher.id" class="border-b border-gray-100 hover:bg-gray-50">
                            <td class="py-4 px-6">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <span class="text-primary font-semibold text-sm">{{ getInitials(teacher.fullname) }}</span>
                                    </div>
                                    <div>
                                        <div class="font-medium text-gray-900 text-sm">{{ teacher.fullname }}</div>
                                        <div class="text-xs text-gray-500">{{ teacher.role }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="py-4 px-6 text-sm text-gray-600">{{ teacher.email }}</td>
                            <td class="py-4 px-6">
                                <span 
                                    :class="[
                                        'px-2 py-1 rounded-full text-xs font-medium',
                                        teacher.status === 'active' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    ]"
                                >
                                    {{ teacher.status === 'active' ? 'Aktif' : 'Tidak Aktif' }}
                                </span>
                            </td>
                            <td class="py-4 px-6 text-sm text-gray-600">
                                {{ formatDate(teacher.created_at) }}
                            </td>
                            <td class="py-4 px-6">
                                <div class="flex items-center gap-1">
                                    <button 
                                        @click="viewTeacher(teacher)"
                                        class="p-1 hover:bg-gray-200 rounded"
                                        title="Lihat Detail"
                                    >
                                        <Icon name="heroicons:eye-20-solid" class="w-4 h-4 text-gray-600" />
                                    </button>
                                    <button 
                                        @click="editTeacher(teacher)"
                                        class="p-1 hover:bg-gray-200 rounded"
                                        title="Edit"
                                    >
                                        <Icon name="heroicons:pencil-20-solid" class="w-4 h-4 text-gray-600" />
                                    </button>
                                    <button 
                                        @click="deleteTeacher(teacher)"
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
        <div v-if="filteredTeachers.length === 0" class="text-center py-12">
            <div class="text-gray-400 mb-4">
                <Icon name="heroicons:academic-cap-20-solid" class="w-16 h-16 mx-auto" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Tidak ada guru ditemukan</h3>
            <p class="text-gray-500 mb-4">
                {{ searchQuery ? 'Coba ubah kata kunci pencarian atau' : 'Coba ubah' }} filter untuk melihat guru lainnya
            </p>
            <button 
                @click="clearAllFilters"
                class="text-primary hover:text-primary/80 font-medium"
            >
                Reset semua filter
            </button>
        </div>

        <!-- Pagination -->
        <div v-if="filteredTeachers.length > itemsPerPage" class="flex justify-center">
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