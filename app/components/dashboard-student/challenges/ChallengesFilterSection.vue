<template>
  <div class="bg-white rounded-lg border p-6">
    <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
      <!-- Search -->
      <div class="flex-1 max-w-md">
        <div class="relative">
          <input
            :value="searchQuery"
            @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
            type="text"
            placeholder="Cari challenge..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
          <Icon name="heroicons:magnifying-glass-20-solid" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-3 items-center">
        <!-- Status Filter -->
        <select
          :value="selectedStatus"
          @change="$emit('update:selectedStatus', ($event.target as HTMLSelectElement).value)"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
        >
          <option value="">Semua Status</option>
          <option value="active">Active</option>
          <option value="ended">Berakhir</option>
        </select>

        <!-- Clear Filters -->
        <button
          v-if="hasActiveFilters"
          @click="$emit('clearFilters')"
          class="px-3 py-2 text-sm text-gray-600 hover:text-red-600 border border-gray-300 rounded-lg hover:border-red-300 transition-colors"
        >
          Clear Filters ({{ activeFiltersCount }})
        </button>
      </div>
    </div>

    <!-- Results count -->
    <div class="mt-4 text-sm text-gray-600">
      Menampilkan {{ filteredCount }} dari {{ totalCount }} challenge
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
  'clearFilters': []
}>()
</script>