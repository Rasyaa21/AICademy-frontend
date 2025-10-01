<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="bg-white p-6 rounded-xl shadow-sm border">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-gray-500 text-sm">Total Peran</p>
                    <p class="text-2xl font-bold text-gray-900">{{ roleStats.total }}</p>
                </div>
                <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon name="heroicons:shield-check-20-solid" class="w-6 h-6 text-primary" />
                </div>
            </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-gray-500 text-sm">Peran Aktif</p>
                    <p class="text-2xl font-bold text-green-600">{{ roleStats.active }}</p>
                </div>
                <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Icon name="heroicons:check-circle-20-solid" class="w-6 h-6 text-green-600" />
                </div>
            </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-gray-500 text-sm">Peran Tidak Aktif</p>
                    <p class="text-2xl font-bold text-gray-600">{{ roleStats.draft }}</p>
                </div>
                <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Icon name="heroicons:x-circle-20-solid" class="w-6 h-6 text-gray-600" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    roleStats: {
        total: number
        active: number
        draft: number
        totalUsers?: number
    }
}

defineProps<Props>()
</script>