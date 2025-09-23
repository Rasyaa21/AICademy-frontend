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

        <TeamStatsSection :team-stats="teamStats" />

        <TeamFilterSection
            v-model:search-query="searchQuery"
            v-model:selected-leader="selectedLeader"
            :filtered-count="filteredTeams.length"
            :total-count="teams.length"
            :active-filters-count="activeFiltersCount"
            :has-active-filters="hasActiveFilters"
            :unique-leaders="uniqueLeaders"
            @clear-filters="clearAllFilters"
        />

        <TeamSortViewSection
            v-model:sort-by="sortBy"
            v-model:view-mode="viewMode"
        />

        <TeamDisplaySection
            v-if="filteredTeams.length > 0"
            :view-mode="viewMode"
            :paginated-teams="paginatedTeams"
            @view-team="handleViewTeam"
            @join-team="handleJoinTeam"
        />

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
import TeamStatsSection from '~/components/dashboard-student/team/TeamStatsSection.vue'
import TeamFilterSection from '~/components/dashboard-student/team/TeamFilterSection.vue'
import TeamSortViewSection from '~/components/dashboard-student/team/TeamSortViewSection.vue'
import TeamDisplaySection from '~/components/dashboard-student/team/TeamDisplaySection.vue'
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