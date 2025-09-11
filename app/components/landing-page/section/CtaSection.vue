
<script setup lang="ts">
// Optional: Add any props or state here
const handleGetStarted = () => {
  // Handle CTA action - could navigate to signup/login
  console.log('Getting started...')
}
</script>

<template>
  <section class="w-full py-20 px-6 relative overflow-hidden">
    <div class="max-w-7xl mx-auto">
      <!-- CTA Container -->
      <div class="relative bg-gradient-to-br from-primary to-red-600 rounded-3xl p-12 lg:p-16 overflow-hidden">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
          <div class="absolute bottom-10 right-10 w-24 h-24 border-2 border-white rounded-full"></div>
          <div class="absolute top-1/2 left-1/4 w-16 h-16 border border-white rounded-full"></div>
          <div class="absolute bottom-1/4 left-10 w-20 h-20 border border-white rounded-full"></div>
        </div>

        <div class="absolute top-24 left-32 lg:left-48 animate-float">
            <div class="w-[100px] h-[100px] bg-transparent backdrop-blur-sm rounded-full p-3 shadow-lg">
                <img src="/assets/images/home-icon.png" alt="Settings" class="w-full h-full object-contain opacity-80" />
            </div>
        </div>

        <div class="absolute top-1/3 right-24 lg:right-32 animate-float-delayed">
            <div class="w-[100px] h-[100px] bg-transparen backdrop-blur-sm rounded-full p-3 shadow-lg">
                <img src="/assets/images/book-icon.png" alt="Book" class="w-full h-full object-contain opacity-80" />
            </div>
        </div>

        <div class="absolute bottom-40 left-16 animate-float-slow">
            <div class="w-[100px] h-[100px] bg-transparen backdrop-blur-sm rounded-full p-3 shadow-lg">
                <img src="/assets/images/gear-icon.png" alt="Settings" class="w-full h-full object-contain opacity-80" />
            </div>
        </div>


        <div class="relative z-10 text-center text-white">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full backdrop-blur-sm mb-8">
            <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>

          <h2 class="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Untuk Karir Ideal dan<br>
            <span class="text-transparent bg-clip-text bg-white">
              Masa Depan Gemilang
            </span>
          </h2>

          <!-- Description -->
          <p class="text-xl lg:text-2xl text-white/90 mb-10 max-w-4xl mx-auto leading-relaxed">
            Bergabunglah dengan ribuan siswa yang telah memulai perjalanan menuju kesuksesan. 
            Dapatkan akses ke challenge terbaik, mentor berpengalaman, dan komunitas developer masa depan.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              @click="handleGetStarted"
              class="group relative px-8 py-4 bg-white text-primary rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 min-w-[200px]"
            >
              <span class="relative z-10">Mulai Sekarang!</span>
              <div class="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </button>

            <button class="group px-8 py-4 border-2 border-white text-white rounded-2xl font-semibold text-lg hover:bg-white hover:text-primary transition-all duration-300 min-w-[200px]">
              Pelajari Lebih Lanjut
              <svg class="inline-block w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-br from-transparent via-red-600/10 to-red-800/20 pointer-events-none"></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
}

@keyframes float-delayed {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(-5deg); }
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(3deg); }
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