<!-- pages/student/dashboard/challange.vue -->
<template>
    <div class="space-y-6">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">Challenge</h1>
                <p class="text-gray-600 mt-1">
                    Ikuti berbagai challenge untuk meningkatkan skill programming Anda
                </p>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="bg-white p-6 rounded-xl shadow-sm border">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm">Total Challenge</p>
                        <p class="text-2xl font-bold text-gray-900">{{ challengeStats.total }}</p>
                    </div>
                    <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Icon name="heroicons:puzzle-piece-20-solid" class="w-6 h-6 text-primary" />
                    </div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-sm border">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm">Challenge Aktif</p>
                        <p class="text-2xl font-bold text-green-600">{{ challengeStats.active }}</p>
                    </div>
                    <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Icon name="heroicons:clock-20-solid" class="w-6 h-6 text-green-600" />
                    </div>
                </div>
            </div>


            <div class="bg-white p-6 rounded-xl shadow-sm border">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm">Berakhir</p>
                        <p class="text-2xl font-bold text-red-600">{{ challengeStats.completed }}</p>
                    </div>
                    <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                        <Icon name="heroicons:trophy-20-solid" class="w-6 h-6 text-red-600" />
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div>
                    <h3 class="text-lg font-semibold text-gray-900">Filter & Pencarian</h3>
                    <p class="text-sm text-gray-500 mt-1">
                        {{ filteredChallenges.length }} dari {{ challenges.length }} challenge ditemukan
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
                        placeholder="Cari challenge berdasarkan judul atau deskripsi..."
                        class="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm 
                               focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                               transition-all duration-200"
                    />
                </div>


                <div class="relative">
                    <select 
                        v-model="selectedStatus" 
                        class="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm font-medium text-gray-700 
                               hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                               transition-all duration-200 cursor-pointer shadow-sm"
                    >
                        <option value="" class="text-gray-600">Semua Status</option>
                        <option value="active">Aktif</option>
                        <option value="completed">Berakhir</option>
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
                    <option value="deadline">Deadline</option>
                    <option value="participants">Peserta Terbanyak</option>
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

        <!-- Challenge Grid/List -->
        <div v-if="filteredChallenges.length > 0">
            <div 
                v-if="viewMode === 'grid'"
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            >
                <ChallengeCard 
                    v-for="challenge in paginatedChallenges" 
                    :key="challenge.id"
                    :challenge="challenge"
                />
            </div>

            <div 
                v-else
                class="space-y-4"
            >
                <ChallengeListItem 
                    v-for="challenge in paginatedChallenges" 
                    :key="challenge.id"
                    :challenge="challenge"
                />
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
            <div class="text-gray-400 mb-4">
                <Icon name="heroicons:magnifying-glass-20-solid" class="w-16 h-16 mx-auto" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Tidak ada challenge ditemukan</h3>
            <p class="text-gray-500 mb-4">
                {{ searchQuery ? 'Coba ubah kata kunci pencarian atau' : 'Coba ubah' }} filter untuk melihat challenge lainnya
            </p>
            <button 
                @click="clearAllFilters"
                class="text-primary hover:text-primary/80 font-medium"
            >
                Reset semua filter
            </button>
        </div>

        <!-- Pagination -->
        <div v-if="filteredChallenges.length > itemsPerPage" class="flex justify-center">
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
import ChallengeCard from '~/components/card/ChallengeCard.vue'
import ChallengeListItem from '~/components/dashboard-student/challange/ChallangeListItem.vue'
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