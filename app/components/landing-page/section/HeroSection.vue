<template>
    <div class="w-full bg-gradient-to-b from-primary to-red-700 rounded-b-3xl 
                    flex flex-col items-center justify-center relative overflow-hidden 
                    pt-20 lg:pb-40">

            <div class="absolute -top-10 -left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
            <div class="absolute -bottom-20 -right-10 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl"></div>
            
            <div class="absolute top-32 right-32 w-16 h-16 bg-white/5 rounded-lg rotate-45"></div>
            <div class="absolute bottom-32 left-48 w-20 h-20 bg-white/5 rounded-full"></div>
            <div class="absolute top-1/2 left-8 w-8 h-8 bg-white/10 rounded-full"></div>
            <div class="absolute top-1/4 right-16 w-12 h-12 bg-white/5 rounded-lg rotate-12"></div>
            

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


            <h1 
                class="text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center leading-tight mb-6 drop-shadow-lg z-10 relative"
                >
                Temukan Karir <br /> Yang Kamu Banget
            </h1>

            <div class="mx-auto max-w-3xl px-4 sm:px-6 md:px-12 lg:px-2 z-10 relative">
                <h2 class="text-base md:text-lg lg:text-xl text-white text-center py-4 leading-relaxed">
                Bangun masa depan karir yang sesuai passion dan kemampuanmu. Mulai dari profiling keahlian hingga koneksi ke perusahaan, semuanya ada di satu platform!
                </h2>
            </div>

            <div class="px-8 py-4 bg-white rounded-2xl m-6 shadow-xl hover:scale-105 transition z-10 relative">
                <a href="#" class="text-primary font-bold">Mulai Sekarang</a>
            </div>

            <div class="flex items-center space-x-6 mt-4 mb-8 z-10 relative">
                <div class="flex items-center space-x-2">
                    <div class="flex -space-x-2">
                        <div class="w-8 h-8 bg-[url(/assets/images/profile/sigma-2.jpeg)] bg-cover rounded-full border-2 border-white"></div>
                        <div class="w-8 h-8 bg-[url(/assets/images/profile/sigma.jpeg)] bg-cover rounded-full border-2 border-white"></div>
                        <div class="w-8 h-8 bg-[url(/assets/images/profile/sigma-3.jpeg)] bg-cover rounded-full border-2 border-white"></div>
                        <div class="w-8 h-8 bg-[url(/assets/images/profile/axel.jpeg)] bg-cover rounded-full border-2 border-white flex items-center justify-center">
                            <span class="text-xs text-white font-bold">5K+</span>
                        </div>
                    </div>
                    <p class="text-white text-sm">Dipercaya Oleh Para Siswa</p>
                </div>
                <div class="flex items-center space-x-1">
                    <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <span class="text-white text-sm font-semibold">4.3/5</span>
                    <span class="text-white/80 text-sm">(100+ reviews)</span>
                </div>
            </div>

            <h2 class="text-base md:text-lg lg:text-xl text-white text-center py-4 leading-relaxed font-bold pt-8 z-10 relative">
                Partner dan Kolaborator Kami
            </h2>

            <NuxtMarquee
                class="mx-auto max-w-4xl mb-64 z-10 relative"
                :gradient="false"
                :pauseOnHover="true"
                :clone="true"
                :duration="22"
            >
                <div class="shrink-0 mx-10">
                <img src="/assets/images/logo_smk_telkom_pwt.png" alt="SMK Telkom Purwokerto" class="h-14 md:h-20 object-contain" />
                </div>
                <div class="shrink-0 mx-10">
                <img src="/assets/images/telkom_school.png" alt="Telkom Schools" class="h-14 md:h-16 object-contain" />
                </div>
                <div class="shrink-0 mx-10">
                <img src="/assets/images/logo_smk_telkom_pwt.png" alt="Dicoding" class="h-14 md:h-16 object-contain" />
                </div>
            </NuxtMarquee>
        </div>

        <div class="w-full bg-light relative lg:pt-96 pt-12 items-center justify-center flex pb-20">
            <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <div class="relative w-screen flex justify-center px-8">
                    <div class="relative">
                        <img
                            src="/assets/images/dashboard.png"
                            alt="Dashboard"
                            class="w-full max-w-6xl h-auto"
                        />
                    </div>
                </div>
            </div>

            <div class="max-w-7xl mx-auto px-6 pb-20 lg:pt-28 pt-48">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div class="space-y-6">
                        <div class="flex items-center space-x-2 mb-4">
                            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                            </div>
                            <span class="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                                #1 Career Platform
                            </span>
                        </div>
                        
                        <h2 class="text-4xl lg:text-5xl font-bold text-secondary leading-tight">
                            Temukan Potensi dan <br /> Rangkai Masa Depanmu!
                        </h2>
                        <p class="text-lg text-gray-600 leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean non erat ut tortor maximus auctor. Morbi condimentum neque magna, bibendum mauris non laoreet mi. Dus tempor orci at tristique volutpat.
                        </p>
                        
                        <!-- Stats Row -->
                        <div class="grid grid-cols-3 gap-4 py-6">
                            <div class="text-center">
                                <div class="text-2xl font-bold text-primary">15K+</div>
                                <div class="text-sm text-gray-600">Students</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-primary">2.5K+</div>
                                <div class="text-sm text-gray-600">Companies</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-primary">98%</div>
                                <div class="text-sm text-gray-600">Success Rate</div>
                            </div>
                        </div>
                        
                        <div class="flex gap-4 pt-4">
                            <button class="px-8 py-3 bg-secondary text-white rounded-2xl font-semibold hover:bg-secondary/90 transition-colors">
                                Mulai Sekarang!
                            </button>
                        </div>
                    </div>
                    <div class="flex justify-center lg:justify-end">
                        <div class="relative">
                            <img src="/assets/images/dashboard.png" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>
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

@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
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

.animate-bounce-slow {
  animation: bounce-slow 4s ease-in-out infinite;
}
</style>

<script setup>

</script>