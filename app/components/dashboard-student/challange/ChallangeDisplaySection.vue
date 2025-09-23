<template>
    <div>
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
</template>

<script setup lang="ts">
import ChallengeCard from '~/components/card/ChallengeCard.vue'
import ChallengeListItem from '~/components/dashboard-student/challange/ChallangeListItem.vue'
import type { Challenge } from '~/types/Challange'

defineProps<{
    viewMode: 'grid' | 'list'
    paginatedChallenges: Challenge[]
}>()
</script> 