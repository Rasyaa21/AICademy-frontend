<template>
    <div class="space-y-6">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">Looking for Team</h1>
                <p class="text-gray-600 mt-1">
                    Temukan dan bergabung dengan tim yang sesuai dengan minat Anda
                </p>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="bg-white p-6 rounded-xl shadow-sm border">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm">Total Team</p>
                        <p class="text-2xl font-bold text-gray-900">{{ teamStats.total }}</p>
                    </div>
                    <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Icon name="heroicons:users-20-solid" class="w-6 h-6 text-primary" />
                    </div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-sm border">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm">Team Aktif</p>
                        <p class="text-2xl font-bold text-green-600">{{ teamStats.active }}</p>
                    </div>
                    <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Icon name="heroicons:bolt-20-solid" class="w-6 h-6 text-green-600" />
                    </div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-sm border">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm">Butuh Member</p>
                        <p class="text-2xl font-bold text-blue-600">{{ teamStats.recruiting }}</p>
                    </div>
                    <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Icon name="heroicons:user-plus-20-solid" class="w-6 h-6 text-blue-600" />
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div>
                    <h3 class="text-lg font-semibold text-gray-900">Filter & Pencarian</h3>
                    <p class="text-sm text-gray-500 mt-1">
                        {{ filteredTeams.length }} dari {{ teams.length }} team ditemukan
                    </p>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-500">
                    <Icon name="heroicons:funnel-20-solid" class="w-4 h-4" />
                    <span>Filter aktif: {{ activeFiltersCount }}</span>
                </div>
            </div>

            <div class="flex flex-col lg:flex-row gap-4">
                <!-- Search -->
                <div class="relative flex-1">
                    <Icon
                        name="heroicons:magnifying-glass-20-solid"
                        class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    />
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Cari team berdasarkan nama atau deskripsi..."
                        class="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm 
                               focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                               transition-all duration-200"
                    />
                </div>

                <!-- Team Leader Filter -->
                <div class="relative">
                    <select 
                        v-model="selectedLeader" 
                        class="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm font-medium text-gray-700 
                               hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                               transition-all duration-200 cursor-pointer shadow-sm"
                    >
                        <option value="" class="text-gray-600">Semua Leader</option>
                        <option v-for="leader in uniqueLeaders" :key="leader" :value="leader">
                            {{ leader }}
                        </option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Icon name="heroicons:chevron-down-20-solid" class="w-4 h-4 text-gray-400" />
                    </div>
                </div>

                <!-- Clear Filters -->
                <button 
                    v-if="hasActiveFilters"
                    @click="clearAllFilters"
                    class="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 
                           rounded-xl transition-colors duration-200 flex items-center gap-2 border border-gray-200"
                >
                    <Icon name="heroicons:x-mark-20-solid" class="w-4 h-4" />
                    Clear All
                </button>
            </div>
        </div>

        <!-- Sort Options -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex items-center gap-2 text-sm text-gray-600">
                <Icon name="heroicons:bars-arrow-down-20-solid" class="w-4 h-4" />
                <span>Urutkan berdasarkan:</span>
                <select 
                    v-model="sortBy"
                    class="bg-transparent border-none text-primary font-medium cursor-pointer focus:outline-none"
                >
                    <option value="newest">Terbaru</option>
                    <option value="oldest">Terlama</option>
                    <option value="name">Nama Team</option>
                    <option value="members">Jumlah Member</option>
                </select>
            </div>

            <div class="flex items-center gap-2">
                <span class="text-sm text-gray-500">Tampilan:</span>
                <button 
                    @click="viewMode = 'grid'"
                    :class="[
                        'p-2 rounded-lg transition-colors',
                        viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    ]"
                >
                    <Icon name="heroicons:squares-2x2-20-solid" class="w-4 h-4" />
                </button>
                <button 
                    @click="viewMode = 'list'"
                    :class="[
                        'p-2 rounded-lg transition-colors',
                        viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    ]"
                >
                    <Icon name="heroicons:list-bullet-20-solid" class="w-4 h-4" />
                </button>
            </div>
        </div>

        <!-- Team Grid/List -->
        <div v-if="filteredTeams.length > 0">
            <div 
                v-if="viewMode === 'grid'"
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            >
                <TeamCard 
                    v-for="team in paginatedTeams" 
                    :key="team.id"
                    :team="team"
                    @view-team="handleViewTeam"
                    @join-team="handleJoinTeam"
                />
            </div>

            <div 
                v-else
                class="space-y-4"
            >
                <TeamListItem 
                    v-for="team in paginatedTeams" 
                    :key="team.id"
                    :team="team"
                    @view-team="handleViewTeam"
                    @join-team="handleJoinTeam"
                />
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
            <div class="text-gray-400 mb-4">
                <Icon name="heroicons:users-20-solid" class="w-16 h-16 mx-auto" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Tidak ada team ditemukan</h3>
            <p class="text-gray-500 mb-4">
                {{ searchQuery ? 'Coba ubah kata kunci pencarian atau' : 'Coba ubah' }} filter untuk melihat team lainnya
            </p>
            <button 
                @click="clearAllFilters"
                class="text-primary hover:text-primary/80 font-medium"
            >
                Reset semua filter
            </button>
        </div>

        <!-- Pagination -->
        <div v-if="filteredTeams.length > itemsPerPage" class="flex justify-center">
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
import TeamCard from '~/components/card/TeamCard.vue'
import TeamListItem from '~/components/dashboard-student/team/TeamListItem.vue'
import type { Team } from '~/types/Team'

definePageMeta({
    layout: 'dashboard-layout-student-dashboard-layout'
})

// Filter states
const searchQuery = ref('')
const selectedLeader = ref('')
const sortBy = ref('newest')
const viewMode = ref<'grid' | 'list'>('grid')

// Pagination
const currentPage = ref(1)
const itemsPerPage = 12

// Team data - Sample data
const teams = ref<Team[]>([
    {
        id: '550e8400-e29b-41d4-a716-446655440001',
        team_name: 'Frontend Fighters',
        about: 'Tim yang fokus pada pengembangan frontend modern dengan React, Vue, dan teknologi terkini. Kami selalu siap menghadapi challenge frontend yang kompleks.',
        team_profile_picture: '/assets/images/smk-telkom.jpeg',
        created_by_student_name: 'Ahmad Rizki Pratama',
        created_at: '2024-01-15T08:30:00Z',
        member_count: 4
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440002',
        team_name: 'Backend Builders',
        about: 'Spesialis dalam membangun API, database design, dan arsitektur backend yang scalable.',
        team_profile_picture: null,
        created_by_student_name: 'Siti Nurhasanah',
        created_at: '2024-01-20T10:15:00Z',
        member_count: 3
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440003',
        team_name: 'Full Stack Heroes',
        about: 'Tim yang menguasai full stack development dari frontend hingga backend, siap mengerjakan project end-to-end.',
        team_profile_picture: '/assets/images/smk-telkom.jpeg',
        created_by_student_name: 'Budi Santoso',
        created_at: '2024-02-01T14:20:00Z',
        member_count: 5
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440004',
        team_name: 'UI/UX Innovators',
        about: null,
        team_profile_picture: null,
        created_by_student_name: 'Dewi Lestari',
        created_at: '2024-02-10T09:45:00Z',
        member_count: 2
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440005',
        team_name: 'Data Science Squad',
        about: 'Tim yang berfokus pada data analysis, machine learning, dan AI development.',
        team_profile_picture: '/assets/images/smk-telkom.jpeg',
        created_by_student_name: 'Agus Dwi Cahaya',
        created_at: '2024-02-15T16:30:00Z',
        member_count: 3
    }
])

// Computed properties
const uniqueLeaders = computed(() => {
    return [...new Set(teams.value.map(team => team.created_by_student_name))].sort()
})

const filteredTeams = computed(() => {
    let filtered = teams.value

    // Search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(team => 
            team.team_name.toLowerCase().includes(query) ||
            (team.about && team.about.toLowerCase().includes(query)) ||
            team.created_by_student_name.toLowerCase().includes(query)
        )
    }

    // Leader filter
    if (selectedLeader.value) {
        filtered = filtered.filter(team => team.created_by_student_name === selectedLeader.value)
    }

    // Sort
    filtered.sort((a, b) => {
        switch (sortBy.value) {
            case 'newest':
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            case 'oldest':
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            case 'name':
                return a.team_name.localeCompare(b.team_name)
            case 'members':
                return (b.member_count || 0) - (a.member_count || 0)
            default:
                return 0
        }
    })

    return filtered
})

const paginatedTeams = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredTeams.value.slice(start, end)
})

const totalPages = computed(() => {
    return Math.ceil(filteredTeams.value.length / itemsPerPage)
})

const teamStats = computed(() => {
    const active = teams.value.filter(team => (team.member_count || 1) > 1).length
    const recruiting = teams.value.filter(team => (team.member_count || 1) < 5).length
    
    return {
        total: teams.value.length,
        active,
        recruiting
    }
})

const hasActiveFilters = computed(() => {
    return !!(searchQuery.value || selectedLeader.value)
})

const activeFiltersCount = computed(() => {
    let count = 0
    if (searchQuery.value) count++
    if (selectedLeader.value) count++
    return count
})

// Methods
const clearAllFilters = () => {
    searchQuery.value = ''
    selectedLeader.value = ''
    currentPage.value = 1
}

const handleViewTeam = (team: Team) => {
    console.log('View team:', team)
    // Navigate to team detail page
    // navigateTo(`/student/dashboard/team/${team.id}`)
}

const handleJoinTeam = (team: Team) => {
    console.log('Join team:', team)
    // Show join team modal or handle join logic
}

// Watch for filter changes to reset pagination
watch([searchQuery, selectedLeader], () => {
    currentPage.value = 1
})
</script>