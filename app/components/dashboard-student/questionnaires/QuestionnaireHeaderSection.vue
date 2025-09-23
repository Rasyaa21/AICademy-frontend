<template>
    <div class="space-y-4 text-center">
        <div class="inline-flex justify-center items-center mb-4 w-16 h-16 rounded-full bg-primary/10">
            <Icon name="heroicons:clipboard-document-list-20-solid" class="w-8 h-8 text-primary" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900">Kuesioner Peminatan Karir IT</h1>
        <p class="mx-auto max-w-2xl text-lg text-gray-600">
            Jawab {{ totalQuestions }} pertanyaan berikut untuk mengetahui jalur karir IT yang paling sesuai dengan kepribadian dan minat Anda
        </p>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    totalQuestions: number
}>()
</script> 