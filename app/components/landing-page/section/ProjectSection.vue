<script setup lang="ts">
import ProjectCard from '../ProjectCard.vue';

const projects = ref([
  {
    id: 1,
    title: 'Sortify',
    description: 'Platform e-commerce modern dengan fitur lengkap untuk UMKM dan toko online. Dilengkapi dengan sistem pembayaran terintegrasi dan dashboard analytics.',
    category: 'Mobile Application',
    rank: 1,
    author: {
      avatar: '/assets/images/project/dinacom.png',
      team: 'klub_realitas.dart'
    },
    tech: ['Flutter', 'Gemini AI', 'Laravel', 'MySQL'],
    image: '/assets/images/project/dinacom.png',
    githubUrl: 'https://github.com/Rasyaa21/Nyampah_Dinacom',
    liveUrl: 'https://dodolan.example.com'
  },
  {
    id: 2,
    title: 'Sortify',
    description: 'Sistem manajemen pembelajaran digital untuk sekolah dengan fitur tracking progress siswa dan video conference terintegrasi.',
    category: 'Mobile Application',
    rank: 2,
    author: {
      avatar: '/assets/images/project/dinacom.png',
      team: 'klub_realitas.dart'
    },
    tech: ['Flutter', 'Gemini AI', 'Laravel', 'MySQL'],
    image: '/assets/images/project/dinacom.png',
    githubUrl: 'https://github.com/Rasyaa21/Nyampah_Dinacom',
    liveUrl: 'https://edutrack.example.com'
  },
  {
    id: 3,
    title: 'Dodolan',
    description: 'Perpustakaan digital dengan sistem AI recommendation dan QR code untuk peminjaman buku fisik yang terintegrasi.',
    category: 'Web Application',
    rank: 3,
    author: {
      avatar: '/assets/images/project/dodolan-img.png',
      team: 'Penerbang Roket'
    },
    tech: ['Laravel', 'MySql', 'Midtrans'],
    image: '/assets/images/project/dodolan-img.png',
    githubUrl: 'https://github.com/Rasyaa21/dodolan-final-web',
    liveUrl: 'https://smartlibrary.example.com'
  }
]);

// Computed untuk memastikan projects yang diperlukan ada
const firstPlace = computed(() => projects.value.find(p => p.rank === 1))
const secondPlace = computed(() => projects.value.find(p => p.rank === 2))
const thirdPlace = computed(() => projects.value.find(p => p.rank === 3))
</script>

<template>
  <section class="w-full py-20 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
    <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-yellow-400/10 to-transparent rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl"></div>
    
    <div class="relative max-w-7xl mx-auto px-6">
      <div class="text-center mb-16">
        <div class="flex items-center space-x-2 mb-4 justify-center">
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 11c1.7 0 3-1.3 3-3S17.7 5 16 5s-3 1.3-3 3 1.3 3 3 3zM8 11c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3zm0 2c-2.3 0-7 1.2-7 3.5V20h14v-3.5C15 14.2 10.3 13 8 13zm8 0c-.3 0-.6 0-.9.1 1 .7 1.9 1.7 1.9 2.9V20h6v-3.5C23 14.2 18.3 13 16 13z"/>
                </svg>
            </div>
            <span class="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                Project Of The Month
            </span>
        </div>
        
        <h2 class="text-4xl lg:text-5xl font-bold text-secondary mb-4">
          Project Terbaik <span class="text-transparent bg-clip-text bg-primary">Bulan Ini</span>
        </h2>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto">
          Karya-karya terbaik siswa yang menunjukkan inovasi, kreativitas, dan implementasi teknologi terdepan
        </p>
      </div>

        <div class="relative">
        <div
            class="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mb-8"
        >
            <div v-if="secondPlace" class="flex flex-col items-center md:order-1">
            <div class="w-full max-w-sm mb-5 md:mb-6 transition-transform duration-300 md:-translate-y-2">
                <ProjectCard :project="secondPlace" />
            </div>
            <div class="relative">
                <span class="absolute -inset-3 rounded-full bg-gray-300/20 blur-xl"></span>
                <div
                    class="w-12 h-12 rounded-full grid place-items-center
                        bg-gradient-to-br from-gray-200 to-gray-500 text-white
                        font-extrabold text-lg ring-2 ring-white shadow-md"
                    aria-label="Rank 2"
                >
                    2
                </div>
            </div>
            </div>

            <div v-if="firstPlace" class="flex flex-col items-center md:order-2">
            <div class="w-full max-w-sm mb-6 md:mb-8 relative transition-transform duration-300 md:-translate-y-6">
                <div class="absolute -inset-6 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-3xl blur-2xl"></div>
                <ProjectCard :project="firstPlace" :isWinner="true" />
            </div>
            <div class="relative">
                <svg
                class="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 drop-shadow"
                viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
                >
                <path class="text-yellow-400" d="M5 19h14l-1-9-4 3-3-6-3 6-4-3-1 9z"/>
                </svg>
                <span class="absolute -inset-4 rounded-full bg-yellow-400/25 blur-2xl"></span>
                <div
                    class="w-14 h-14 rounded-full grid place-items-center
                        bg-white/90 text-yellow-600 font-extrabold text-2xl
                        ring-2 ring-yellow-200 shadow-lg"
                    aria-label="Rank 1"
                >
                    1
                </div>
            </div>
            </div>

            <div v-if="thirdPlace" class="flex flex-col items-center md:order-3">
            <div class="w-full max-w-sm mb-5 md:mb-6 transition-transform duration-300 md:-translate-y-1">
                <ProjectCard :project="thirdPlace" />
            </div>
            <div class="relative">
                <span class="absolute -inset-3 rounded-full bg-amber-700/20 blur-xl"></span>
                <div
                    class="w-10 h-10 rounded-full grid place-items-center
                        bg-gradient-to-br from-amber-300 to-amber-600 text-white
                        font-extrabold text-base ring-2 ring-white shadow-md"
                    aria-label="Rank 3"
                >
                    3
                </div>
            </div>
            </div>
        </div>
        </div>

      <div class="text-center mt-16">
        <button class="bg-gradient-to-r from-primary to-red-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-primary/90 hover:to-red-600/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
          Lihat Semua Project
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}

@keyframes float-delayed {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 5s ease-in-out infinite;
}

.animate-float-slow {
  animation: float-slow 6s ease-in-out infinite;
}
</style>