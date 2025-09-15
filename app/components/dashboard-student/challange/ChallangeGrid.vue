<!-- components/dashboard-student/challange/ChallengeGrid.vue -->
<template>
    <div>
        <!-- Sort Options -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div class="flex items-center gap-2 text-sm text-gray-600">
                <Icon name="heroicons:bars-arrow-down-20-solid" class="w-4 h-4" />
                <span>Urutkan berdasarkan:</span>
                <select 
                    :value="sortBy"
                    @change="$emit('update-sort', ($event.target as HTMLSelectElement).value)"
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
                    @click="$emit('update-view-mode', 'grid')"
                    :class="[
                        'p-2 rounded-lg transition-colors',
                        viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    ]"
                >
                    <Icon name="heroicons:squares-2x2-20-solid" class="w-4 h-4" />
                </button>
                <button 
                    @click="$emit('update-view-mode', 'list')"
                    :class="[
                        'p-2 rounded-lg transition-colors',
                        viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    ]"
                >
                    <Icon name="heroicons:list-bullet-20-solid" class="w-4 h-4" />
                </button>
            </div>
        </div>

        <!-- Challenge Content -->
        <div v-if="challenges.length > 0">
            <div 
                v-if="viewMode === 'grid'"
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            >
                <ChallengeCard 
                    v-for="challenge in challenges" 
                    :key="challenge.id"
                    :challenge="challenge"
                />
            </div>

            <div 
                v-else
                class="space-y-4"
            >
                <ChallengeListItem 
                    v-for="challenge in challenges" 
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
                Coba ubah filter untuk melihat challenge lainnya
            </p>
            <button 
                @click="$emit('clear-filters')"
                class="text-primary hover:text-primary/80 font-medium"
            >
                Reset semua filter
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import ChallengeCard from '~/components/card/ChallengeCard.vue'
import ChallengeListItem from './ChallangeListItem.vue'
import type { Challenge } from '~/types/Challange'

interface Props {
    challenges: Challenge[]
    viewMode: 'grid' | 'list'
    sortBy: string
}

defineProps<Props>()

defineEmits<{
    'update-view-mode': [mode: 'grid' | 'list']
    'update-sort': [sort: string]
    'clear-filters': []
}>()
</script>