<!-- components/dashboard-student/challange/ChallengeStats.vue -->
<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-6 rounded-xl shadow-sm border">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-gray-500 text-sm">Total Challenge</p>
                    <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
                </div>
                <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon name="heroicons:puzzle-piece-20-solid" class="w-6 h-6 text-primary" />
                </div>
            </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-gray-500 text-sm">Challenge Aktif</p>
                    <p class="text-2xl font-bold text-green-600">{{ stats.active }}</p>
                </div>
                <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Icon name="heroicons:clock-20-solid" class="w-6 h-6 text-green-600" />
                </div>
            </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-gray-500 text-sm">Berakhir</p>
                    <p class="text-2xl font-bold text-red-600">{{ stats.completed }}</p>
                </div>
                <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <Icon name="heroicons:trophy-20-solid" class="w-6 h-6 text-red-600" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ChallengeStats } from '~/types/Challange'

defineProps<{
    stats: ChallengeStats
}>()
</script>