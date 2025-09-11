<script setup lang="ts">
import SegmentedControl from '../SegmentedControl.vue';
import ChallengeCard from '../ChallengeCard.vue';

const selectedCategory = ref('All');

const challenges = ref([
  {
    id: 1,
    title: 'API Perpustakaan',
    category: 'Backend',
    description: 'Buatlah REST API untuk sistem perpustakaan dengan skema database yang telah ditentukan',
    difficulty: 'Medium' as const,
    participants: 47,
    deadline: '20 Agustus 2025',
    author: {
      name: 'Agus Dwi Cahaya S.Kom',
      avatar: '/assets/images/profile/lord-aic.jpeg',
      school: 'SMK Telkom Purwokerto'
    },
    tech: ['Laravel', 'MySQL', 'PHP'],
    bgColor: 'bg-gradient-to-br from-red-500 to-red-600'
  },
  {
    id: 2,
    title: 'React JS Portfolio',
    category: 'Frontend', 
    description: 'Buat portfolio website menggunakan React JS dengan design yang responsive dan modern',
    difficulty: 'Easy' as const,
    participants: 32,
    deadline: '25 Agustus 2025',
    author: {
      name: 'Agus Dwi Cahaya S.Kom',
      avatar: '/assets/images/profile/lord-aic.jpeg',
      school: 'SMK Telkom Purwokerto'
    },
    tech: ['React JS', 'Tailwind', 'Vite'],
    bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600'
  },
  {
    id: 3,
    title: 'UI Design Challenge',
    category: 'UI/UX Design',
    description: 'Desain interface aplikasi mobile untuk e-commerce dengan fokus pada user experience',
    difficulty: 'Hard' as const,
    participants: 28,
    deadline: '30 Agustus 2025',
    author: {
      name: 'Agus Dwi Cahaya S.Kom',
      avatar: '/assets/images/profile/lord-aic.jpeg',
      school: 'SMK Telkom Purwokerto'
    },
    tech: ['Figma', 'Adobe XD', 'Prototyping'],
    bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600'
  },
  {
    id: 4,
    title: 'CTF Web Security',
    category: 'Cybersecurity',
    description: 'Selesaikan tantangan keamanan web dengan berbagai teknik penetration testing',
    difficulty: 'Hard' as const,
    participants: 15,
    deadline: '15 September 2025',
    author: {
      name: 'Agus Dwi Cahaya S.Kom',
      avatar: '/assets/images/profile/lord-aic.jpeg',
      school: 'SMK Telkom Purwokerto'
    },
    tech: ['Kali Linux', 'Burp Suite', 'OWASP'],
    bgColor: 'bg-gradient-to-br from-gray-700 to-gray-800'
  }
]);

// Filter challenges based on selected category
const filteredChallenges = computed(() => {
  if (selectedCategory.value === 'Frontend') {
    return challenges.value.filter(c => c.category.includes('Frontend'))
  }
  if (selectedCategory.value === 'Cybersecurity') {
    return challenges.value.filter(c => c.category.includes('Cybersecurity'))
  }
  if (selectedCategory.value === 'UI/UX') {
    return challenges.value.filter(c => c.category.includes('UI/UX'))
  }
  // LKS or All
  return challenges.value
});
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
                Challange & Collaboration
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
          v-for="challenge in filteredChallenges" 
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
        <button class="bg-primary text-white px-8 py-3 rounded-2xl font-semibold hover:bg-primary/90 transition-colors shadow-lg">
          Lihat Semua Challenge
        </button>
      </div>
    </div>
  </section>
</template>