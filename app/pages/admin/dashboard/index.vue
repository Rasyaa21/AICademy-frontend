<template>          
    <div class="space-y-6">
        <AdminDashboardHeader />
        <AdminDashboardStats :challenge-stats="challengeStats" />
        <AdminDashboardCharts :chart-data="chartData" :challenges="challenges" :recent-challenges="recentChallenges" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AdminDashboardHeader from '~/components/dashboard-admin/sections/AdminDashboardHeader.vue'
import AdminDashboardStats from '~/components/dashboard-admin/sections/AdminDashboardStats.vue'
import AdminDashboardCharts from '~/components/dashboard-admin/sections/AdminDashboardCharts.vue'
import type { Challenge } from '~/types/Challange'

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