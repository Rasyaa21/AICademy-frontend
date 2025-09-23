<!-- pages/student/dashboard/challange.vue -->
<template>
    <div class="space-y-6">
        <div class="flex flex-col gap-4 justify-between lg:flex-row lg:items-center">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">Challenge</h1>
                <p class="mt-1 text-gray-600">
                    Ikuti berbagai challenge untuk meningkatkan skill programming Anda
                </p>
            </div>
        </div>

        <!-- Stats Cards -->
        <ChallangeStatsSection :challenge-stats="challengeStats" />

        <!-- Filter Section -->
        <ChallangeFilterSection
            v-model:search-query="searchQuery"
            v-model:selected-status="selectedStatus"
            :filtered-count="filteredChallenges.length"
            :total-count="challenges.length"
            :active-filters-count="activeFiltersCount"
            :has-active-filters="hasActiveFilters"
            @clear-filters="clearAllFilters"
        />

        <!-- Sort and View Options -->
        <ChallangeSortViewSection
            v-model:sort-by="sortBy"
            v-model:view-mode="viewMode"
        />

        <!-- Challenge Display -->
        <ChallangeDisplaySection
            v-if="filteredChallenges.length > 0"
            :view-mode="viewMode"
            :paginated-challenges="paginatedChallenges"
        />

        <!-- Empty State -->
        <div v-else class="py-12 text-center">
            <div class="mb-4 text-gray-400">
                <Icon name="heroicons:magnifying-glass-20-solid" class="mx-auto w-16 h-16" />
            </div>
            <h3 class="mb-2 text-lg font-semibold text-gray-900">Tidak ada challenge ditemukan</h3>
            <p class="mb-4 text-gray-500">
                {{ searchQuery ? 'Coba ubah kata kunci pencarian atau' : 'Coba ubah' }} filter untuk melihat challenge lainnya
            </p>
            <button 
                @click="clearAllFilters"
                class="font-medium text-primary hover:text-primary/80"
            >
                Reset semua filter
            </button>
        </div>

        <!-- Pagination -->
        <div v-if="filteredChallenges.length > itemsPerPage" class="flex justify-center">
            <nav class="flex gap-2 items-center">
                <button 
                    @click="currentPage--"
                    :disabled="currentPage === 1"
                    class="px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                    Previous
                </button>
                
                <span class="px-4 py-2 text-sm text-gray-600">
                    Page {{ currentPage }} of {{ totalPages }}
                </span>
                
                <button 
                    @click="currentPage++"
                    :disabled="currentPage === totalPages"
                    class="px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                    Next
                </button>
            </nav>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ChallangeStatsSection from '~/components/dashboard-student/challange/ChallangeStatsSection.vue'
import ChallangeFilterSection from '~/components/dashboard-student/challange/ChallangeFilterSection.vue'
import ChallangeSortViewSection from '~/components/dashboard-student/challange/ChallangeSortViewSection.vue'
import ChallangeDisplaySection from '~/components/dashboard-student/challange/ChallangeDisplaySection.vue'
import type { Challenge } from '~/types/Challange'

definePageMeta({
    layout: 'dashboard-layout-student-dashboard-layout'
})

// Filter states
const searchQuery = ref('')
const selectedOrganizer = ref('')
const selectedPrizeFilter = ref('')
const selectedStatus = ref('')
const sortBy = ref('newest')
const viewMode = ref<'grid' | 'list'>('grid')

// Pagination
const currentPage = ref(1)
const itemsPerPage = 12

// Challenge data - Backend structure
const challenges = ref<Challenge[]>([
    {
        id: '550e8400-e29b-41d4-a716-446655440001',
        thumbnail_image: '/assets/images/smk-telkom.jpeg',
        title: 'API Perpustakaan',
        description: 'Buatlah REST API untuk sistem perpustakaan dengan skema database yang telah ditentukan',
        organizer: 'Agus Dwi Cahaya S.Kom',
        deadline: '2025-08-20T23:59:59Z',
        prize: 'Rp 2.000.000 + Certificate',
        participant: 47,
        winner_team_id: null
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440002',
        thumbnail_image: '/assets/images/smk-telkom.jpeg',
        title: 'React JS Portfolio',
        description: 'Buat portfolio website menggunakan React JS dengan design yang responsive dan modern',
        organizer: 'Siti Nurhasanah S.Pd',
        deadline: '2025-08-25T23:59:59Z',
        prize: null,
        participant: 32,
        winner_team_id: null
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440003',
        thumbnail_image: '/assets/images/smk-telkom.jpeg',

        title: 'UI Design Challenge',
        description: 'Desain interface aplikasi mobile untuk e-commerce dengan fokus pada user experience',
        organizer: 'Ahmad Rizki M.Kom',
        deadline: '2025-08-30T23:59:59Z',
        prize: 'Sertifikat + Portfolio Review',
        participant: 28,
        winner_team_id: null
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440004',
        thumbnail_image: '/assets/images/smk-telkom.jpeg',

        title: 'CTF Web Security',
        description: 'Selesaikan tantangan keamanan web dengan berbagai teknik penetration testing',
        organizer: 'Agus Dwi Cahaya S.Kom',
        deadline: '2025-09-15T23:59:59Z',
        prize: null,
        participant: 15,
        winner_team_id: null
    }
])

// Computed properties
const activeChallenges = computed(() => {
    return challenges.value.filter(challenge => {
        const deadline = new Date(challenge.deadline)
        return deadline > new Date()
    })
})

const filteredChallenges = computed(() => {
    let filtered = challenges.value

    // Search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(challenge => 
            challenge.title.toLowerCase().includes(query) ||
            challenge.description.toLowerCase().includes(query) ||
            challenge.organizer.toLowerCase().includes(query)
        )
    }

    // Organizer filter
    if (selectedOrganizer.value) {
        filtered = filtered.filter(c => c.organizer === selectedOrganizer.value)
    }

    // Prize filter
    if (selectedPrizeFilter.value) {
        if (selectedPrizeFilter.value === 'with-prize') {
            filtered = filtered.filter(c => c.prize !== null && c.prize !== '')
        } else if (selectedPrizeFilter.value === 'no-prize') {
            filtered = filtered.filter(c => c.prize === null || c.prize === '')
        }
    }

    // Status filter
    if (selectedStatus.value) {
        const now = new Date()
        filtered = filtered.filter(challenge => {
            const deadline = new Date(challenge.deadline)
            switch (selectedStatus.value) {
                case 'active':
                    return deadline > now
                case 'completed':
                    return deadline <= now
                default:
                    return true
            }
        })
    }

    // Sort
    filtered.sort((a, b) => {
        switch (sortBy.value) {
            case 'newest':
                return new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
            case 'deadline':
                return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
            case 'participants':
                return b.participant - a.participant
            default:
                return 0
        }
    })

    return filtered
})

const paginatedChallenges = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredChallenges.value.slice(start, end)
})

const totalPages = computed(() => {
    return Math.ceil(filteredChallenges.value.length / itemsPerPage)
})

const challengeStats = computed(() => {
    const now = new Date()
    const active = challenges.value.filter(c => new Date(c.deadline) > now).length
    const completed = challenges.value.filter(c => new Date(c.deadline) <= now).length
    const withPrize = challenges.value.filter(c => c.prize !== null && c.prize !== '').length
    
    return {
        total: challenges.value.length,
        active,
        completed,
        withPrize
    }
})

const hasActiveFilters = computed(() => {
    return !!(searchQuery.value || selectedOrganizer.value || selectedPrizeFilter.value || selectedStatus.value)
})

const activeFiltersCount = computed(() => {
    let count = 0
    if (searchQuery.value) count++
    if (selectedOrganizer.value) count++
    if (selectedPrizeFilter.value) count++
    if (selectedStatus.value) count++
    return count
})

// Methods
const clearAllFilters = () => {
    searchQuery.value = ''
    selectedOrganizer.value = ''
    selectedPrizeFilter.value = ''
    selectedStatus.value = ''
    currentPage.value = 1
}

// Watch for filter changes to reset pagination
watch([searchQuery, selectedOrganizer, selectedPrizeFilter, selectedStatus], () => {
    currentPage.value = 1
})
</script>