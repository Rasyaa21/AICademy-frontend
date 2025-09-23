<template>
    <div>
        <div 
            v-if="viewMode === 'grid'"
            class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
        >
            <TeamCard 
                v-for="team in paginatedTeams" 
                :key="team.id"
                :team="team"
                @view-team="$emit('view-team', $event)"
                @join-team="$emit('join-team', $event)"
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
                @view-team="$emit('view-team', $event)"
                @join-team="$emit('join-team', $event)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import TeamCard from '~/components/card/TeamCard.vue'
import TeamListItem from '~/components/dashboard-student/team/TeamListItem.vue'
import type { Team } from '~/types/Team'

defineProps<{
    viewMode: 'grid' | 'list'
    paginatedTeams: Team[]
}>()

defineEmits<{
    'view-team': [team: Team]
    'join-team': [team: Team]
}>()
</script> 