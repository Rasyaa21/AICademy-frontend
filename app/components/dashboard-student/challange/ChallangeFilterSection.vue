<template>
    <div class="bg-white rounded-xl p-6 shadow-sm border">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div>
                <h3 class="text-lg font-semibold text-gray-900">Filter & Pencarian</h3>
                <p class="text-sm text-gray-500 mt-1">
                    {{ filteredCount }} dari {{ totalCount }} challenge ditemukan
                </p>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-500">
                <Icon name="heroicons:funnel-20-solid" class="w-4 h-4" />
                <span>Filter aktif: {{ activeFiltersCount }}</span>
            </div>
        </div>

        <div class="flex flex-col lg:flex-row gap-4">
            <!-- Search -->
            <div class="relative flex-1">
                <Icon
                    name="heroicons:magnifying-glass-20-solid"
                    class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                />
                <input
                    :value="searchQuery"
                    @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
                    type="text"
                    placeholder="Cari challenge berdasarkan judul atau deskripsi..."
                    class="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm 
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                           transition-all duration-200"
                />
            </div>

            <div class="relative">
                <select 
                    :value="selectedStatus"
                    @change="$emit('update:selectedStatus', ($event.target as HTMLSelectElement).value)"
                    class="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm font-medium text-gray-700 
                           hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                           transition-all duration-200 cursor-pointer shadow-sm"
                >
                    <option value="" class="text-gray-600">Semua Status</option>
                    <option value="active">Aktif</option>
                    <option value="completed">Berakhir</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Icon name="heroicons:chevron-down-20-solid" class="w-4 h-4 text-gray-400" />
                </div>
            </div>

            <!-- Clear Filters -->
            <button 
                v-if="hasActiveFilters"
                @click="$emit('clear-filters')"
                class="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 
                       rounded-xl transition-colors duration-200 flex items-center gap-2 border border-gray-200"
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
    selectedStatus: string
    filteredCount: number
    totalCount: number
    activeFiltersCount: number
    hasActiveFilters: boolean
}>()

defineEmits<{
    'update:searchQuery': [value: string]
    'update:selectedStatus': [value: string]
    'clear-filters': []
}>()
</script> 