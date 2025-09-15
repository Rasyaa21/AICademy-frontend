<template>
    <div class="flex flex-col space-y-4">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="font-bold text-xl">Progress Challenge Saya</h1>
                <p class="text-sm text-gray-500 mt-1">
                    {{ activeChallenges.length }} challenge aktif dari {{ challenges.length }} total
                </p>
            </div>
            <button class="text-primary hover:text-primary/80 text-sm font-medium">
                Lihat Semua
            </button>
        </div>

        <div class="flex items-center gap-3 mb-2">
            <div class="relative">
                <select 
                    v-model="selectedOrganizer" 
                    class="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm font-medium text-gray-700 
                    hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                    transition-all duration-200 cursor-pointer shadow-sm"
                >
                    <option value="" class="text-gray-600">Semua Organizer</option>
                    <option value="Agus Dwi Cahaya S.Kom">👨‍🏫 Agus Dwi Cahaya S.Kom</option>
                    <option value="Siti Nurhasanah S.Pd">👩‍🏫 Siti Nurhasanah S.Pd</option>
                    <option value="Ahmad Rizki M.Kom">👨‍🏫 Ahmad Rizki M.Kom</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </div>

            <div class="relative">
                <select 
                    v-model="selectedPrizeFilter" 
                    class="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm font-medium text-gray-700 
                    hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                    transition-all duration-200 cursor-pointer shadow-sm"
                >
                    <option value="" class="text-gray-600">Semua Prize</option>
                    <option value="with-prize">💰 Berhadiah</option>
                    <option value="no-prize">🆓 Tanpa Hadiah</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </div>

            <button 
                v-if="selectedOrganizer || selectedPrizeFilter"
                @click="clearFilters"
                class="px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 
                        rounded-lg transition-colors duration-200 flex items-center gap-1"
            >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Clear
            </button>
        </div>

        <div class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <ChallengeCard 
                v-for="challenge in filteredChallenges" 
                :key="challenge.id"
                :challenge="challenge"
            />
        </div>

        <div v-if="filteredChallenges.length === 0" class="text-center py-8">
            <div class="text-gray-400 mb-2">
                <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"></path>
                </svg>
            </div>
            <p class="text-gray-500 font-medium">Tidak ada challenge yang sesuai dengan filter</p>
            <p class="text-gray-400 text-sm mt-1">Coba ubah filter untuk melihat challenge lainnya</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ChallengeCard from '~/components/card/ChallengeCard.vue'
import type { Challenge } from '~/types/Challange'


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

// Filter state - simple saja
const selectedOrganizer = ref('')
const selectedPrizeFilter = ref('')

// Methods
const clearFilters = () => {
    selectedOrganizer.value = ''
    selectedPrizeFilter.value = ''
}

// Computed properties
const activeChallenges = computed(() => {
    return challenges.value.filter(challenge => {
        const deadline = new Date(challenge.deadline)
        return deadline > new Date()
    })
})

const filteredChallenges = computed(() => {
    let filtered = challenges.value

    // Filter by organizer
    if (selectedOrganizer.value) {
        filtered = filtered.filter(c => c.organizer === selectedOrganizer.value)
    }

    // Filter by prize
    if (selectedPrizeFilter.value) {
        if (selectedPrizeFilter.value === 'with-prize') {
            filtered = filtered.filter(c => c.prize !== null && c.prize !== '')
        } else if (selectedPrizeFilter.value === 'no-prize') {
            filtered = filtered.filter(c => c.prize === null || c.prize === '')
        }
    }

    return filtered
})

const challengeStats = computed(() => {
    return {
        total: challenges.value.length,
        active: activeChallenges.value.length,
        completed: challenges.value.length - activeChallenges.value.length,
        withPrize: challenges.value.filter(c => c.prize !== null && c.prize !== '').length
    }
})
</script>

<style scoped>
/* Custom select styling */
select::-ms-expand {
    display: none;
}

/* Option styling (limited browser support) */
select option {
    @apply py-2 px-3;
}

/* Hover effect for select */
select:hover {
    @apply shadow-md;
}

/* Focus state enhancement */
select:focus {
    @apply shadow-lg;
}
</style>