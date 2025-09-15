<template>          
    <div class="space-y-6">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p class="text-gray-600 mt-1">
                    Kelola data siswa dan monitor aktivitas mereka
                </p>
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

            <!-- Right Column - Calendar & Quick Actions -->
            <div class="space-y-6">
                <!-- Calendar -->
                <Calendar />
                
                <!-- Quick Actions -->
                <QuickActions />
                
                <!-- Recent Activity -->
                <RecentActivity />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Challenge } from '~/types/Challange'
import ChallengeTable from '~/components/dashboard-admin/index/ChallangeTable.vue'
import Calendar from '~/components/calendar/Calendar.vue'
import QuickActions from '~/components/dashboard-admin/index/QuickAction.vue'
import RecentActivity from '~/components/dashboard-admin/index/RecentActivity.vue'
import ParticipationChart from '~/components/dashboard-admin/index/ParticipationChart.vue'
import ChallangeChart from '~/components/dashboard-admin/index/ChallangeChart.vue'
import StatsCard from '~/components/dashboard-admin/index/StatsCard.vue'

definePageMeta({
    layout: 'admin-dashboard-layout'
})

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

const challengeStats = computed(() => {
    const now = new Date()
    const active = challenges.value.filter(c => new Date(c.deadline) > now).length
    const totalParticipants = challenges.value.reduce((sum, c) => sum + c.participant, 0)
    
    return {
        total: challenges.value.length,
        active,
        completed: challenges.value.length - active,
        totalParticipants
    }
})

const recentChallenges = computed(() => {
    return challenges.value.slice(0, 3)
})

const chartData = ref([
    { month: 'Jan', challenges: 12, participants: 45 },
    { month: 'Feb', challenges: 15, participants: 67 },
    { month: 'Mar', challenges: 18, participants: 89 },
    { month: 'Apr', challenges: 22, participants: 112 },
    { month: 'May', challenges: 25, participants: 134 },
    { month: 'Jun', challenges: 28, participants: 156 }
])
</script>