<template>
    <div class="min-h-screen flex flex-col">
        <header
                :class="[
                'w-full bg-primary sticky top-0 z-50 transition-shadow duration-300',
                hasShadow ? 'shadow-md' : ''
                ]"
            >
            <AppBar/>
        </header>

        <main class="flex-1">
            <slot />
        </main>

        <footer class="w-full bg-secondary text-white">
            <Footer/>
        </footer>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import AppBar from './default-layout/AppBar.vue';
import Footer from './default-layout/Footer.vue';

const hasShadow = ref(false);

const handleScroll = () => {
    hasShadow.value = window.scrollY > 0;
}

onMounted(() => {
    window.addEventListener("scroll", handleScroll);
})

onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll);
});
</script>