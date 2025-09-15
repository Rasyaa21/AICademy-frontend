<!-- components/dashboard-student/ProfilingBanner.vue -->
<template>
    <div class="relative bg-gradient-to-br from-primary to-red-600 rounded-3xl p-4 lg:p-8 overflow-hidden shadow-xl">
        <!-- Background decorations -->
        <div class="absolute inset-0 opacity-10">
            <div class="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
            <div class="absolute bottom-10 right-10 w-24 h-24 border-2 border-white rounded-full"></div>
            <div class="absolute top-1/2 left-1/4 w-16 h-16 border border-white rounded-full"></div>
            <div class="absolute bottom-1/4 left-10 w-20 h-20 border border-white rounded-full"></div>
        </div>

        <!-- Content -->
        <div class="relative z-10 text-start text-white">
            <h2 class="text-md lg:text-md font-semibold mb-6 leading-tight">
                Profiling & Roadmap
            </h2>

            <p class="text-2xl lg:text-4xl text-white/90 mb-4 max-w-4xl mx-auto leading-relaxed font-bold">
                Lanjutkan Perjalanan <br/> Menuju Karir
            </p>
            
            <div class="px-4 py-2 rounded-md bg-white w-fit">
                <NuxtLink to="/profiling" class="text-primary font-bold text-md hover:text-primary/80 transition-colors">
                    Isi Profiling >
                </NuxtLink>
            </div>
        </div>

        <!-- Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-br from-transparent via-red-600/10 to-red-800/20 pointer-events-none"></div>
    </div>
</template>

<script setup lang="ts">
// Component props if needed
interface Props {
    title?: string
    subtitle?: string
    ctaText?: string
    ctaLink?: string
}

const props = withDefaults(defineProps<Props>(), {
    title: 'Profiling & Roadmap',
    subtitle: 'Lanjutkan Perjalanan Menuju Karir',
    ctaText: 'Isi Profiling >',
    ctaLink: '/profiling'
})
</script>