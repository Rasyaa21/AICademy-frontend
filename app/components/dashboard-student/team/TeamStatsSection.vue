<template>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div class="p-6 bg-white rounded-xl border shadow-sm">
            <div class="flex justify-between items-center">
                <div>
                    <p class="text-sm text-gray-500">Total Team</p>
                    <p class="text-2xl font-bold text-gray-900">{{ teamStats.total }}</p>
                </div>
                <div class="flex justify-center items-center w-12 h-12 rounded-xl bg-primary/10">
                    <Icon name="heroicons:users-20-solid" class="w-6 h-6 text-primary" />
                </div>
            </div>
        </div>

        <div class="p-6 bg-white rounded-xl border shadow-sm">
            <div class="flex justify-between items-center">
                <div>
                    <p class="text-sm text-gray-500">Team Aktif</p>
                    <p class="text-2xl font-bold text-green-600">{{ teamStats.active }}</p>
                </div>
                <div class="flex justify-center items-center w-12 h-12 bg-green-100 rounded-xl">
                    <Icon name="heroicons:bolt-20-solid" class="w-6 h-6 text-green-600" />
                </div>
            </div>
        </div>

        <div class="p-6 bg-white rounded-xl border shadow-sm">
            <div class="flex justify-between items-center">
                <div>
                    <p class="text-sm text-gray-500">Butuh Member</p>
                    <p class="text-2xl font-bold text-blue-600">{{ teamStats.recruiting }}</p>
                </div>
                <div class="flex justify-center items-center w-12 h-12 bg-blue-100 rounded-xl">
                    <Icon name="heroicons:user-plus-20-solid" class="w-6 h-6 text-blue-600" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface TeamStats {
    total: number
    active: number
    recruiting: number
}

defineProps<{
    teamStats: TeamStats
}>()
</script> 