<template>
    <div class="p-6 bg-white rounded-xl border shadow-sm">
        <div class="flex flex-col gap-4 justify-between mb-4 lg:flex-row lg:items-center">
            <div>
                <h3 class="text-lg font-semibold text-gray-900">Filter & Pencarian</h3>
                <p class="mt-1 text-sm text-gray-500">
                    {{ filteredCount }} dari {{ totalCount }} team ditemukan
                </p>
            </div>
            <div class="flex gap-2 items-center text-sm text-gray-500">
                <Icon name="heroicons:funnel-20-solid" class="w-4 h-4" />
                <span>Filter aktif: {{ activeFiltersCount }}</span>
            </div>
        </div>

        <div class="flex flex-col gap-4 lg:flex-row">
            <!-- Search -->
            <div class="relative flex-1">
                <Icon
                    name="heroicons:magnifying-glass-20-solid"
                    class="absolute left-3 top-1/2 w-5 h-5 text-gray-400 -translate-y-1/2"
                />
                <input
                    :value="searchQuery"
                    @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
                    type="text"
                    placeholder="Cari team berdasarkan nama atau deskripsi..."
                    class="py-2 pr-4 pl-10 w-full text-sm rounded-xl border border-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
            </div>

            <!-- Team Leader Filter -->
            <div class="relative">
                <select 
                    :value="selectedLeader"
                    @change="$emit('update:selectedLeader', ($event.target as HTMLSelectElement).value)"
                    class="px-4 py-2 pr-8 text-sm font-medium text-gray-700 bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-200 appearance-none cursor-pointer hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                    <option value="" class="text-gray-600">Semua Leader</option>
                    <option v-for="leader in uniqueLeaders" :key="leader" :value="leader">
                        {{ leader }}
                    </option>
                </select>
                <div class="flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none">
                    <Icon name="heroicons:chevron-down-20-solid" class="w-4 h-4 text-gray-400" />
                </div>
            </div>

            <!-- Clear Filters -->
            <button 
                v-if="hasActiveFilters"
                @click="$emit('clear-filters')"
                class="flex gap-2 items-center px-4 py-2 text-sm font-medium text-gray-500 rounded-xl border border-gray-200 transition-colors duration-200 hover:text-gray-700 hover:bg-gray-100"
            >
                <Icon name="heroicons:x-mark-20-solid" class="w-4 h-4" />
                Clear All
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    searchQuery: string
    selectedLeader: string
    filteredCount: number
    totalCount: number
    activeFiltersCount: number
    hasActiveFilters: boolean
    uniqueLeaders: string[]
}>()

defineEmits<{
    'update:searchQuery': [value: string]
    'update:selectedLeader': [value: string]
    'clear-filters': []
}>()
</script> 