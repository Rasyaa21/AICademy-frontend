<!-- components/dashboard-student/ProfilingBanner.vue -->
<template>
    <div class="overflow-hidden relative p-4 bg-gradient-to-br to-red-600 rounded-3xl shadow-xl from-primary lg:p-8">
        <!-- Background decorations -->
        <div class="absolute inset-0 opacity-10">
            <div class="absolute top-10 left-10 w-32 h-32 rounded-full border-2 border-white"></div>
            <div class="absolute right-10 bottom-10 w-24 h-24 rounded-full border-2 border-white"></div>
            <div class="absolute top-1/2 left-1/4 w-16 h-16 rounded-full border border-white"></div>
            <div class="absolute left-10 bottom-1/4 w-20 h-20 rounded-full border border-white"></div>
        </div>

        <!-- Content -->
        <div class="relative z-10 text-white text-start">
            <h2 class="mb-6 font-semibold leading-tight text-md lg:text-md">
                Profiling & Roadmap
            </h2>

            <p class="mx-auto mb-4 max-w-4xl text-2xl font-bold leading-relaxed lg:text-4xl text-white/90">
                Lanjutkan Perjalanan <br/> Menuju Karir
            </p>
            
            <div class="flex flex-row gap-3">
                <div class="px-4 py-2 bg-white rounded-xl w-fit">
                    <NuxtLink to="/student/dashboard/questionnaires" class="font-bold transition-colors text-primary text-md hover:text-primary/80">
                        Isi Profiling
                    </NuxtLink>
                </div>
            </div>
        </div>
        <div class="absolute inset-0 bg-gradient-to-br from-transparent pointer-events-none via-red-600/10 to-red-800/20"></div>
    </div>
</template>

<script setup lang="ts">
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