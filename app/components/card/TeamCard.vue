<template>
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden group">
        <!-- Team Profile Picture -->
        <div class="relative h-48 bg-gradient-to-br from-primary/10 to-primary/20 overflow-hidden">
            <img 
                v-if="team.team_profile_picture" 
                :src="team.team_profile_picture" 
                :alt="team.team_name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
                <Icon name="heroicons:users-20-solid" class="w-16 h-16 text-primary/60" />
            </div>
            
            <!-- Member Count Badge -->
            <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-700">
                <Icon name="heroicons:users-20-solid" class="w-3 h-3 inline mr-1" />
                {{ team.member_count || 1 }} member{{ (team.member_count || 1) > 1 ? 's' : '' }}
            </div>
        </div>

        <!-- Team Content -->
        <div class="p-6">
            <!-- Team Name -->
            <h3 class="font-semibold text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                {{ team.team_name }}
            </h3>

            <!-- About -->
            <p v-if="team.about" class="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                {{ team.about }}
            </p>
            <p v-else class="text-gray-400 text-sm mb-4 italic">
                Belum ada deskripsi team
            </p>

            <!-- Team Leader Info -->
            <div class="flex items-center gap-2 mb-4">
                <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="heroicons:star-20-solid" class="w-4 h-4 text-primary" />
                </div>
                <div class="flex-1">
                    <p class="text-xs text-gray-500">Team Leader</p>
                    <p class="text-sm font-medium text-gray-900">{{ team.created_by_student_name }}</p>
                </div>
            </div>

            <!-- Created Date -->
            <div class="flex items-center gap-2 mb-4">
                <Icon name="heroicons:calendar-20-solid" class="w-4 h-4 text-gray-400" />
                <span class="text-xs text-gray-500">
                    Dibuat {{ formatDate(team.created_at) }}
                </span>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2">
                <button 
                    @click="viewTeam"
                    class="flex-1 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                    <Icon name="heroicons:eye-20-solid" class="w-4 h-4" />
                    Lihat Detail
                </button>
                <button 
                    @click="joinTeam"
                    class="px-4 py-2 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors flex items-center justify-center"
                >
                    <Icon name="heroicons:plus-20-solid" class="w-4 h-4" />
                </button>
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