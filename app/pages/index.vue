<template>
    <section class="w-full">
        <HeroSection/>
        <FeatureSection/>
        <ChallangeSection/>
        <ProjectSection/>
    </section>
</template>

<script setup>
import ProjectCard from '~/components/landing-page/ProjectCard.vue';
import ChallangeSection from '~/components/landing-page/section/ChallangeSection.vue';
import FeatureSection from '~/components/landing-page/section/FeatureSection.vue';
import HeroSection from '~/components/landing-page/section/HeroSection.vue';
import ProjectSection from '~/components/landing-page/section/ProjectSection.vue';

definePageMeta({
    layout: 'default'
})
</script>

