<!-- filepath: /Users/rasya2121/Documents/code/pkl/JHIC/aicademy-frontend/app/pages/(auth)/email-verification.vue -->
<template>
    <section class="w-full py-8 bg-gradient-to-b from-primary to-red-700 relative overflow-hidden min-h-screen flex items-center justify-center">
        <!-- Background Elements -->
        <div class="absolute -top-10 -left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-20 -right-10 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl"></div>
        
        <div class="absolute top-32 right-32 w-16 h-16 bg-white/5 rounded-lg rotate-45"></div>
        <div class="absolute bottom-32 left-48 w-20 h-20 bg-white/5 rounded-full"></div>
        <div class="absolute top-1/2 left-8 w-8 h-8 bg-white/10 rounded-full"></div>
        <div class="absolute top-1/4 right-16 w-12 h-12 bg-white/5 rounded-lg rotate-12"></div>

        <!-- Floating Icons -->
        <div class="absolute top-24 left-32 lg:left-48 animate-float">
            <div class="w-[80px] h-[80px] bg-white/10 backdrop-blur-sm rounded-full p-3 shadow-lg">
                <img src="/assets/images/home-icon.png" alt="Home" class="w-full h-full object-contain opacity-80" />
            </div>
        </div>

        <div class="absolute top-1/3 right-24 lg:right-32 animate-float-delayed">
            <div class="w-[80px] h-[80px] bg-white/10 backdrop-blur-sm rounded-full p-3 shadow-lg">
                <img src="/assets/images/book-icon.png" alt="Book" class="w-full h-full object-contain opacity-80" />
            </div>
        </div>

        <div class="absolute bottom-40 left-16 animate-float-slow">
            <div class="w-[80px] h-[80px] bg-white/10 backdrop-blur-sm rounded-full p-3 shadow-lg">
                <img src="/assets/images/gear-icon.png" alt="Settings" class="w-full h-full object-contain opacity-80" />
            </div>
        </div>

        <!-- Main Content -->
        <div class="w-full max-w-2xl mx-auto px-6 relative z-10">
            <div class="bg-white backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20 py-12 px-8">
                <div class="text-center">
                    <!-- Success Icon -->
                    <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-green-100">
                        <Icon name="heroicons:check-circle-20-solid" class="w-10 h-10 text-green-600" />
                    </div>

                    <!-- Title -->
                    <h1 class="text-4xl font-bold text-primary mb-4">
                        Email Berhasil Diverifikasi!
                    </h1>

                    <!-- Message -->
                    <p class="text-gray-600 text-lg leading-relaxed max-w-md mx-auto mb-8">
                        Selamat! Email Anda telah berhasil diverifikasi. Sekarang Anda dapat masuk ke akun AICademy Anda.
                    </p>

                    <!-- Login Button -->
                    <NuxtLink 
                        to="/login"
                        class="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-red-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-primary/90 hover:to-red-600/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <Icon name="heroicons:arrow-left-20-solid" class="w-5 h-5" />
                        Kembali ke Login
                    </NuxtLink>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
definePageMeta({
    layout: false
})

// SEO Meta
useSeoMeta({
    title: 'Email Terverifikasi - AICademy',
    description: 'Email Anda telah berhasil diverifikasi. Silakan login ke akun AICademy Anda.',
})
</script>

<style scoped>
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
</style>
