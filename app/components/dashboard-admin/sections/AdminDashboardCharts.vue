<template>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
            <div class="bg-white rounded-2xl p-6 shadow-sm border">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Data Partisipasi Siswa</h3>
                </div>
                <ChallangeChart :data="chartData" />
            </div>

            <div class="bg-white rounded-2xl p-6 shadow-sm border">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Participation Analytics</h3>
                <ParticipationChart :challenges="challenges" />
            </div>

            <div class="bg-white rounded-2xl p-6 shadow-sm border">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Challange Terkini</h3>
                    <NuxtLink to="/admin/dashboard/challenge" class="text-primary hover:text-primary/80 text-sm font-medium">
                        Lihat Semua
                    </NuxtLink>
                </div>
                <ChallengeTable :challenges="recentChallenges" />
            </div>
        </div>

        <div class="space-y-6">
            <Calendar />
            <QuickActions />
            <RecentActivity />
        </div>
    </div>
</template>

<script setup lang="ts">
import ChallengeTable from '~/components/dashboard-admin/index/ChallangeTable.vue'
import ParticipationChart from '~/components/dashboard-admin/index/ParticipationChart.vue'
import ChallangeChart from '~/components/dashboard-admin/index/ChallangeChart.vue'
import Calendar from '~/components/calendar/Calendar.vue'
import QuickActions from '~/components/dashboard-admin/index/QuickAction.vue'
import RecentActivity from '~/components/dashboard-admin/index/RecentActivity.vue'
import type { Challenge } from '~/types/Challange'

interface ChartData {
    month: string
    challenges: number
    participants: number
}

defineProps<{
    chartData: ChartData[]
    challenges: Challenge[]
    recentChallenges: Challenge[]
}>()
</script> 