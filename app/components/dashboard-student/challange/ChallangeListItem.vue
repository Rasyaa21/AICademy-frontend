<!-- components/dashboard-student/challange/ChallangeListItem.vue -->
<template>
    <div class="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
        <div class="flex items-start gap-4">
            <div class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                <img 
                    :src="challenge.thumbnail_image" 
                    :alt="challenge.title"
                    class="w-full h-full object-cover"
                    loading="lazy"
                />
            </div>
            
            <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between mb-2">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ challenge.title }}</h3>
                        <div class="flex items-center gap-3 text-sm text-gray-500">
                            <span class="flex items-center gap-1">
                                <Icon name="heroicons:user-20-solid" class="w-4 h-4" />
                                {{ challenge.organizer }}
                            </span>
                            <span class="flex items-center gap-1">
                                <Icon name="heroicons:user-group-20-solid" class="w-4 h-4" />
                                {{ challenge.participant }} peserta
                            </span>
                            <span class="flex items-center gap-1">
                                <Icon name="heroicons:calendar-20-solid" class="w-4 h-4" />
                                {{ formatDeadline(challenge.deadline) }}
                            </span>
                        </div>
                    </div>
                    <span 
                        v-if="challenge.prize"
                        class="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                    >
                        💰 Berhadiah
                    </span>
                </div>
                
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ challenge.description }}</p>
                
                <div class="flex items-center justify-between">
                    <div v-if="challenge.prize" class="flex items-center gap-2">
                        <span class="text-xs text-gray-500">Hadiah:</span>
                        <span class="text-sm font-medium text-yellow-700">{{ challenge.prize }}</span>
                    </div>
                    <div v-else class="text-xs text-gray-400">Tanpa hadiah</div>
                    
                    <div class="flex items-center gap-3">
                        <span 
                            :class="[
                                'px-2 py-1 rounded-full text-xs font-medium',
                                isActive(challenge.deadline) 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            ]"
                        >
                            {{ isActive(challenge.deadline) ? '🟢 Aktif' : '🔴 Berakhir' }}
                        </span>
                        
                        <button class="text-primary hover:text-primary/80 font-medium text-sm">
                            Lihat Detail →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Challenge } from '~/types/Challange'

defineProps<{
    challenge: Challenge
}>()

// Helper functions
const formatDeadline = (deadline: string) => {
    return new Date(deadline).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

const isActive = (deadline: string) => {
    return new Date(deadline) > new Date()
}
</script>