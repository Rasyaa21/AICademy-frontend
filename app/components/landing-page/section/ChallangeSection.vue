<!-- components/landing-page/section/ChallangeSection.vue -->
<script setup lang="ts">
import SegmentedControl from '../SegmentedControl.vue'
import ChallengeCard from '../../card/ChallengeCard.vue'
import type { Challenge } from '~/types/Challange'

const selectedCategory = ref('All')

// Simple mock data sesuai backend structure
const challenges = ref<Challenge[]>([
    {
        id: '550e8400-e29b-41d4-a716-446655440001',
        thumbnail_image: '/assets/images/challenges/api-perpustakaan.jpg',
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
        thumbnail_image: '/assets/images/challenges/react-portfolio.jpg',
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
        thumbnail_image: '/assets/images/challenges/ui-design.jpg',
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
        thumbnail_image: '/assets/images/challenges/ctf-security.jpg',
        title: 'CTF Web Security',
        description: 'Selesaikan tantangan keamanan web dengan berbagai teknik penetration testing',
        organizer: 'Agus Dwi Cahaya S.Kom',
        deadline: '2025-09-15T23:59:59Z',
        prize: null,
        participant: 15,
        winner_team_id: null
    }
])

// Simple filtering berdasarkan title keywords
const filteredChallenges = computed(() => {
    if (selectedCategory.value === 'Frontend') {
        return challenges.value.filter(c => 
            c.title.toLowerCase().includes('react') || 
            c.title.toLowerCase().includes('frontend') ||
            c.title.toLowerCase().includes('portfolio')
        )
    }
    if (selectedCategory.value === 'Cybersecurity') {
        return challenges.value.filter(c => 
            c.title.toLowerCase().includes('security') || 
            c.title.toLowerCase().includes('ctf') ||
            c.title.toLowerCase().includes('cyber')
        )
    }
    if (selectedCategory.value === 'UI/UX') {
        return challenges.value.filter(c => 
            c.title.toLowerCase().includes('ui') || 
            c.title.toLowerCase().includes('design') ||
            c.title.toLowerCase().includes('ux')
        )
    }
    // All
    return challenges.value
})
</script>

<template>
  <section class="w-full py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
    <div class="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-32 -translate-y-32"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-x-48 translate-y-48"></div>
    
    <div class="absolute top-20 right-20 w-8 h-8 bg-primary/10 rounded-full animate-bounce"></div>
    <div class="absolute bottom-40 left-16 w-6 h-6 bg-accent/20 rounded-full animate-pulse"></div>
    <div class="absolute top-1/2 left-8 w-4 h-4 bg-secondary/15 rounded-full"></div>

    <div class="relative max-w-7xl mx-auto px-6">
      <div class="text-center mb-12">
        <div class="flex items-center space-x-2 mb-4 justify-center">
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 11c1.7 0 3-1.3 3-3S17.7 5 16 5s-3 1.3-3 3 1.3 3 3 3zM8 11c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3zm0 2c-2.3 0-7 1.2-7 3.5V20h14v-3.5C15 14.2 10.3 13 8 13zm8 0c-.3 0-.6 0-.9.1 1 .7 1.9 1.7 1.9 2.9V20h6v-3.5C23 14.2 18.3 13 16 13z"/>
                </svg>
            </div>
            <span class="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                Challenge & Collaboration
            </span>
        </div>
        
        <h2 class="text-4xl lg:text-5xl font-bold text-secondary mb-4">
          Jelajahi Semua <span class="text-primary">Challenge</span>
        </h2>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto">
          Asah kemampuan kamu dengan challenge-challenge menarik yang khusus disediakan oleh guru dan sekolah!
        </p>
      </div>

      <div class="flex justify-center mb-12">
        <SegmentedControl 
          :options="['All', 'Frontend', 'UI/UX', 'Cybersecurity']"
          v-model="selectedCategory"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
        <ChallengeCard 
          v-for="challenge in filteredChallenges.slice(0, 4)" 
          :key="challenge.id"
          :challenge="challenge"
        />
      </div>

      <div v-if="filteredChallenges.length === 0" class="text-center py-20">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Belum ada challenge</h3>
        <p class="text-gray-600">Challenge untuk kategori ini akan segera hadir!</p>
      </div>

      <div class="text-center mt-16">
        <NuxtLink 
          to="/student/dashboard/challange"
          class="bg-primary text-white px-8 py-3 rounded-2xl font-semibold hover:bg-primary/90 transition-colors shadow-lg inline-block"
        >
          Lihat Semua Challenge
        </NuxtLink>
      </div>
    </div>
  </section>
</template>