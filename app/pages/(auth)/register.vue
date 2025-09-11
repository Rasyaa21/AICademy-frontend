<template>
    <section class="w-full py-8 bg-gradient-to-b from-primary to-red-700 relative overflow-hidden min-h-screen flex items-center justify-center">
        <div class="absolute -top-10 -left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-20 -right-10 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl"></div>
        
        <div class="absolute top-32 right-32 w-16 h-16 bg-white/5 rounded-lg rotate-45"></div>
        <div class="absolute bottom-32 left-48 w-20 h-20 bg-white/5 rounded-full"></div>
        <div class="absolute top-1/2 left-8 w-8 h-8 bg-white/10 rounded-full"></div>
        <div class="absolute top-1/4 right-16 w-12 h-12 bg-white/5 rounded-lg rotate-12"></div>

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

        <div class="w-full max-w-6xl mx-auto px-6 relative z-10">
            <div class="bg-white backdrop-blur-xl flex items-center justify-center rounded-3xl shadow-2xl flex-row overflow-hidden border border-white/20">
                <div class="lg:w-1/2 w-full h-full flex flex-col lg:px-12 px-8 items-center lg:py-8 py-12">
                    <div class="text-center mb-8">
                        <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L9 7V9C9 10.1 9.9 11 11 11V14L13 16L15 14V11C16.1 11 17 10.1 17 9H21ZM6 12C7.1 12 8 11.1 8 10S7.1 8 6 8 4 8.9 4 10 4.9 12 6 12ZM18 12C19.1 12 20 11.1 20 10S19.1 8 18 8 16 8.9 16 10 16.9 12 18 12ZM4 18C4 16.9 4.9 16 6 16S8 16.9 8 18 7.1 20 6 20 4 19.1 4 18ZM16 18C16 16.9 16.9 16 18 16S20 16.9 20 18 19.1 20 18 20 16 19.1 16 18Z"/>
                            </svg>
                        </div>
                        <h1 class="text-4xl font-bold text-secondary mb-3">Bergabung Sekarang!</h1>
                        <p class="text-gray-500 text-lg leading-relaxed max-w-md mx-auto">
                            Mulai perjalanan karirmu bersama ribuan siswa lainnya di platform AICademy
                        </p>
                    </div>

                    <!-- Form -->
                    <form action="" class="w-full max-w-md space-y-5">
                        <div class="space-y-2">
                            <label for="name" class="text-sm font-semibold text-gray-700 block">Nama Lengkap</label>
                            <div class="relative">
                                <input 
                                    type="text" 
                                    id="name"
                                    class="border border-gray-200 rounded-xl w-full py-4 px-4 text-gray-700 placeholder-gray-400 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none" 
                                    placeholder="Masukkan nama lengkap"
                                >
                                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label for="email" class="text-sm font-semibold text-gray-700 block">Email</label>
                            <div class="relative">
                                <input 
                                    type="email" 
                                    id="email"
                                    class="border border-gray-200 rounded-xl w-full py-4 px-4 text-gray-700 placeholder-gray-400 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none" 
                                    placeholder="nama@email.com"
                                >
                                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label for="password" class="text-sm font-semibold text-gray-700 block">Password</label>
                            <div class="relative">
                                <input 
                                    type="password" 
                                    id="password"
                                    class="border border-gray-200 rounded-xl w-full py-4 px-4 text-gray-700 placeholder-gray-400 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none" 
                                    placeholder="Minimal 8 karakter"
                                >
                                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label for="confirm-password" class="text-sm font-semibold text-gray-700 block">Konfirmasi Password</label>
                            <div class="relative">
                                <input 
                                    type="password" 
                                    id="confirm-password"
                                    class="border border-gray-200 rounded-xl w-full py-4 px-4 text-gray-700 placeholder-gray-400 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none" 
                                    placeholder="Ulangi password"
                                >
                                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Register Button -->
                        <button 
                            type="submit"
                            class="w-full bg-gradient-to-r from-primary to-red-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-primary/90 hover:to-red-600/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mt-8"
                        >
                            Daftar Sekarang
                        </button>

                        <!-- Login Link -->
                        <div class="text-center pt-4">
                            <span class="text-gray-600">Sudah punya akun? </span>
                            <a href="/login" class="text-primary font-semibold hover:text-primary/80 transition-colors">
                                Masuk di sini
                            </a>
                        </div>
                    </form>

                    <!-- Help Section -->
                    <div class="text-center mt-8 pt-2 border-t border-gray-100">
                        <p class="text-gray-600 mb-1">Butuh bantuan?</p>
                        <a href="mailto:aicademy@app.com" class="text-primary font-semibold hover:text-primary/80 transition-colors">
                            aicademy@app.com
                        </a>
                    </div>
                </div>

                <div class="hidden lg:flex lg:w-1/2 h-full items-center justify-center relative overflow-hidden">
                        <img 
                            src="/assets/images/login.png" 
                            alt="Register Illustration" 
                            class="w-full max-w-md mx-auto drop-shadow-lg"
                        >
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
definePageMeta({
    layout: false
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