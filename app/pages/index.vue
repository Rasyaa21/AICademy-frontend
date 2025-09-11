<template>
    <section class="w-full">
        <HeroSection/>
        <FeatureSection/>
        <ChallangeSection/>
        <ProjectSection/>
        <CtaSection/>
    </section>
</template>

<script setup>
import ChallangeSection from '~/components/landing-page/section/ChallangeSection.vue';
import CtaSection from '~/components/landing-page/section/CtaSection.vue';
import FeatureSection from '~/components/landing-page/section/FeatureSection.vue';
import HeroSection from '~/components/landing-page/section/HeroSection.vue';
import ProjectSection from '~/components/landing-page/section/ProjectSection.vue';

definePageMeta({
    layout: 'default'
})
</script>

