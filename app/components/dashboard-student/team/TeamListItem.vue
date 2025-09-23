<template>
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 p-6">
        <div class="flex items-start gap-4">
            <!-- Team Avatar -->
            <div class="flex-shrink-0">
                <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 overflow-hidden">
                    <img 
                        v-if="team.team_profile_picture" 
                        :src="team.team_profile_picture" 
                        :alt="team.team_name"
                        class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center">
                        <Icon name="heroicons:users-20-solid" class="w-8 h-8 text-primary/60" />
                    </div>
                </div>
            </div>

            <!-- Team Info -->
            <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between mb-2">
                    <h3 class="font-semibold text-lg text-gray-900 truncate group-hover:text-primary transition-colors">
                        {{ team.team_name }}
                    </h3>
                    <div class="ml-4 flex items-center gap-2 text-xs text-gray-500">
                        <Icon name="heroicons:users-20-solid" class="w-3 h-3" />
                        {{ team.member_count || 1 }} member{{ (team.member_count || 1) > 1 ? 's' : '' }}
                    </div>
                </div>

                <p v-if="team.about" class="text-gray-600 text-sm mb-3 line-clamp-2">
                    {{ team.about }}
                </p>
                <p v-else class="text-gray-400 text-sm mb-3 italic">
                    Belum ada deskripsi team
                </p>

                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4 text-xs text-gray-500">
                        <div class="flex items-center gap-1">
                            <Icon name="heroicons:star-20-solid" class="w-3 h-3 text-primary" />
                            <span>{{ team.created_by_student_name }}</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <Icon name="heroicons:calendar-20-solid" class="w-3 h-3" />
                            <span>{{ formatDate(team.created_at) }}</span>
                        </div>
                    </div>

                    <div class="flex gap-2">
                        <button 
                            @click="viewTeam"
                            class="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                            <Icon name="heroicons:eye-20-solid" class="w-4 h-4" />
                            Lihat Detail
                        </button>
                        <button 
                            @click="joinTeam"
                            class="px-3 py-2 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors"
                        >
                            <Icon name="heroicons:plus-20-solid" class="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Team } from '~/types/Team'

const props = defineProps<{
    team: Team
}>()

const emit = defineEmits<{
    'view-team': [team: Team]
    'join-team': [team: Team]
}>()

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'hari ini'
    if (diffDays <= 7) return `${diffDays} hari yang lalu`
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} minggu yang lalu`
    if (diffDays <= 365) return `${Math.ceil(diffDays / 30)} bulan yang lalu`
    return `${Math.ceil(diffDays / 365)} tahun yang lalu`
}

const viewTeam = () => {
    emit('view-team', props.team)
}

const joinTeam = () => {
    emit('join-team', props.team)
}
</script>