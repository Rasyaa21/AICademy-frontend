<template>
        <section
        class="w-full relative bg-top bg-no-repeat bg-cover"
        :style="sectionBgStyle"
    >
        <div class="absolute inset-0 bg-white/30 pointer-events-none"></div>
        <div class="relative max-w-7xl mx-auto px-6 py-20">
            <div class="text-center mb-12">
                <div class="flex items-center space-x-2 mb-4 justify-center">
                    <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 11c1.7 0 3-1.3 3-3S17.7 5 16 5s-3 1.3-3 3 1.3 3 3 3zM8 11c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3zm0 2c-2.3 0-7 1.2-7 3.5V20h14v-3.5C15 14.2 10.3 13 8 13zm8 0c-.3 0-.6 0-.9.1 1 .7 1.9 1.7 1.9 2.9V20h6v-3.5C23 14.2 18.3 13 16 13z"/>
                        </svg>
                    </div>
                    <span class="text-sm font-semibold text-white bg-primary px-3 py-1 rounded-full">
                        Main Feature
                    </span>
                </div>
                <h2 class="text-4xl font-bold text-secondary mb-4">
                    Bukan Sekedar Solusi, Tapi Aksi
                </h2>
                <p class="text-lg text-gray-600">
                    Ada beberapa fitur unggulan yang kami tawarkan untuk menunjang karir Anda
                </p>
            </div>

            <div class="mx-auto space-y-8 pt-6 w-full">
                <FeatureRow
                    title="Profiling Role & Karir"
                    description="Temukan role dan karir impianmu! Isi kuesioner singkat dan cari tahu apa yang sebenarnya kamu suka"
                    icon-src="/assets/images/book-icon.png"
                    align="left"
                />
                <FeatureRow
                    title="Roadmap & Project"
                    description="Buka roadmap karir pilihanmu, lihat progres pembelajaran, dan asah kemampuanmu lewat berbagai projek yang ada"
                    icon-src="/assets/images/book-icon.png"
                    align="right"
                    offset="-mt-8 lg:-mt-16"
                />
                <FeatureRow
                    title="Tim & Challenge"
                    description="Bentuk tim dengan temanmu, selesaikan challenge sebanyak-banyaknya, dan raih peringkat di leaderboard"
                    icon-src="/assets/images/book-icon.png"
                    align="left"
                    offset="-mt-4 lg:-mt-10"
                />
                <FeatureRow
                    title="CV & Perusahaan"
                    description="Susun CV yang profesional dan bangun pengalaman melalui PKL di perusahaan yang terverifikasi"
                    icon-src="/assets/images/book-icon.png"
                    align="right"
                    offset="-mt-8 lg:-mt-20"
                />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import FeatureRow from '../FeatureRow.vue';

const props = withDefaults(defineProps<{backgroundUrl?: string}>(), {
    backgroundUrl: "/assets/images/bg-fitur.png"
})

const sectionBgStyle = computed(() => ({
    backgroundImage: `url('${props.backgroundUrl}')`
}))
</script>
