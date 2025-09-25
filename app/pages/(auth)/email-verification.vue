<!-- filepath: /Users/rasya2121/Documents/code/pkl/JHIC/aicademy-frontend/app/pages/(auth)/email-verification.vue -->
<template>
    <section class="flex overflow-hidden relative justify-center items-center py-8 w-full min-h-screen bg-gradient-to-b to-red-700 from-primary">
        <!-- Background Elements -->
        <div class="absolute -top-10 -left-10 w-72 h-72 rounded-full blur-3xl bg-white/10"></div>
        <div class="absolute -right-10 -bottom-20 w-96 h-96 rounded-full blur-3xl bg-pink-400/20"></div>
        
        <div class="absolute top-32 right-32 w-16 h-16 rounded-lg rotate-45 bg-white/5"></div>
        <div class="absolute bottom-32 left-48 w-20 h-20 rounded-full bg-white/5"></div>
        <div class="absolute left-8 top-1/2 w-8 h-8 rounded-full bg-white/10"></div>
        <div class="absolute right-16 top-1/4 w-12 h-12 rounded-lg rotate-12 bg-white/5"></div>

        <!-- Floating Icons -->
        <div class="absolute top-24 left-32 lg:left-48 animate-float">
            <div class="w-[80px] h-[80px] bg-white/10 backdrop-blur-sm rounded-full p-3 shadow-lg">
                <img src="/assets/images/home-icon.png" alt="Home" class="object-contain w-full h-full opacity-80" />
            </div>
        </div>

        <div class="absolute right-24 top-1/3 lg:right-32 animate-float-delayed">
            <div class="w-[80px] h-[80px] bg-white/10 backdrop-blur-sm rounded-full p-3 shadow-lg">
                <img src="/assets/images/book-icon.png" alt="Book" class="object-contain w-full h-full opacity-80" />
            </div>
        </div>

        <div class="absolute left-16 bottom-40 animate-float-slow">
            <div class="w-[80px] h-[80px] bg-white/10 backdrop-blur-sm rounded-full p-3 shadow-lg">
                <img src="/assets/images/gear-icon.png" alt="Settings" class="object-contain w-full h-full opacity-80" />
            </div>
        </div>

        <!-- Main Content -->
        <div class="relative z-10 px-6 mx-auto w-full max-w-2xl">
            <div class="overflow-hidden px-8 py-12 bg-white rounded-2xl border shadow-2xl backdrop-blur-xl border-white/20">
                <div class="text-center">
                    <!-- Success Icon -->
                    <div class="flex justify-center items-center mx-auto mb-6 w-20 h-20 bg-green-100 rounded-full">
                        <Icon name="heroicons:check-circle-20-solid" class="w-10 h-10 text-green-600" />
                    </div>

                    <!-- Title -->
                    <h1 class="mb-4 text-4xl font-bold text-primary">
                        Email Berhasil Diverifikasi!
                    </h1>

                    <!-- Message -->
                    <p class="mx-auto mb-8 max-w-md text-lg leading-relaxed text-gray-600">
                        Selamat! Email Anda telah berhasil diverifikasi. Sekarang Anda dapat masuk ke akun AICademy Anda.
                    </p>

                    <!-- Login Button -->
                    <NuxtLink 
                        to="/login"
                        class="inline-flex gap-2 justify-center items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r to-red-600 rounded-xl shadow-lg transition-all duration-300 transform from-primary hover:from-primary/90 hover:to-red-600/90 hover:shadow-xl hover:-translate-y-0.5"
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
