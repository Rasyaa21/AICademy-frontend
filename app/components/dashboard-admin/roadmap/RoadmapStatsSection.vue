<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="bg-white p-6 rounded-xl shadow-sm border">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-gray-500 text-sm">Total Roadmap</p>
                    <p class="text-2xl font-bold text-gray-900">{{ roadmapStats.total }}</p>
                </div>
                <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon name="heroicons:map-20-solid" class="w-6 h-6 text-primary" />
                </div>
            </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-gray-500 text-sm">Roadmap Aktif</p>
                    <p class="text-2xl font-bold text-green-600">{{ roadmapStats.active }}</p>
                </div>
                <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Icon name="heroicons:check-circle-20-solid" class="w-6 h-6 text-green-600" />
                </div>
            </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-gray-500 text-sm">Draft</p>
                    <p class="text-2xl font-bold text-yellow-600">{{ roadmapStats.draft }}</p>
                </div>
                <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Icon name="heroicons:document-text-20-solid" class="w-6 h-6 text-yellow-600" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { RoadmapStats } from '~/types/Roadmap'

defineProps<{
    roadmapStats: RoadmapStats
}>()
</script>

<style scoped>
.roadmap-stats {
    margin: 20px 0;
}
</style>