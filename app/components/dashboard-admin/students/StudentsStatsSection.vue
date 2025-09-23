<template>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
        <div class="p-6 bg-white rounded-xl border shadow-sm">
            <div class="flex justify-between items-center">
                <div>
                    <p class="text-sm text-gray-500">Total Siswa</p>
                    <p class="text-2xl font-bold text-gray-900">{{ studentStats.total }}</p>
                </div>
                <div class="flex justify-center items-center w-12 h-12 rounded-xl bg-primary/10">
                    <Icon name="heroicons:users-20-solid" class="w-6 h-6 text-primary" />
                </div>
            </div>
        </div>

        <div class="p-6 bg-white rounded-xl border shadow-sm">
            <div class="flex justify-between items-center">
                <div>
                    <p class="text-sm text-gray-500">Partisipasi Challenge</p>
                    <p class="text-2xl font-bold text-purple-600">{{ studentStats.challengeParticipants }}</p>
                </div>
                <div class="flex justify-center items-center w-12 h-12 bg-purple-100 rounded-xl">
                    <Icon name="heroicons:trophy-20-solid" class="w-6 h-6 text-purple-600" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface StudentStats {
    total: number
    active: number
    newThisMonth: number
    challengeParticipants: number
}

defineProps<{
    studentStats: StudentStats
}>()
</script> 