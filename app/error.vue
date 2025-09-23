<!-- filepath: /Users/rasya2121/Documents/code/pkl/JHIC/aicademy-frontend/app/error.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-b from-primary to-red-700 flex flex-col justify-center items-center px-6 relative overflow-hidden">
    <!-- Background Elements (sama seperti HeroSection) -->
    <div class="absolute -top-10 -left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-20 -right-10 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl"></div>
    
    <div class="absolute top-32 right-32 w-16 h-16 bg-white/5 rounded-lg rotate-45"></div>
    <div class="absolute bottom-32 left-48 w-20 h-20 bg-white/5 rounded-full"></div>
    <div class="absolute top-1/2 left-8 w-8 h-8 bg-white/10 rounded-full"></div>
    <div class="absolute top-1/4 right-16 w-12 h-12 bg-white/5 rounded-lg rotate-12"></div>

    <!-- Floating Icons (sama seperti HeroSection) -->
    <div class="absolute top-24 left-32 lg:left-48 animate-float">
      <div class="w-[80px] h-[80px] bg-transparent backdrop-blur-sm rounded-full p-3 shadow-lg">
        <img src="/assets/images/home-icon.png" alt="Home" class="w-full h-full object-contain opacity-60" />
      </div>
    </div>

    <div class="absolute top-1/3 right-24 lg:right-32 animate-float-delayed">
      <div class="w-[80px] h-[80px] bg-transparent backdrop-blur-sm rounded-full p-3 shadow-lg">
        <img src="/assets/images/book-icon.png" alt="Book" class="w-full h-full object-contain opacity-60" />
      </div>
    </div>

    <div class="absolute bottom-40 left-16 animate-float-slow">
      <div class="w-[80px] h-[80px] bg-transparent backdrop-blur-sm rounded-full p-3 shadow-lg">
        <img src="/assets/images/gear-icon.png" alt="Settings" class="w-full h-full object-contain opacity-60" />
      </div>
    </div>

    <!-- Main Content -->
    <div class="text-center relative z-10">
      <!-- Error Code dengan styling mirip hero title -->
      <div class="mb-8">
        <h1 class="text-8xl md:text-9xl font-bold text-white/80 select-none drop-shadow-lg animate-pulse">
          {{ error.statusCode }}
        </h1>
      </div>
      
      <!-- Icon Container -->
      <div class="mb-8">
        <div class="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full backdrop-blur-sm shadow-xl">
          <Icon 
            :name="getErrorIcon()" 
            class="w-12 h-12 text-white" 
          />
        </div>
      </div>
      
      <!-- Title & Message dengan styling mirip hero -->
      <div class="mb-10">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
          {{ getErrorTitle() }}
        </h2>
        <div class="max-w-2xl mx-auto">
          <p class="text-lg md:text-xl text-white/90 leading-relaxed">
            {{ getErrorMessage() }}
          </p>
        </div>
      </div>
      
      <!-- Actions dengan styling mirip CTA buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <button 
          @click="handleError"
          class="group relative px-8 py-4 bg-white text-primary rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 min-w-[200px]"
        >
          <span class="relative z-10 flex items-center justify-center gap-2">
            <Icon name="heroicons:home-20-solid" class="w-5 h-5" />
            Kembali ke Beranda
          </span>
          <div class="absolute inset-0 bg-gradient-to-r from-primary/10 to-red-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
        
        <button 
          @click="refresh"
          class="group px-8 py-4 border-2 border-white text-white rounded-2xl font-semibold text-lg hover:bg-white hover:text-primary transition-all duration-300 min-w-[200px]"
        >
          <span class="flex items-center justify-center gap-2">
            <Icon name="heroicons:arrow-path-20-solid" class="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            Muat Ulang
          </span>
        </button>
      </div>

      <!-- Quick Links (mirip dengan stats di hero) -->
      <div class="flex flex-wrap justify-center gap-4 text-white/80 text-sm">
        <NuxtLink 
          to="/"
          class="hover:text-white transition-colors flex items-center gap-1"
        >
          <Icon name="heroicons:home-20-solid" class="w-4 h-4" />
          Beranda
        </NuxtLink>
        <span class="text-white/40">•</span>
        <NuxtLink 
          to="/student/dashboard"
          class="hover:text-white transition-colors flex items-center gap-1"
        >
          <Icon name="heroicons:squares-2x2-20-solid" class="w-4 h-4" />
          Dashboard
        </NuxtLink>
        <span class="text-white/40">•</span>
        <NuxtLink 
          to="/student/dashboard/challange"
          class="hover:text-white transition-colors flex items-center gap-1"
        >
          <Icon name="heroicons:trophy-20-solid" class="w-4 h-4" />
          Challenge
        </NuxtLink>
      </div>
      
      <!-- Development Error Details -->
      <div v-if="isDev && error.message" class="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl text-left max-w-4xl mx-auto border border-white/20">
        <div class="flex items-center gap-2 mb-4">
          <Icon name="heroicons:bug-ant-20-solid" class="w-5 h-5 text-white" />
          <p class="text-white font-semibold">Error Details (Development Mode)</p>
        </div>
        <div class="space-y-3">
          <div class="bg-white/5 rounded-lg p-4">
            <p class="text-white/70 text-sm mb-1 font-medium">Message:</p>
            <p class="text-white text-sm font-mono break-all">{{ error.message }}</p>
          </div>
          <div v-if="error.stack" class="bg-white/5 rounded-lg p-4">
            <p class="text-white/70 text-sm mb-1 font-medium">Stack Trace:</p>
            <pre class="text-white/80 text-xs font-mono whitespace-pre-wrap overflow-x-auto">{{ error.stack }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-red-800/20 via-transparent to-transparent pointer-events-none"></div>
  </div>
</template>

<script setup lang="ts">
interface NuxtError {
  statusCode: number
  statusMessage?: string
  message?: string
  stack?: string
}

const props = defineProps<{
  error: NuxtError
}>()

const isDev = import.meta.dev

const getErrorIcon = () => {
  switch (props.error.statusCode) {
    case 404:
      return 'heroicons:map-20-solid'
    case 500:
      return 'heroicons:server-20-solid'
    case 403:
      return 'heroicons:lock-closed-20-solid'
    default:
      return 'heroicons:exclamation-triangle-20-solid'
  }
}

const getErrorTitle = () => {
  switch (props.error.statusCode) {
    case 404:
      return 'Halaman Tidak Ditemukan'
    case 500:
      return 'Terjadi Kesalahan Server'
    case 403:
      return 'Akses Ditolak'
    default:
      return 'Terjadi Kesalahan'
  }
}

const getErrorMessage = () => {
  switch (props.error.statusCode) {
    case 404:
      return 'Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak pernah ada. Mari kembali ke halaman utama dan mulai menjelajah lagi.'
    case 500:
      return 'Server sedang mengalami gangguan. Tim kami sudah diberitahu dan sedang bekerja keras untuk memperbaikinya. Silakan coba lagi dalam beberapa saat.'
    case 403:
      return 'Anda tidak memiliki izin untuk mengakses halaman ini. Pastikan Anda sudah login dengan akun yang sesuai.'
    default:
      return props.error.statusMessage || 'Terjadi kesalahan yang tidak terduga. Jangan khawatir, ini bukan salah Anda. Silakan muat ulang halaman atau kembali ke beranda.'
  }
}

const handleError = async () => {
  await clearError({ redirect: '/' })
}

const refresh = () => {
  clearError({ redirect: useRoute().fullPath })
}

// Set SEO meta
useSeoMeta({
  title: `${props.error.statusCode} - ${getErrorTitle()}`,
  description: getErrorMessage(),
})
</script>

<style scoped>
/* Animations yang sama dengan HeroSection */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes float-delayed {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
}

.animate-float-slow {
  animation: float-slow 10s ease-in-out infinite;
}

/* Smooth scrollbar untuk dev error details */
pre::-webkit-scrollbar {
  height: 4px;
}

pre::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

pre::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

pre::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>