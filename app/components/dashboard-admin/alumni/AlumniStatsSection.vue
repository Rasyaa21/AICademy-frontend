<template>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div class="flex items-center">
                <div class="p-3 bg-blue-100 rounded-lg">
                    <Icon name="heroicons:academic-cap" class="w-6 h-6 text-blue-600" />
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-500">Total Alumni</p>
                    <p class="text-2xl font-semibold text-gray-900">{{ alumniStats.total }}</p>
                </div>
            </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div class="flex items-center">
                <div class="p-3 bg-green-100 rounded-lg">
                    <Icon name="heroicons:user-plus" class="w-6 h-6 text-green-600" />
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-500">Alumni Baru Bulan Ini</p>
                    <p class="text-2xl font-semibold text-gray-900">{{ alumniStats.newThisMonth }}</p>
                </div>
            </div>
        </div>

        
    </div>
</template>

<script setup lang="ts">
interface AlumniStats {
    total: number
    newThisMonth: number
}

defineProps<{
    alumniStats: AlumniStats
}>()
</script>