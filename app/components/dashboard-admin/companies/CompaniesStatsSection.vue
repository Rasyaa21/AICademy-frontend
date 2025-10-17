<template>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-1">
        <div class="p-6 bg-white rounded-xl border shadow-sm">
            <div class="flex justify-between items-center">
                <div>
                    <p class="text-sm text-gray-500">Total Perusahaan</p>
                    <p class="text-2xl font-bold text-gray-900">{{ companyStats.total }}</p>
                </div>
                <div class="flex justify-center items-center w-12 h-12 rounded-xl bg-primary/10">
                    <Icon name="heroicons:building-office-20-solid" class="w-6 h-6 text-primary" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface CompanyStats {
    total: number
    active: number
}

defineProps<{
    companyStats: CompanyStats
}>()
</script> 