<template>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
            title="Total Pengguna"
            :value="389"
            icon="heroicons:users-16-solid"
        />
        <StatsCard
            title="Total Challenge"
            :value="challengeStats.total"
            icon="heroicons:puzzle-piece-20-solid"
        />
        <StatsCard
            title="Challenge Aktif"
            :value="challengeStats.active"
            icon="heroicons:clock-20-solid"
        />
        <StatsCard
            title="Total Partisipan"
            :value="challengeStats.totalParticipants"
            icon="heroicons:academic-cap-20-solid"
        />
    </div>
</template>

<script setup lang="ts">
import StatsCard from '~/components/dashboard-admin/index/StatsCard.vue'

interface ChallengeStats {
    total: number
    active: number
    completed: number
    totalParticipants: number
}

defineProps<{
    challengeStats: ChallengeStats
}>()
</script> 